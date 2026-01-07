import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks'; // Centralized hook
import { format, parseISO } from 'date-fns';
import { FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

export default function Tasks() {
    const { tasks, loading, addTask, deleteTask } = useTasks();
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    // No local useEffect for fetching anymore!

    async function handleAddTask(e) {
        e.preventDefault();

        try {
            await addTask({
                title: newTask.title,
                description: newTask.description,
                date: newTask.date,
                time: newTask.time
            });

            setNewTask({
                title: '',
                description: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                time: format(new Date(), 'HH:mm')
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error adding task: ", error);
            alert("Failed to add task. Please try again.");
        }
    }

    async function handleDeleteTask(id) {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
            } catch (error) {
                console.error("Error deleting task: ", error);
                alert("Failed to delete task.");
            }
        }
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>My Tasks</h2>
            </div>

            {isFormOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }} onClick={() => setIsFormOpen(false)}>
                    <form
                        onSubmit={handleAddTask}
                        className="card"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            border: '1px solid var(--accent-primary)',
                            margin: 0,
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>New Task</h3>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <input
                            className="input"
                            type="text"
                            placeholder="Task Title (e.g., Party)"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                        <textarea
                            className="input"
                            placeholder="Description (Location, etc.)"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            rows="3"
                            style={{ fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date</label>
                                <input
                                    className="input"
                                    type="date"
                                    value={newTask.date}
                                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Time</label>
                                <input
                                    className="input"
                                    type="time"
                                    value={newTask.time}
                                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Save Task</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <p>No tasks found. Create one above!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tasks.map(task => (
                        <div key={task.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{task.title}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {task.description}
                                </p>
                                <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                                    {format(parseISO(task.date), 'MMM d, yyyy')} at {task.time}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {/* FAB */}
            <button
                onClick={() => setIsFormOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '80px', // Above bottom nav if present, or simply accessible
                    right: '25px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 900
                }}
            >
                <FaPlus />
            </button>
        </div>
    );
}
