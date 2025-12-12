import React, { useState } from "react";
import styles from "./AddTaskForm.module.css";

export default function AddTaskForm({ onAdd, loading }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAdd(title);
    setTitle("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        placeholder="Enter new task..."
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        disabled={loading} 
      />
      <button
        type="submit"
        className={styles.button}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Task"} 
      </button>
    </form>
  );
}
