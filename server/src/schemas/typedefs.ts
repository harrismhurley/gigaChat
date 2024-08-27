const typeDefs = `
  type Message {
    id: ID!
    content: String!
  }

  type Query {
    messages: [Message!]
    message(id: ID!): Message
  }

  type Mutation {
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
