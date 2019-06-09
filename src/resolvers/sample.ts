import * as mongoose from "mongoose"
import { Context } from "apollo-server-core"
import { IResolvers } from "graphql-tools"
import debug from "debug"
import fs from "fs"
import { GraphQLResolveInfo } from "graphql"
import path from "path"
import storeFS from "../utils/store-fs"
import { SAMPLE_DIR, SAMPLE_URL, STATIC_DIR } from "../config"
import Sample, {
  ISample,
  ISampleCreateInput,
  ISampleMutationResponse
} from "../models/sample"
import { IUpload } from "../schemas"
import { hasFileExtension, isValidAudioMIMEType } from "../utils/validators"

const debugFs = debug("api:fs")
const debugDb = debug("api:db")

/**
 * Process the samples query.
 */
export const processSamples = async (
  model: mongoose.Model<ISample>,
  args: any
) => {
  return model.find({})
}

/**
 * Processes createSample mutation.
 */
export const processCreateSample = async (
  model: mongoose.Model<ISample>,
  store: (
    file: IUpload
  ) => Promise<{ id: string; filePath: string; fileExtension: string }>,
  args: { input: ISampleCreateInput }
): Promise<ISampleMutationResponse> => {
  const { file, label, group } = args.input
  const upload = await file

  if (!hasFileExtension(upload.filename)) {
    throw new Error(`Filename extension required, ${upload.filename} given`)
  }

  if (!isValidAudioMIMEType(upload.mimetype)) {
    throw new Error(`Audio MIME type required, ${upload.mimetype} given`)
  }

  const { id, filePath, fileExtension } = await store(upload)
  const url = `${SAMPLE_URL}/${id}.${fileExtension}`

  debugFs(`Stored sample file at path ${filePath}`)

  const sample = await model.create({
    id,
    filename: upload.filename,
    url,
    type: upload.mimetype,
    label: label || upload.filename,
    group,
    // createdAt: new Date(),
    // updatedAt: new Date()
  })

  return {
    code: 200,
    success: true,
    messageTemplate: `mutation.createSample.success`,
    message: `The sample n°${id} has been created successfully`,
    sample
  }
}

/**
 * Processes the updateSample mutation.
 *
 * @param parent
 * @param id
 * @param input
 * @param context
 * @param models
 * @return {Promise<*>}
 */
const processUpdateSample = async (
  parent: any,
  { id, input }: any,
  context: Context
): Promise<ISampleMutationResponse> => {
  const { label, group } = input
  const update: Partial<ISample> = {}

  if (typeof label !== "undefined") {
    update.label = label
  }

  if (typeof group !== "undefined") {
    update.group = group
  }

  const updatedSample = await Sample.findOneAndUpdate({ id }, update, {
    new: true,
    runValidators: true
  })

  if (!updatedSample) {
    return {
      code: 200,
      success: false,
      messageTemplate: `mutation.updateSample.failure`,
      message: `The sample n°${id} could not be updated because it could not have been retrieved.`
    }
  }

  return {
    code: 200,
    success: true,
    messageTemplate: `mutation.updateSample.success`,
    message: `The sample n°${id} has been updated successfully.`,
    sample: (updatedSample as unknown) as ISample
  }
}

/**
 * Processes the deleteSample mutation.
 *
 * @param parent
 * @param id
 * @param context
 * @param models
 * @return {Promise<boolean>}
 */
const processDeleteSample = async (
  parent: any,
  { id }: any,
  context: Context
): Promise<ISampleMutationResponse> => {
  // @ts-ignore
  const deletedSample: ISample = await Sample.findOneAndDelete({ id })

  if (!deletedSample) {
    return {
      code: 200,
      success: false,
      messageTemplate: `mutation.deleteSample.failure`,
      message: `The sample n°${id} could not be deleted`
    }
  }

  try {
    const filePath = path.join(STATIC_DIR, deletedSample.url)
    fs.unlinkSync(filePath)
  } catch (e) {
    debugFs("Error — ", e.toString())
  }

  return {
    code: 200,
    success: true,
    messageTemplate: `mutation.deleteSample.success`,
    message: `The sample n°${id} has been deleted successfully`,
    sample: deletedSample
  }
}

const resolvers: IResolvers = {
  Query: {
    sampleList: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => {
      return processSamples(Sample, args)
    }
  },
  Mutation: {
    createSample: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processCreateSample(Sample, storeFS(SAMPLE_DIR), args),
    updateSample: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processUpdateSample(parent, args, context),
    deleteSample: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processDeleteSample(parent, args, context)
  },
  MutationResponse: {
    __resolveType(obj: any, context: Context, info?: GraphQLResolveInfo) {
      if (obj.sample) {
        return "Sample"
      }

      return null
    }
  }
}

export default resolvers
