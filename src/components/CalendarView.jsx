import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    addWeeks,
    subWeeks,
    addDays,
    subDays,
    parseISO,
    isWithinInterval
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const CalendarView = ({ board }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'

    // 1. Extract all items with valid dates
    const allItems = board ? board.groups.flatMap(group =>
        group.items
            .filter(item => item.date)
            .map(item => ({
                ...item,
                groupId: group.id,
                groupColor: group.color || '#0073ea'
            }))
    ) : [];

    // 2. Calculate Interval based on Mode
    let startDate, endDate, gridTemplateColumns, dateFormat;

    switch (viewMode) {
        case 'week':
            startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
            endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
            gridTemplateColumns = 'repeat(7, 1fr)';
            dateFormat = "'Semaine du' d MMMM";
            break;
        case 'day':
            startDate = currentDate;
            endDate = currentDate;
            gridTemplateColumns = '1fr';
            dateFormat = "d MMMM yyyy";
            break;
        case 'month':
        default:
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
            endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
            gridTemplateColumns = 'repeat(7, 1fr)';
            dateFormat = 'MMMM yyyy';
            break;
    }

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    // Navigation handlers
    const handlePrev = () => {
        if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
        if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
        if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    };

    const handleNext = () => {
        if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
        if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
        if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    };

    const handleToday = () => setCurrentDate(new Date());

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return 'var(--color-status-done)';
            case 'working': return 'var(--color-status-working)';
            case 'stuck': return 'var(--color-status-stuck)';
            default: return 'var(--color-status-gray)';
        }
    };

    return (
        <div style={{ padding: '24px 32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', textTransform: 'capitalize', minWidth: '200px' }}>
                        {format(currentDate, dateFormat, { locale: fr })}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handlePrev}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleToday}
                            style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '14px', cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            Aujourd'hui
                        </button>
                        <button
                            onClick={handleNext}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* View Mode Switcher */}
                <div style={{ display: 'flex', backgroundColor: 'var(--color-bg-app)', padding: '4px', borderRadius: '8px' }}>
                    {['month', 'week', 'day'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: '500',
                                backgroundColor: viewMode === mode ? '#fff' : 'transparent',
                                color: viewMode === mode ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {mode === 'month' ? 'Mois' : mode === 'week' ? 'Semaine' : 'Jour'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: gridTemplateColumns,
                flex: 1,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#fff',
                overflow: 'hidden'
            }}>
                {/* Table Header (Weekdays) - Only show for Month and Week view */}
                {viewMode !== 'day' && WEEKDAYS.map(day => (
                    <div key={day} style={{
                        padding: '12px',
                        textAlign: 'center',
                        borderBottom: '1px solid var(--color-border)',
                        borderRight: '1px solid var(--color-border)',
                        fontWeight: '600',
                        fontSize: '14px',
                        backgroundColor: 'var(--color-bg-app)'
                    }}>
                        {day}
                    </div>
                ))}

                {/* Days Cells */}
                {calendarDays.map((day, idx) => {
                    const dayItems = allItems.filter(item => isSameDay(parseISO(item.date), day));
                    const isCurrentMonth = isSameMonth(day, currentDate); // Only accurate for month view but reused logic
                    const isToday = isSameDay(day, new Date());

                    // Adjust border logic
                    const isRightEdge = viewMode !== 'day' && (idx + 1) % 7 === 0;

                    return (
                        <div
                            key={day.toString()}
                            style={{
                                minHeight: '100px',
                                borderBottom: '1px solid var(--color-border)',
                                borderRight: isRightEdge ? 'none' : '1px solid var(--color-border)',
                                padding: '12px',
                                backgroundColor: (viewMode === 'month' && !isCurrentMonth) ? '#f9f9fb' : '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <div style={{
                                textAlign: 'right',
                                fontSize: viewMode === 'day' ? '18px' : '14px',
                                marginBottom: '4px',
                                fontWeight: isToday ? 'bold' : 'normal',
                                color: isToday ? 'var(--color-primary)' : 'var(--color-text-main)',
                                display: 'flex',
                                justifyContent: viewMode === 'day' ? 'flex-start' : 'flex-end',
                                gap: '8px',
                                alignItems: 'baseline'
                            }}>
                                {viewMode === 'day' && <span style={{ textTransform: 'capitalize' }}>{format(day, 'EEEE', { locale: fr })}</span>}
                                <span>{format(day, 'd')}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                                {dayItems.length === 0 && viewMode === 'day' && (
                                    <div style={{ color: 'var(--color-text-light)', fontStyle: 'italic', marginTop: '20px' }}>
                                        Aucune tâche pour ce jour.
                                    </div>
                                )}
                                {dayItems.map(item => (
                                    <div
                                        key={item.id}
                                        style={{
                                            fontSize: '13px',
                                            padding: '6px 10px',
                                            backgroundColor: getStatusColor(item.status),
                                            color: '#fff',
                                            borderRadius: 'var(--radius-sm)',
                                            whiteSpace: viewMode === 'month' ? 'nowrap' : 'normal',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            cursor: 'pointer',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                        title={`${item.name} (${item.status})`}
                                    >
                                        <span>{item.name}</span>
                                        {viewMode !== 'month' && <span style={{ fontSize: '11px', opacity: 0.8 }}>{item.groupName}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
