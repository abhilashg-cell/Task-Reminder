import React, { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO
} from 'date-fns';
import { useTasks } from '../hooks/useTasks';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { tasks } = useTasks();
    const [selectedDate, setSelectedDate] = useState(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const dayHasTasks = (day) => {
        return tasks.some(task => isSameDay(parseISO(task.date), day));
    };

    const getTasksForDay = (day) => {
        return tasks.filter(task => isSameDay(parseISO(task.date), day));
    };

    return (
        <div className="container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button className="btn" onClick={prevMonth} style={{ padding: '0.5rem' }}><FaChevronLeft /></button>
                <h2 style={{ fontSize: '1.25rem' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
                <button className="btn" onClick={nextMonth} style={{ padding: '0.5rem' }}><FaChevronRight /></button>
            </div>

            {/* Weekdays Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {calendarDays.map((day, idx) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const hasTasks = dayHasTasks(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDate = isToday(day);

                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedDate(day)}
                            style={{
                                aspectRatio: '1',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: !isCurrentMonth ? '#444' : isTodayDate ? 'var(--accent-primary)' : 'var(--text-primary)',
                                fontWeight: isTodayDate ? 'bold' : 'normal',
                                border: isTodayDate ? '1px solid var(--accent-primary)' : 'none'
                            }}
                        >
                            {format(day, 'd')}
                            {hasTasks && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '15%',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--accent-secondary)'
                                }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Day Details Modal/Section */}
            {selectedDate && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'end', // Bottom sheet style for mobile
                    justifyContent: 'center'
                }} onClick={() => setSelectedDate(null)}>
                    <div
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            width: '100%',
                            maxWidth: '600px',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            padding: '1.5rem',
                            maxHeight: '70vh',
                            overflowY: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>{format(selectedDate, 'EEEE, MMM d')}</h3>
                            <button
                                onClick={() => setSelectedDate(null)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {getTasksForDay(selectedDate).length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {getTasksForDay(selectedDate).map(task => (
                                    <div key={task.id} style={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        borderLeft: '3px solid var(--accent-secondary)'
                                    }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{task.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{task.description}</p>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>{task.time}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No tasks for this day.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
