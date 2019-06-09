import { IResolvers } from "graphql-tools"
import { Context } from "apollo-server-core"
import { GraphQLResolveInfo } from "graphql"
import uuid from "uuid"
import SessionModel, {
  ISession,
  ISessionCreateInput,
  ISessionMutationResponse,
  ISessionUpdateInput
} from "../models/session"
import InstrumentModel from "../models/instrument"

const processSession = async (
  parent: any,
  args: { id: string },
  context: Context
): Promise<ISession> => {
  const { id } = args
  return SessionModel.findOne({ id })
    .populate("tracks.instrument")
    .populate("instruments")
    .populate("samples")
}

const processCreateSession = async (
  parent: any,
  args: { input: ISessionCreateInput },
  context: Context
): Promise<ISessionMutationResponse> => {
  try {
    const sessionID = uuid.v4()
    const { creatorID } = args.input

    const sessionDocument = await SessionModel.create({
      id: sessionID,
      creatorID,
      tracks: [],
      instruments: [],
      samples: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })

    if (!sessionDocument) {
      return {
        code: 200,
        success: false,
        messageTemplate: `mutation.createSession.failure`,
        message: `Failed to created session`
      }
    }

    const returnDocument = await SessionModel.findById(sessionDocument._id)

    if (!returnDocument) {
      return {
        code: 200,
        success: false,
        messageTemplate: `mutation.createSession.failure`,
        message: `Failed to created session`
      }
    }

    return {
      code: 200,
      success: true,
      messageTemplate: `mutation.createSession.success`,
      message: `Session ${returnDocument.id} created successfully`,
      session: returnDocument.toObject({ virtuals: true })
    }
  } catch (error) {
    throw error
  }
}

const processUpdateSession = async (
  parent: any,
  args: { input: ISessionUpdateInput },
  context: Context
) => {
  const { instrumentID, sessionID } = args.input

  const sessionDocument = await SessionModel.findOne({ id: sessionID })
  if (!sessionDocument) {
    return {
      code: 200,
      success: false,
      messageTemplate: `mutation.updateSession.success`,
      message: `Failed to update session`
    }
  }

  if (instrumentID) {
    const trackID = uuid.v4()
    const instrumentDocument = await InstrumentModel.findOne({
      id: instrumentID
    })
      .populate("samples")
      .populate("mapping.sample")
    const track = {
      id: trackID,
      color: "pink",
      instrument: instrumentDocument._id,
      processing: {gain: {gain: 1}}
    }

    // @ts-ignore
    sessionDocument.tracks.push(track)
    sessionDocument.trackOrder.push(trackID)
    // @ts-ignore
    sessionDocument.instruments.push(instrumentDocument._id)
    instrumentDocument.samples.forEach(doc =>
      // @ts-ignore
      sessionDocument.samples.push(doc._id)
    )
    console.log("sessionDoc", sessionDocument)
  }

  await sessionDocument.save()

  const returnDocument = await SessionModel.findById(sessionDocument._id)
    .populate("tracks.instrument")
    .populate("instruments")
    .populate("samples")
  console.log("return", returnDocument)

  if (!returnDocument) {
    return {
      code: 200,
      success: false,
      messageTemplate: `mutation.updateSession.success`,
      message: `Failed to update session`
    }
  }

  return {
    code: 200,
    success: true,
    messageTemplate: `mutation.updateSession.success`,
    message: `Session ${returnDocument.id} updated successfully`,
    session: returnDocument
  }
}

const resolvers: IResolvers = {
  Query: {
    session: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processSession(parent, args, context)
  },
  Mutation: {
    createSession: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processCreateSession(parent, args, context),

    updateSession: (
      parent: any,
      args: any,
      context: Context,
      info?: GraphQLResolveInfo
    ) => processUpdateSession(parent, args, context)
  }
}

export default resolvers
