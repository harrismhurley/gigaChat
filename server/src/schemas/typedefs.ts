const typeDefs = `
  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    email: String!
  }

  type Message {
    id: ID!
    content: String!
  }

  type Query {
    messages: [Message!]
    message(id: ID!): Message
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    deleteUser(id: ID!): User!
    addMessage(content: String!): Message
    updateMessage(id: ID!, content: String!): Message
    deleteMessage(id: ID!): Message
  }

  type Subscription {
    messageAdded: Message
    messageUpdated: Message
    messageDeleted: Message
  }
`;


export default typeDefs;
