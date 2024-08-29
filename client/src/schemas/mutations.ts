import { gql } from '@apollo/client';

// User Mutations
export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

// Message Mutations
export const ADD_MESSAGE = gql`
  mutation addMessage($content: String!) {
    addMessage(content: $content) {
      id
      content
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation updateMessage($id: ID!, $content: String!) {
    updateMessage(id: $id, content: $content) {
      id
      content
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;
