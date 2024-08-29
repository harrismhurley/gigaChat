import { gql } from '@apollo/client';

export const MESSAGE_ADDED = gql`
  subscription messageAdded {
    messageAdded {
      id
      content
    }
  }
`;

export const MESSAGE_UPDATED = gql`
  subscription messageUpdated {
    messageUpdated {
      id
      content
    }
  }
`;

export const MESSAGE_DELETED = gql`
  subscription messageDeleted {
    messageDeleted {
      id
    }
  }
`;
