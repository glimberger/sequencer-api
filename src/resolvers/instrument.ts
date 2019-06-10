import { Model } from "mongoose"
import { IResolvers } from "graphql-tools"
import { GraphQLResolveInfo } from "graphql"
import uuid from "uuid"
import Sample, { ISample } from "../models/sample"
import Instrument, {
  IInstrument,
  IInstrumentCreateInput,
  IInstrumentMapping,
  IInstrumentMutationResponse
} from "../models/instrument"

export const processInstrumentList = async (
  model: Model<IInstrument>,
  parent: any,
  args: any
) => {
  return model.find({})
}

export const processCreateInstrument = async (
  models: { instrument: Model<IInstrument>; sample: Model<ISample> },
  parent: any,
  args: { input: IInstrumentCreateInput }
): Promise<IInstrumentMutationResponse> => {
  try {
    const id = uuid.v4()
    const { label, group, mapping } = args.input

    // sample ID set - no duplicates
    const sampleIDSet = new Set<string>()
    mapping.forEach(({ sampleID }) => sampleIDSet.add(sampleID))

    // fetch sample documents - should contain null values
    const sampleDocuments = await Promise.all(
      [...sampleIDSet].map(async sampleID =>
        models.sample.findOne({ id: sampleID })
      )
    )

    const sampleDocument = (sampleID: string) =>
      sampleDocuments.find(doc => doc && doc.id === sampleID)

    const instrumentMapping = mapping
      .map(
        ({ note, sampleID, detune }): IInstrumentMapping => {
          const doc = sampleDocument(sampleID)

          if (!doc) {
            return null
          }

          return { note, sample: doc._id, detune }
        }
      )
      .filter(m => !!m)

    const instrumentDocument = await models.instrument.create({
      id,
      label,
      group,
      samples: sampleDocuments.filter(doc => !!doc).map(doc => doc._id),
      mapping: instrumentMapping,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (!instrumentDocument) {
      return {
        code: 200,
        success: false,
        messageTemplate: `mutation.createSample.success`,
        message: `Failed to create instrument`
      }
    }

    const returnDocument = await models.instrument.findById(
      instrumentDocument._id
    )

    if (!returnDocument) {
      return {
        code: 200,
        success: false,
        messageTemplate: `mutation.createSample.success`,
        message: `Failed to create instrument`
      }
    }

    return {
      code: 200,
      success: true,
      messageTemplate: `mutation.createSample.success`,
      message: `The instrument n°${id} has been created successfully`,
      instrument: returnDocument.toObject()
    }
  } catch (error) {
    throw error
  }
}

const resolvers: IResolvers = {
  Query: {
    instrumentList: (parent: any, args: any, info?: GraphQLResolveInfo) =>
      processInstrumentList(Instrument, parent, args)
  },
  Mutation: {
    createInstrument: (parent: any, args: any, info?: GraphQLResolveInfo) =>
      processCreateInstrument(
        { instrument: Instrument, sample: Sample },
        parent,
        args
      )
  }
}

export default resolvers
