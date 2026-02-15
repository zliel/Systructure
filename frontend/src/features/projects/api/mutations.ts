import { gql } from '@apollo/client';

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectInput!) {
    updateProject(id: $id, updatedProjectData: $input) {
      id
      name
      description
      isPublic
      updatedAt
    }
  }
`;

