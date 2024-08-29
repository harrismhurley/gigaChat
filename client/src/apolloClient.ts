// client/src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { createClient as createWsClient, Client as WsClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Create a GraphQL WebSocket client
const wsClient: WsClient = createWsClient({
  url: 'ws://localhost:3000/graphql', // Your GraphQL subscription endpoint
});

// Create a custom WebSocket link
const wsLink = {
  request: async (operation: { query: any; variables: any }) => {
    const { query, variables } = operation;

    return new Promise((resolve, reject) => {
      const unsubscribe = wsClient.subscribe(
        { query, variables },
        {
          next: (data) => resolve({ data }),
          error: (error) => reject(error),
          complete: () => unsubscribe(),
        }
      );
    });
  },
};

// Create an HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
});

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink as any, // Type assertion since `wsLink` is custom
  httpLink
);

// Create Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
