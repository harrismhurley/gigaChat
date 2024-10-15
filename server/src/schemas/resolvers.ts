import { PubSub } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, verifyPassword, hashPassword } from '../utils/auth';
import { generateUploadURL, generateDownloadURL } from '../utils/s3';

const pubsub = new PubSub();
const events: Array<{ id: string, title: string, content: string, address?: string, date?: string, userId: string, imageUrl?: string }> = [];
const users: Array<{ id: string, username: string, password: string }> = [];

const resolvers = {
  Query: {
    events: () => events.map(event => ({
      ...event,
      user: users.find(user => user.id === event.userId)
    })),
    event: (parent: any, { id }: { id: string }) => {
      const event = events.find(event => event.id === id);
      if (event) {
        return {
          ...event,
          user: users.find(user => user.id === event.userId)
        };
      }
      return null;
    },
    users: () => users,
    user: (parent: any, { id }: { id: string }) => users.find(user => user.id === id),
  },
  Mutation: {
    signup: async (parent: any, { username, password }: { username: string, password: string }) => {
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        throw new Error('Username is already in use.');
      }
      const hashedPassword = await hashPassword(password);
      const user = { id: uuidv4(), username, password: hashedPassword };
      users.push(user);
      const token = generateToken(user);
      console.log('Generated token:', token);  // Log the generated token

      return {
        token,
        user: { id: user.id, username: user.username }
      };
    },
    login: async (parent: any, { username, password }: { username: string, password: string }) => {
      const user = users.find(user => user.username === username);
      if (!user) throw new Error('User not found');
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) throw new Error('Invalid password');
      const token = generateToken(user);
      return {
        token,
        user: { id: user.id, username: user.username }
      };
    },
    addEvent: (parent: any, { title, content, address, date, userId, imageUrl }: { title: string; content: string; address: string; date: string; userId: string; imageUrl?: string }) => {

      // Check if any required fields are missing
      if (!title || !content || !address || !date || !userId) {
        console.error('Missing required fields for adding event');
        throw new Error('All fields are required');
      }

      const user = users.find(user => user.id === userId);
      if (!user) {
        console.error(`User not found for ID: ${userId}`);
        throw new Error('User not found');
      }

      const event = { id: uuidv4(), title, content, address, date, userId, imageUrl };
      events.push(event);
      console.log('Event Created:', event);

      pubsub.publish('EVENT_ADDED', { eventAdded: { ...event, user } });
      console.log('Subscription Triggered:', event);

      return {
        ...event,
        user
      };
    },

    generateUploadURL: async (parent: any, { fileName, fileType }: { fileName: string, fileType: string }) => {
      try {
        const { url, fileName: uniqueFileName } = await generateUploadURL(fileName, fileType); // Get both URL and unique filename
        return { url, fileName: uniqueFileName }; // Return both URL and unique filename
      } catch (err) {
        throw new Error('Failed to generate upload URL');
      }
    },
    generateDownloadURL: async (parent: any, { fileName }: { fileName: string }) => {
      try {
        const url = await generateDownloadURL(fileName);
        return { url };
      } catch (err) {
        throw new Error('Failed to generate download URL');
      }
    },
    updateEvent: (parent: any, { id, title, content, address, date, imageUrl }: { id: string, title?: string, content?: string, address?: string, date?: string, imageUrl?: string }) => {
      const event = events.find(event => event.id === id);
      if (!event) throw new Error('Event not found');
      if (title !== undefined) event.title = title;
      if (content !== undefined) event.content = content;
      if (address !== undefined) event.address = address;
      if (date !== undefined) event.date = date;
      if (imageUrl !== undefined) event.imageUrl = imageUrl; // Allow updating imageUrl
      pubsub.publish('EVENT_UPDATED', { eventUpdated: event });
      return {
        ...event,
        user: users.find(user => user.id === event.userId)
      };
    },
    deleteEvent: (parent: any, { id }: { id: string }) => {
      const index = events.findIndex(event => event.id === id);
      if (index === -1) throw new Error('Event not found');
      const [event] = events.splice(index, 1);
      pubsub.publish('EVENT_DELETED', { eventDeleted: event });
      return {
        ...event,
        user: users.find(user => user.id === event.userId)
      };
    },
  },
  Subscription: {
    eventAdded: {
      subscribe: () => pubsub.asyncIterator(['EVENT_ADDED']),
    },
    eventUpdated: {
      subscribe: () => pubsub.asyncIterator(['EVENT_UPDATED']),
    },
    eventDeleted: {
      subscribe: () => pubsub.asyncIterator(['EVENT_DELETED']),
    },
  },
};

export default resolvers;
