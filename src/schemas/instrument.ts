import { gql } from "apollo-server-express"

const schema = gql`
  extend type Query {
    instrumentList: [Instrument!]!
  }

  extend type Mutation {
    createInstrument(input: InstrumentCreateInput!): InstrumentMutationResponse!

    deleteInstrument(id: ID!): InstrumentMutationResponse!
  }

  """
  Instrument used to build a sequencer track
  """
  type Instrument {
    "primary key (UUIDv4)"
    id: ID!

    label: String!

    group: String!

    "IDs of the samples used in mappings"
    samples: [Sample!]!

    "MIDI mapping — set of maximum 128 entries"
    mapping: [InstrumentMapping!]!

    "Creation date in ISO 8601 Extended Format"
    createdAt: DateTime!

    "Update date in ISO 8601 Exteded Format"
    updatedAt: DateTime!
  }

  """
  Mapping entry for the instrument
  """
  type InstrumentMapping {
    "Corresponding MIDI note [0, 127]"
    note: Int!

    "The associated sample"
    sample: Sample!

    "Detuning of the pitch in cents"
    detune: Int!
  }

  input InstrumentCreateInput {
    label: String!

    group: String

    mapping: [InstrumentMappingCreateInput!]!
  }

  input InstrumentMappingCreateInput {
    note: Int!

    sampleID: String!

    detune: Int!
  }

  type InstrumentMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    messageTemplate: String!
    message: String
    instrument: Instrument
    error: String
  }
`

export default schema
