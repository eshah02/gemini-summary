import React from "react";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div className={`${styles.card} ${task.done ? styles.done : ""}`}>
      <div>
        <h3>{task.title}</h3>
        {task.summary && <p className={styles.summary}>{task.summary}</p>}
      </div>
      <div className={styles.actions}>
        <button onClick={() => onToggle(task._id, !task.done)} className={styles.toggle}>
          {task.done ? "Undo" : "Done"}
        </button>
        <button onClick={() => onDelete(task._id)} className={styles.delete}>Delete</button>
      </div>
    </div>
  );
}
