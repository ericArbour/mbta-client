import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "./CloseButton.module.css";

export default function CloseButton() {
  return (
    <button className={styles["close-button"]}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );
}
