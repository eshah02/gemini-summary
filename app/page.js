'use client';

import { useState, useEffect } from 'react';
import AddTaskForm from '@/components/AddTaskForm/AddTaskForm.js';
import TaskCard from '@/components/Task/TaskCard.js';
async function getTasks() {
  const res = await fetch('/api/tasks', {
    cache: 'no-store' 
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return res.json();
}
export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const initialTasks = await getTasks();
        setTasks(initialTasks);
      } catch (e) {
        setError('Could not load Task.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);
  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks.filter(t => t._id !== newTask._id)]);
  };

  const handleTaskUpdated = (_id, isDone) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task._id === _id ? { ...task, isDone: isDone } : task
      );
      return updatedTasks.sort((a, b) => (a.isDone === b.isDone) ? 0 : a.isDone ? 1 : -1);
    });
  };

  const handleTaskDeleted = (_id) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== _id));
  };


  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading tasks...</div>;
  if (error) return <div style={{ padding: '20px', color: 'white', backgroundColor: '#ff6347', textAlign: 'center' }}>❌ Error: {error}</div>;

  const incompleteTasks = tasks.filter(t => !t.isDone);
  const completedTasks = tasks.filter(t => t.isDone);


  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', borderBottom: '2px solid #0070f3', paddingBottom: '10px' }}>
        Todo App 
      </h1>

      <AddTaskForm onTaskAdded={handleTaskAdded} />
      <h2>Pending Tasks ({incompleteTasks.length})</h2>
      <div style={{ minHeight: '100px', border: '1px dashed #ccc', padding: '10px', borderRadius: '8px' }}>
        {incompleteTasks.length > 0 ? (
          incompleteTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No pending tasks! Time to relax.</p>
        )}
      </div>

      {completedTasks.length > 0 && (
        <>
          <h2 style={{ marginTop: '30px' }}>Completed Tasks ({completedTasks.length})</h2>
          <div style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '8px' }}>
            {completedTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
}