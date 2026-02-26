import { gql } from '@apollo/client';

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
            id
            email
            username
            role
        }
    }
`;

export const DELETE_ACCOUNT = gql`
    mutation DeleteAccount($password: String!) {
        deleteAccount(password: $password)
    }
`;
