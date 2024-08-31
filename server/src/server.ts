import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import typeDefs from './schemas/typedefs';
import resolvers from './schemas/resolvers';

const port = 3000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

app.use(cors());

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const wsServerCleanup = useServer({ 
  schema,
  onConnect: () => {
    console.log('Connected to WebSocket');
  },
  onDisconnect: () => {
    console.log('Disconnected from WebSocket');
  },
}, wsServer);


async function startServer() {
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // Start Apollo Server
  await apolloServer.start();

  // Apply Express middleware for handling GraphQL HTTP requests
  app.use('/graphql', bodyParser.json(), expressMiddleware(apolloServer));

  // Start the HTTP server
  httpServer.listen(port, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`);
  });
}

startServer();
