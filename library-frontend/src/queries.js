import { gql } from "@apollo/client";

export const BOOKDETAILS_FRAGMENT = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      name
    }
    published
    genres
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      favoriteGenre
    }
  }
`;

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

export const GET_ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }

  ${BOOKDETAILS_FRAGMENT}
`;

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
    }
  }
`;

export const EDIT_AUTHORS_BIRTHYEAR = gql`
  mutation EditAuthorsBirthyear($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      id
      born
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOKDETAILS_FRAGMENT}
`;
