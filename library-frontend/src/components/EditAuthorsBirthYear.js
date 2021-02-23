import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import Select from "react-select";
import { EDIT_AUTHORS_BIRTHYEAR } from "../queries";

const EditAuthorsBirthYear = ({ options }) => {
  const [year, setYear] = useState("");
  const [nameOption, setNameOption] = useState(null);

  const [editAuthorsBirthyear] = useMutation(EDIT_AUTHORS_BIRTHYEAR, {
    onError: (error) => console.error(error.graphQLErrors),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    if (!nameOption) {
      return; //escaping the error
    }
    editAuthorsBirthyear({
      variables: { name: nameOption.value, year: Number(year) },
    });

    setNameOption(null);
    setYear("");
  };
  return (
    <div>
      <h2>Edit Author's Birthyear</h2>
      <form onSubmit={onSubmit}>
        <Select value={nameOption} onChange={setNameOption} options={options} />
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
