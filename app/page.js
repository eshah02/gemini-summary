"use client";

import React, { useEffect, useState } from "react";
import AddTaskForm from "../components/AddTaskForm/AddTaskForm";
import TaskCard from "../components/Task/TaskCard";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  };

  // Add task (WITH summary auto-generation)
  const addTask = async (title) => {
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: "" // required because summary API accepts it
        }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Add task error:", error);
    }
  };

  // Toggle task state
  const toggleTask = async (id, done) => {
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Todo App with Gemini
      </h1>

      
      <AddTaskForm onAdd={addTask} />

      <h2>Pending Tasks</h2>
      {pendingTasks.length ? (
        pendingTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))
      ) : (
        <p>No pending tasks</p>
      )}

      {/* Completed Tasks */}
      <h2 style={{ marginTop: "40px" }}>Completed Tasks</h2>
      {completedTasks.length ? (
        completedTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))
      ) : (
        <p>No completed tasks</p>
      )}
    </div>
  );
}
