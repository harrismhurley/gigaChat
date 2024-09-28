import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWsClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Create a GraphQL WebSocket client
const wsClient = createWsClient({
  url: 'ws://localhost:3000/graphql', // Your GraphQL subscription endpoint
});

// Create a WebSocket link using graphql-ws
const wsLink = new GraphQLWsLink(wsClient);

// Create an HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
});

// Split link based on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Create Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
