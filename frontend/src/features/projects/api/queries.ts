import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    userById(id: $userId) {
      id
      username
      email
      role
      projectMemberships {
        id
        projectRole
        joinedAt
        project {
          id
          name
        }
      }
    }
  }
`;

export const GET_USER_PROJECTS = gql`
  query GetUserProjects($userId: ID!) {
    userById(id: $userId) {
      projectMemberships {
        id
        projectRole
        joinedAt
        project {
          id
          name
          description
          updatedAt
          isPublic
          nodes {
            id
          }
          edges {
            id
          }
        }
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(newProjectData: $input) {
      id
      name
      description
      isPublic
    }
  }
`;
