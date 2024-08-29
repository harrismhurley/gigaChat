import { gql } from '@apollo/client';

export const ADD_MESSAGE = gql`
  mutation AddMessage($content: String!) {
    addMessage(content: $content) {
      id
      content
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($id: ID!, $content: String!) {
    updateMessage(id: $id, content: $content) {
      id
      content
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;
