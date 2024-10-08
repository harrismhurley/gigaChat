import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      content
      address
      date
      imageUrl  
      user {
        id
        username
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      content
      address
      date
      imageUrl  
      user {
        id
        username
      }
    }
  }
`;
