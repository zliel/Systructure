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

export const ADD_PROJECT_MEMBER = gql`
  mutation AddProjectMember($input: AddMemberInput!) {
    addProjectMember(input: $input) {
      id
      projectRole
      joinedAt
      user {
        id
        username
        email
      }
    }
  }
`;

export const UPDATE_PROJECT_MEMBER_ROLE = gql`
  mutation UpdateProjectMemberRole($input: UpdateMemberRoleInput!) {
    updateProjectMemberRole(input: $input) {
      id
      projectRole
    }
  }
`;

export const REMOVE_PROJECT_MEMBER = gql`
  mutation RemoveProjectMember($memberId: ID!) {
    removeProjectMember(memberId: $memberId) {
      id
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
