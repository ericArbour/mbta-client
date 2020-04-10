import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles["app"]}>
      <header className={styles["app-header"]}>
        <h1>T Tracker</h1>
      </header>
      <main className={styles["app-main"]}></main>
      <footer className={styles["app-footer"]}>
        <img src={logo} className={styles["react-logo"]} alt="logo" />
        <p>Powered by React.</p>
      </footer>
    </div>
  );
}

export default App;
