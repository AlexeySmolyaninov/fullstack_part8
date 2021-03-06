import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { GET_ALL_BOOKS, ME } from "../queries";

const Recommendation = ({ show }) => {
  const [getMe, me] = useLazyQuery(ME);
  const [getBooksByGenre, recommendedBooks] = useLazyQuery(GET_ALL_BOOKS);

  useEffect(() => {
    if (show) {
      getMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    if (me.data) {
      getBooksByGenre({ variables: { genre: me.data.me.favoriteGenre } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.data]);

  if (!show) {
    return null;
  }

  if (
    me.loading ||
    !me.data ||
    recommendedBooks.loading ||
    !recommendedBooks.data
  ) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>Recommendations</h1>

      <p>
        books in your favourite genre{" "}
        <strong>{me.data?.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendation;
