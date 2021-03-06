import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { GET_ALL_AUTHORS } from "../queries";
import EditAuthorsBirthYear from "./EditAuthorsBirthYear";

const Authors = (props) => {
  //const result = useQuery(GET_ALL_AUTHORS);
  const [getAuthors, result] = useLazyQuery(GET_ALL_AUTHORS);
  useEffect(() => {
    if (props.show) {
      getAuthors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  if (result.loading || !result.data) {
    return (
      <div>
        <h2>loading</h2>
      </div>
    );
  }

  const authors = result.data.allAuthors;

  const optionsForEditAuthorsBirthYearForm = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthorsBirthYear options={optionsForEditAuthorsBirthYearForm} />
    </div>
  );
};

export default Authors;
