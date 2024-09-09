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

// Event Mutations
export const ADD_EVENT = gql`
  mutation addEvent($title: String!, $content: String!, $address: String, $date: String) {
    addEvent(title: $title, content: $content, address: $address, date: $date) {
      id
      title
      content
      address
      date
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation updateEvent($id: ID!, $title: String, $content: String, $address: String, $date: String) {
    updateEvent(id: $id, title: $title, content: $content, address: $address, date: $date) {
      id
      title
      content
      address
      date
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;
