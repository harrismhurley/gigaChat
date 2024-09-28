import { gql } from '@apollo/client';

export const EVENT_ADDED = gql`
  subscription eventAdded {
    eventAdded {
      id
      title
      content
      address
      date
      user {
        id
        username
      }
      imageUrl  
    }
  }
`;

export const EVENT_UPDATED = gql`
  subscription eventUpdated {
    eventUpdated {
      id
      title
      content
      address
      date
      user {
        id
        username
      }
      imageUrl  
    }
  }
`;

export const EVENT_DELETED = gql`
  subscription eventDeleted {
    eventDeleted {
      id
    }
  }
`;
