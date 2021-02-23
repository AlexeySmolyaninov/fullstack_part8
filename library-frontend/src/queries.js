import { gql } from "@apollo/client";

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;
