const typeDefs = `
  type AuthPayload {
    token: String
    user: User
  }

  type S3Payload {
    url: String!
    fileName: String!
  }

  type User {
    id: ID!
    username: String!
  }

  type Event {
    id: ID!
    title: String!
    content: String!
    address: String!
    date: String!
    user: User!
    imageUrl: String
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
    
    addEvent(
      title: String!,
      content: String!,
      address: String!,  
      date: String!,
      userId: ID!,
      imageUrl: String
    ): Event

    updateEvent(
      id: ID!,
      title: String,
      content: String,
      address: String,
      date: String,
      imageUrl: String
    ): Event

    generateUploadURL(fileName: String!, fileType: String!): S3Payload
    generateDownloadURL(fileName: String!): S3Payload
    deleteEvent(id: ID!): Event
  }

  type Subscription {
    eventAdded: Event
    eventUpdated: Event
    eventDeleted: Event
  }
`;

export default typeDefs;
