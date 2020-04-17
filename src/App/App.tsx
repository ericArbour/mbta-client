import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";

import client from "../apolloConfig";
import Main from "../Main/Main";

import logo from "./logo.svg";
import styles from "./App.module.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className={styles["app"]}>
        <header>
          <h1>T Tracker</h1>
        </header>
        <Main />
        <footer>
          <img src={logo} className={styles["react-logo"]} alt="logo" />
          <p>Powered by React.</p>
        </footer>
      </div>
    </ApolloProvider>
  );
}

export default App;
