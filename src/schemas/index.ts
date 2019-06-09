import { gql } from "apollo-server-express"
import { DocumentNode } from "graphql"
import sampleSchema from "../schemas/sample"
import instrumentSchema from "../schemas/instrument"
import processingSchema from "../schemas/processing"
import trackSchema from "../schemas/track"
import colorSchema from "../schemas/color"
import sessionSchema from "../schemas/session"
import { Readable } from "stream"

// workaround
const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    messageTemplate: String!
    message: String
    error: String
  }

  scalar DateTime
  #  scalar Upload
`

const schemas: DocumentNode[] = [
  linkSchema,
  sampleSchema,
  instrumentSchema,
  processingSchema,
  trackSchema,
  colorSchema,
  sessionSchema
]

export default schemas

export interface IMutationResponse {
  code: number
  success: boolean
  messageTemplate: string
  message: string
  error?: string
}

// https://github.com/jaydenseric/graphql-upload#type-fileupload
export interface IUpload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Readable
}
