import { ApolloServer } from "apollo-server-express"

import resolvers from "./resolvers"
import typeDefs from "./schemas"

export default new ApolloServer({
  context: () => ({}),
  resolvers,
  typeDefs
})
