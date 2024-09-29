import { gql } from '@apollo/client';

export const EVENT_ADDED = gql`
  subscription eventAdded {
    eventAdded {
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

export const EVENT_UPDATED = gql`
  subscription eventUpdated {
    eventUpdated {
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

export const EVENT_DELETED = gql`
  subscription eventDeleted {
    eventDeleted {
      id
    }
  }
`;
