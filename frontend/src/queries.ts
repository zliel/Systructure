import { gql } from '@apollo/client';



export const CREATE_NODE = gql`
  mutation CreateNode($input: NodeInput!) {
    createNode(newNodeData: $input) {
      id
      name
      type
      xPos
      yPos
    }
  }
`

export const GET_NODES = gql`
  query GetNodes {
    allNodes {
      id
      name
      type
      xPos
      yPos
    }
  }
`

export const UPDATE_NODE = gql`
  mutation UpdateNode($nodeId: ID!, $input: UpdateNodeInput!) {
    updateNode(id: $nodeId, updatedNodeData: $input) {
      id
      name
      type
      xPos
      yPos
    }
  }
`

export const DELETE_NODE = gql`
  mutation DeleteNode($nodeId: ID!) {
    deleteNode(id: $nodeId) {
      id
      name
      type
    }
  }
`

export const DELETE_NODES = gql`
  mutation DeleteNodes($nodeIds: [ID!]!) {
    deleteNodes(ids: $nodeIds) {
      id
      name
      type
    }
  }
`


export const CREATE_EDGE = gql`
  mutation CreateEdge($input: EdgeInput!) {
    createEdge(newEdgeData: $input) {
      id
      sourceNode {
        id
      }
      targetNode {
        id
      }
      project {
        id
      }
    }
  }
`

export const GET_EDGES = gql`
  query GetEdges {
    allEdges {
      id
      sourceNode {
        id
      }
      targetNode {
        id
      }
      project {
        id
      }
    }
  }
`

export const UPDATE_EDGE = gql`
  mutation UpdateEdge($edgeId: ID!, $input: UpdateEdgeInput!) {
    updateEdge(id: $edgeId, updatedEdgeData: $input) {
      id
      sourceNode {
        id
      }
      targetNode {
        id
      }
      project {
        id
      }
    }
  }
`

export const DELETE_EDGE = gql`
  mutation DeleteEdge($edgeId: ID!) {
    deleteEdge(id: $edgeId) {
      id
      sourceNode {
        id
      }
      targetNode {
        id
      }
    }
  }
`

export const DELETE_EDGES = gql`
  mutation DeleteEdges($edgeIds: [ID!]!) {
    deleteEdges(ids: $edgeIds) {
      id
      sourceNode {
        id
      }
      targetNode {
        id
      }
    }
  }
`

export const GET_PROJECT_COMPONENTS = gql`
  query GetProjectComponents($projectId: ID!) {
    projectById(id: $projectId) {
      id
      name
      nodes {
        id
        name
        type
        xPos
        yPos
      }
      edges {
        id
        sourceNode {
          id
        }
        targetNode {
          id
        }
      }
    }
  }
`

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
`

export const GET_USER_PROJECTS = gql`
  query GetUserProjects($userId: ID!) {
    userById(id: $userId) {
      projectMemberships {
        id
        projectRole
        project {
          id
          name
        }
      }
    }
  }
`
