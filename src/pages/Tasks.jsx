import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

export default function Tasks() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', currentUser.uid),
            orderBy('date', 'asc'),
            orderBy('time', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const taskList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(taskList);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    async function handleAddTask(e) {
        e.preventDefault();
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'tasks'), {
                userId: currentUser.uid,
                title: newTask.title,
                description: newTask.description,
                date: newTask.date,
                time: newTask.time,
                createdAt: serverTimestamp(),
                completed: false
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
        }
    }

    async function deleteTask(id) {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await deleteDoc(doc(db, 'tasks', id));
        }
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>My Tasks</h2>
                <button
                    className="btn"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                    {isFormOpen ? 'Close' : 'Add Task'}
                </button>
            </div>

            {isFormOpen && (
                <form onSubmit={handleAddTask} className="card" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent-primary)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>New Task</h3>
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
                                onClick={() => deleteTask(task.id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
