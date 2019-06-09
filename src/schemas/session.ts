import { gql } from "apollo-server-express"

const schema = gql`
  extend type Query {
    session(id: ID!): Session
  }

  extend type Mutation {
    createSession(input: SessionCreateInput): SessionMutationResponse!
    updateSession(input: SessionUpdateInput): SessionMutationResponse!
  }

  type Session {
    "Primary key (UUIDv4)"
    id: ID!

    "ID of the user who creates the session"
    creatorID: ID!

    "Tempo in BPM [20, 200]"
    tempo: Int!

    "Master gain [0, 1]"
    masterGain: Int!

    "ID of the active track — its panel is visible"
    activeTrackID: ID

    "When a track is active, row index (beat) of the currently active cell in the panel"
    activeCellBeat: Int

    "Track IDs to determine the track order"
    trackOrder: [ID]!

    "Sequencer tracks"
    tracks: [Track!]!

    "Instruments used by in tracks"
    instruments: [Instrument!]!

    "Samples played in tracks"
    samples: [Sample!]!

    "Creation date in ISO 8601 Extended Format"
    createdAt: DateTime!

    "Update date in ISO 8601 Exteded Format"
    updatedAt: DateTime!
  }

  input SessionCreateInput {
    creatorID: ID!
  }

  input SessionUpdateInput {
    sessionID: ID!
    
    # new track
    instrumentID: ID
  }

  type SessionMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    messageTemplate: String!
    message: String
    session: Session
    error: String
  }
`

export default schema
