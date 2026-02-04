import React, { useState, useMemo } from 'react';
import { Layout, Plus, Trash2, Bell } from 'lucide-react';
import { getAlerts } from '../utils/alertUtils';

const Sidebar = ({ boards, activeBoardId, onSelectBoard, onAddBoard, onDeleteBoard }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const alerts = useMemo(() => getAlerts(boards), [boards]);
    const overdueCount = alerts.filter(a => a.type === 'overdue').length;
    const soonCount = alerts.filter(a => a.type === 'soon').length;
    const totalAlerts = overdueCount + soonCount;

    return (
        <div style={{
            width: '260px',
            backgroundColor: 'var(--color-bg-surface)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'width 0.2s ease'
        }}>
            {/* Header Sidebar */}
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>Orbit</h2>

                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            position: 'relative',
                            padding: '4px'
                        }}
                    >
                        <Bell size={20} />
                        {totalAlerts > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                width: '16px',
                                height: '16px',
                                backgroundColor: '#e2445c',
                                color: '#fff',
                                fontSize: '10px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                border: '2px solid var(--color-bg-surface)'
                            }}>
                                {totalAlerts}
                            </div>
                        )}
                    </button>

                    {/* Notification Panel */}
                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            width: '280px',
                            backgroundColor: '#fff',
                            boxShadow: 'var(--shadow-lg)',
                            borderRadius: '8px',
                            padding: '16px',
                            zIndex: 1000,
                            cursor: 'default',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            border: '1px solid var(--color-border)'
                        }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Notifications</h3>

                            {totalAlerts === 0 ? (
                                <div style={{ fontSize: '13px', color: 'var(--color-text-light)', textAlign: 'center', padding: '20px 0' }}>
                                    Aucune alerte pour le moment 🎉
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {alerts.map((alert, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                onSelectBoard(alert.board.id);
                                                setShowNotifications(false);
                                            }}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '6px',
                                                backgroundColor: alert.type === 'overdue' ? '#fff0f0' : '#fff9f0',
                                                borderLeft: `3px solid ${alert.type === 'overdue' ? '#e2445c' : '#fdab3d'}`,
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>{alert.item.name}</span>
                                                <span style={{ fontSize: '11px', color: alert.type === 'overdue' ? '#e2445c' : '#fdab3d', fontWeight: 'bold' }}>
                                                    {alert.message}
                                                </span>
                                            </div>
                                            <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                                                {alert.board.title} &gt; {alert.group.title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Board Button */}
            <div style={{ padding: '0 20px 10px' }}>
                <button
                    onClick={onAddBoard}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                    }}
                >
                    <Plus size={16} /> Nouveau Tableau
                </button>
            </div>

            {/* Boards List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--spacing-sm)' }}>
                <h4 style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--color-text-secondary)',
                    padding: '0 12px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginTop: '16px'
                }}>
                    Workspace
                </h4>
                <ul style={{ listStyle: 'none' }}>
                    {boards.map(board => (
                        <li key={board.id} style={{ marginBottom: '2px' }}>
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    fontWeight: activeBoardId === board.id ? '500' : '400',
                                    color: activeBoardId === board.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                                    backgroundColor: activeBoardId === board.id ? 'var(--color-primary-light)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.1s'
                                }}
                                onClick={() => onSelectBoard(board.id)}
                                onMouseOver={(e) => {
                                    if (activeBoardId !== board.id) e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                                    const delBtn = e.currentTarget.querySelector('.delete-btn');
                                    if (delBtn) delBtn.style.opacity = '1';
                                }}
                                onMouseOut={(e) => {
                                    if (activeBoardId !== board.id) e.currentTarget.style.backgroundColor = 'transparent';
                                    const delBtn = e.currentTarget.querySelector('.delete-btn');
                                    if (delBtn) delBtn.style.opacity = '0';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                    <Layout size={18} strokeWidth={activeBoardId === board.id ? 2.5 : 2} />
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{board.title}</span>
                                </div>
                                {onDeleteBoard && (
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteBoard(board.id);
                                        }}
                                        style={{
                                            opacity: 0,
                                            border: 'none',
                                            background: 'none',
                                            color: 'var(--color-text-secondary)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fed3d3'; e.currentTarget.style.color = '#e2445c'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#a25ddc', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LO</div>
                    <span style={{ fontSize: '13px' }}>Louis Ort</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
