import { useApolloClient, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import Login from "./components/Login";
import NewBook from "./components/NewBook";
import Recommendation from "./components/Recommendation";
import { BOOK_ADDED } from "./queries";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`Book with title ${addedBook.title} has been added`);
    },
  });

  const onLogout = async () => {
    setToken(null);
    setPage("login");
    localStorage.clear();
    await client.clearStore(); //using this instead of client.resetStore() becasue it won't refetch queries
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token === null && (
          <button onClick={() => setPage("login")}>login</button>
        )}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommendation")}>recommend</button>
        )}
        {token && <button onClick={onLogout}>logout</button>}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendation show={page === "recommendation"} />

      <Login show={page === "login"} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
