import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useTasks() {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setTasks([]);
            setLoading(false);
            return;
        }

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
        }, (error) => {
            console.error("Error fetching tasks:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const addTask = async (taskData) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, 'tasks'), {
                userId: currentUser.uid,
                ...taskData,
                createdAt: serverTimestamp(),
                completed: false
            });
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const deleteTask = async (id) => {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, 'tasks', id));
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    return { tasks, loading, addTask, deleteTask };
}
