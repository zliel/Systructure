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
