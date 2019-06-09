import { GraphQLDateTime } from "graphql-iso-date"
import { GraphQLUpload } from "graphql-upload"
import sampleResolver from "../resolvers/sample"
import instrumentResolver from "../resolvers/instrument"
import sessionResolver from "../resolvers/session"

const importedResolvers = {
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload
}

const resolverMap = {
  ...importedResolvers,
  Query: {
    ...sampleResolver.Query,
    ...instrumentResolver.Query,
    ...sessionResolver.Query
  },
  Mutation: {
    ...sampleResolver.Mutation,
    ...instrumentResolver.Mutation,
    ...sessionResolver.Mutation
  }
}

export default resolverMap
