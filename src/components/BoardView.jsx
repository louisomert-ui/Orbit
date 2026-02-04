import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Filter, Search as SearchIcon, Plus, Trash2, Calendar, Layout as LayoutIcon, Lock, Unlock } from 'lucide-react';
import Group from './Group';
import CalendarView from './CalendarView';
import PinScreen from './PinScreen';

const BoardView = ({
    board,
    onUpdateBoard,
    onDeleteBoard,
    onAddGroup,
    onUpdateGroup,
    onDeleteGroup,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    isUnlocked,
    onUnlockBoard,
    onUpdateSecurity
}) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'

    useEffect(() => {
        if (board) setTitleInput(board.title);
    }, [board?.id, board?.title]);

    if (!board) return <div style={{ padding: '40px', textAlign: 'center' }}>Sélectionnez un tableau</div>;

    // --- SECURITY CHECK ---
    const isLocked = board.pinCode && !isUnlocked;
    if (isLocked) {
        return (
            <PinScreen
                title={board.title}
                onUnlock={(pin, callback) => {
                    const success = onUnlockBoard(board.id, pin);
                    callback(success);
                }}
            />
        );
    }

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        if (titleInput.trim() !== board.title) {
            onUpdateBoard(board.id, titleInput);
        }
    };

    const handleSecurityClick = () => {
        if (board.pinCode) {
            // Remove PIN
            if (confirm("Voulez-vous supprimer la protection par code PIN ?")) {
                onUpdateSecurity(board.id, null);
            }
        } else {
            // Set PIN (Simple prompt for MVP, better would be a modal)
            const pin = prompt("Définissez un code PIN à 4 chiffres (ex: 1234) :");
            if (pin) {
                if (/^\d{4}$/.test(pin)) {
                    onUpdateSecurity(board.id, pin);
                    alert("Tableau protégé !");
                } else {
                    alert("Le code doit contenir exactement 4 chiffres.");
                }
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Board Header */}
            <header style={{
                padding: '24px 32px 0 32px',
                backgroundColor: 'var(--color-bg-surface)',
            }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                onBlur={handleTitleBlur}
                                onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                                autoFocus
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    border: '1px solid var(--color-primary)',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    width: '100%',
                                    padding: '0 8px'
                                }}
                            />
                        ) : (
                            <h1
                                onClick={() => setIsEditingTitle(true)}
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    cursor: 'text',
                                    border: '1px solid transparent',
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.border = '1px solid var(--color-border)'}
                                onMouseOut={(e) => e.currentTarget.style.border = '1px solid transparent'}
                            >
                                {board.title}
                            </h1>
                        )}
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                            Gérez vos projets et tâches ici.
                        </p>
                    </div>

                    {/* Security Button */}
                    <button
                        onClick={handleSecurityClick}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${board.pinCode ? '#d1fae5' : 'var(--color-border)'}`,
                            backgroundColor: board.pinCode ? '#ecfdf5' : 'transparent',
                            color: board.pinCode ? '#059669' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        {board.pinCode ? <Lock size={16} /> : <Unlock size={16} />}
                        {board.pinCode ? 'Protégé' : 'Non protégé'}
                    </button>
                </div>

                {/* Tabs / Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', borderBottom: '1px solid var(--color-border)' }}>
                    {/* View Tabs */}
                    <button
                        onClick={() => setViewMode('table')}
                        style={{
                            padding: '8px 16px',
                            borderBottom: viewMode === 'table' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            fontWeight: viewMode === 'table' ? '500' : '400'
                        }}
                    >
                        <LayoutIcon size={16} /> Tableau principal
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        style={{
                            padding: '8px 16px',
                            borderBottom: viewMode === 'calendar' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: viewMode === 'calendar' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            fontWeight: viewMode === 'calendar' ? '500' : '400'
                        }}
                    >
                        <Calendar size={16} /> Calendrier
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 16px' }}></div>

                    {/* Tools */}
                    <button style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px'
                    }}>
                        <SearchIcon size={14} /> Search
                    </button>

                    <div style={{ flex: 1 }}></div>
                    <button
                        onClick={() => onDeleteBoard(board.id)}
                        style={{ fontSize: '14px', color: '#e2445c', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Trash2 size={14} /> Supprimer le tableau
                    </button>
                </div>
            </header>

            {/* Content Switcher */}
            {viewMode === 'table' ? (
                /* Table Content */
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
                    {board.groups.map(group => (
                        <Group
                            key={group.id}
                            group={group}
                            boardColor={board.color}
                            onUpdateGroup={(updates) => onUpdateGroup(board.id, group.id, updates)}
                            onDeleteGroup={() => onDeleteGroup(board.id, group.id)}
                            onAddItem={(name) => onAddItem(board.id, group.id, name)}
                            onUpdateItem={(itemId, updates) => onUpdateItem(board.id, group.id, itemId, updates)}
                            onDeleteItem={(itemId) => onDeleteItem(board.id, group.id, itemId)}
                        />
                    ))}

                    <button
                        onClick={() => onAddGroup(board.id)}
                        style={{
                            marginTop: '16px',
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px dashed var(--color-border)',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Plus size={16} /> Ajouter un nouveau groupe
                    </button>
                </div>
            ) : (
                /* Calendar Content */
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <CalendarView board={board} />
                </div>
            )}
        </div>
    );
};

export default BoardView;
