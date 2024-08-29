import { gql } from '@apollo/client';

export const MESSAGE_ADDED = gql`
  subscription OnMessageAdded {
    messageAdded {
      id
      content
    }
  }
`;

export const MESSAGE_UPDATED = gql`
  subscription OnMessageUpdated {
    messageUpdated {
      id
      content
    }
  }
`;

export const MESSAGE_DELETED = gql`
  subscription OnMessageDeleted {
    messageDeleted {
      id
    }
  }
`;
