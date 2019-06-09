import { gql } from "apollo-server-express"

// Apollo Server 2.0 automatically adds the Upload scalar to the schema
const schema = gql`
  extend type Query {
    sampleList: [Sample!]!
  }

  extend type Mutation {
    createSample(input: SampleCreateInput!): SampleMutationResponse!
  }

  extend type Mutation {
    updateSample(id: ID!, input: SampleUpdateInput!): SampleMutationResponse!
  }

  extend type Mutation {
    deleteSample(id: ID!): SampleMutationResponse!
  }

  type Sample {
    """
    UUID
    """
    id: ID!

    """
    Sample file name
    """
    filename: String!

    """
    Sample url
    """
    url: String!

    """
    Mime type
    """
    type: String!

    """
    Sample label
    """
    label: String!

    """
    Name of the group which the sample belongs to
    """
    group: String

    createdAt: DateTime!

    updatedAt: DateTime!
  }

  input SampleCreateInput {
    file: Upload!
    label: String
    group: String
  }

  input SampleUpdateInput {
    label: String
    group: String
  }

  type SampleMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    messageTemplate: String!
    message: String
    sample: Sample
    error: String
  }
`

export default schema
