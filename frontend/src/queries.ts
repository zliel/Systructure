import { gql } from '@apollo/client';


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
