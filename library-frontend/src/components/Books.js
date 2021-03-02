import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GET_ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [filterGenre, setFilterGenre] = useState("");
  const result = useQuery(GET_ALL_BOOKS);
  const [booksByGenre, resultBooksByGenre] = useLazyQuery(GET_ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (resultBooksByGenre.loading) {
    return (
      <div>
        <h1>Filtering...</h1>
      </div>
    );
  }

  const onFilterBooks = (value) => {
    booksByGenre({ variables: { genre: value } });
  };

  if (result.loading) {
    return (
      <div>
        <h2>loading...</h2>
      </div>
    );
  }

  const books = resultBooksByGenre.data
    ? resultBooksByGenre.data.allBooks
    : result.data.allBooks;

  const genres = result.data.allBooks.reduce((acc, { genres }) => {
    genres.forEach((genre) => {
      if (!acc.find((accGenre) => accGenre === genre)) {
        acc.push(genre);
      }
    });
    return acc;
  }, []);

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h4>Filters: </h4>
        {genres.map((genre) => (
          <button
            key={genre}
            value={genre}
            onClick={({ target }) => onFilterBooks(target.value)}
          >
            {genre}
          </button>
        ))}
        <button value="all-genres" onClick={() => onFilterBooks(null)}>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
