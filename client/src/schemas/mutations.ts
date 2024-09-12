import { gql } from '@apollo/client';

// User Mutations
export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
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
