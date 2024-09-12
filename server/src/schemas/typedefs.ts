// server/src/schemas/typedefs.ts
const typeDefs = `
  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    username: String!
  }

  type Event {
    id: ID!
    title: String!
    content: String!
    address: String
    date: String
  }

  type Query {
    events: [Event!]
    event(id: ID!): Event
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    deleteUser(id: ID!): User!
    addEvent(title: String!, content: String!, address: String, date: String): Event
    updateEvent(id: ID!, title: String, content: String, address: String, date: String): Event
    deleteEvent(id: ID!): Event
  }

  type Subscription {
    eventAdded: Event
    eventUpdated: Event
    eventDeleted: Event
  }
`;

export default typeDefs;
