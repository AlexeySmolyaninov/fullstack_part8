import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { EDIT_AUTHORS_BIRTHYEAR } from "../queries";

const EditAuthorsBirthYear = () => {
  const [editAuthorsBirthyear] = useMutation(EDIT_AUTHORS_BIRTHYEAR);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    editAuthorsBirthyear({ variables: { name, year: Number(year) } });

    setName("");
    setYear("");
  };
  return (
    <div>
      <h2>Edit Author's Birthyear</h2>
      <form onSubmit={onSubmit}>
        <div>
          Name{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Year{" "}
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">Edit</button>
      </form>
    </div>
  );
};

export default EditAuthorsBirthYear;
