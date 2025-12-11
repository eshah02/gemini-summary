'use client';

import { useState } from 'react';

export default function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }), 
      });

      if (response.ok) {
        const newTask = await response.json();
        onTaskAdded(newTask); 
        setTitle('');
        setDescription('');
      } else {
        console.error('Failed to add task', await response.text());
        alert('Failed to add task. Check console for details.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add Task"
        required
        disabled={loading}
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description to (improves Gemini summary)"
        disabled={loading}
        rows="3"
        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {loading ? 'Adding & Summarizing...' : 'Add Task'}
      </button>
    </form>
  );
}