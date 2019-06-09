import { IResolvers } from "graphql-tools"
import { Context } from "apollo-server-core"
import { GraphQLResolveInfo } from "graphql"
import uuid from "uuid"
import Sample from "../models/sample"
import Instrument, {
  IInstrumentCreateInput,
  IInstrumentMapping,
  IInstrumentMutationResponse
} from "../models/instrument"

const processInstrumentList = async (
  parent: any,
  args: any,
  context: Context
) => {
  return Instrument.find({})
}

const processCreateInstrument = async (
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
      [...sampleIDSet].map(async sampleID => Sample.findOne({ id: sampleID }))
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
    console.log("mapping", instrumentMapping)

    const instrumentDocument = await Instrument.create({
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

    const returnDocument = await Instrument.findById(instrumentDocument._id)

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
    instrumentList: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => {
      return processInstrumentList(parent, args, context)
    }
  },
  Mutation: {
    createInstrument: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processCreateInstrument(parent, args)
  }
}

export default resolvers
