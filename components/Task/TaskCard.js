'use client';

export default function TaskCard({ task, onTaskUpdated, onTaskDeleted }) {
  const toggleDone = async () => {
    try {
      const response = await fetch(`/api/tasks?id=${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone: !task.isDone }),
      });

      if (response.ok) {
        onTaskUpdated(task._id, !task.isDone);
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${task._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onTaskDeleted(task._id);
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const cardStyle = {
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: task.isDone ? '#f0fff0' : 'white',
  };
  
  const textStyle = {
    textDecoration: task.isDone ? 'line-through' : 'none',
    color: task.isDone ? '#777' : 'inherit'
  };

  return (
    <div style={cardStyle}>
      <div style={{ flexGrow: 1, paddingRight: '15px' }}>
        <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.1em', ...textStyle }}>{task.title}</span>
        <span style={{ display: 'block', fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
          Summary: {task.summary || 'No summary available.'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px', minWidth: '150px' }}>
        <button 
          onClick={toggleDone} 
          style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: task.isDone ? '#ffc0cb' : '#90ee90', color: 'black' }}
        >
          {task.isDone ? 'Undo' : 'Done'}
        </button>
        <button 
          onClick={handleDelete} 
          style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#ff6347', color: 'white' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}