import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Briefcase, Search as SearchIcon, Plus, Trash2 } from 'lucide-react';

const initialCrmData = [
    { id: 'p1', name: 'Refonte Site Web', contact: 'Alice Dupont - Acme Corp', status: 'En cours', deadline: '2026-12-01', comment: 'En attente de validation maquettes' }
];

const CrmView = () => {
    const [crmData, setCrmData] = useState(() => {
        const saved = localStorage.getItem('pro-organizer-crm-data-v2');
        return saved ? JSON.parse(saved) : initialCrmData;
    });

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        localStorage.setItem('pro-organizer-crm-data-v2', JSON.stringify(crmData));
    }, [crmData]);

    const handleAddItem = () => {
        const newItem = {
            id: uuidv4(),
            name: 'Nouveau projet',
            contact: '',
            status: 'Nouveau',
            deadline: '',
            comment: ''
        };

        setCrmData([...crmData, newItem]);
    };

    const handleUpdateItem = (id, field, value) => {
        setCrmData(crmData.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleDeleteItem = (id) => {
        if (confirm('Voulez-vous vraiment supprimer cet élément ?')) {
            setCrmData(crmData.filter(item => item.id !== id));
        }
    };

    const currentData = crmData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Nouveau': return '#579bfc'; // Bleu
            case 'En cours': return '#fdab3d'; // Orange
            case 'En attente': return '#ffcb00'; // Jaune
            case 'Gagné': return '#00c875'; // Vert
            case 'Perdu': return '#e2445c'; // Rouge
            default: return '#c4c4c4';
        }
    };

    const columns = ['Nom du Projet', 'Contact', 'Statut', 'Échéance', 'Commentaire', 'Actions'];

    const renderCell = (item, colIndex) => {
        const inputStyle = {
            border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '14px', color: 'var(--color-text-main)'
        };

        if (colIndex === 0) return <input style={{ ...inputStyle, fontWeight: '500' }} value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} />;
        if (colIndex === 1) return <input style={inputStyle} value={item.contact} onChange={e => handleUpdateItem(item.id, 'contact', e.target.value)} placeholder="Nom du contact..." />;
        if (colIndex === 2) return (
            <div style={{ position: 'relative', width: '100%', height: '34px', margin: '0 auto', display: 'flex' }}>
                <select
                    style={{
                        ...inputStyle,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: getStatusColor(item.status),
                        color: 'white',
                        fontWeight: '500',
                        textAlign: 'center',
                        textShadow: '0 1px 1px rgba(0,0,0,0.2)',
                        height: '100%',
                        transition: 'opacity 0.2s',
                        outline: 'none',
                        border: 'none',
                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    value={item.status}
                    onChange={e => handleUpdateItem(item.id, 'status', e.target.value)}
                >
                    <option style={{ backgroundColor: '#fff', color: '#333', textShadow: 'none' }} value="Nouveau">Nouveau</option>
                    <option style={{ backgroundColor: '#fff', color: '#333', textShadow: 'none' }} value="En cours">En cours</option>
                    <option style={{ backgroundColor: '#fff', color: '#333', textShadow: 'none' }} value="En attente">En attente</option>
                    <option style={{ backgroundColor: '#fff', color: '#333', textShadow: 'none' }} value="Gagné">Gagné</option>
                    <option style={{ backgroundColor: '#fff', color: '#333', textShadow: 'none' }} value="Perdu">Perdu</option>
                </select>
                {/* Fold effect corner (Monday signature) */}
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '0', height: '0',
                    borderStyle: 'solid', borderWidth: '0 6px 6px 0',
                    borderColor: `transparent rgba(0,0,0,0.15) transparent transparent`,
                    pointerEvents: 'none'
                }}></div>
            </div>
        );
        if (colIndex === 3) return <input type="date" style={inputStyle} value={item.deadline || ''} onChange={e => handleUpdateItem(item.id, 'deadline', e.target.value)} />;
        if (colIndex === 4) return <input style={{ ...inputStyle, color: 'var(--color-text-secondary)', fontSize: '13px' }} value={item.comment} onChange={e => handleUpdateItem(item.id, 'comment', e.target.value)} placeholder="Ajouter une note..." />;

        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: 'var(--color-bg-app)' }}>
            <header style={{ padding: '24px 32px 0 32px', backgroundColor: 'var(--color-bg-surface)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Briefcase size={28} color="var(--color-primary)" />
                        CRM
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Gérez vos projets et le suivi client en un seul endroit.
                    </p>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>

                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-app)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                        <SearchIcon size={14} color="var(--color-text-secondary)" />
                        <input
                            type="text"
                            placeholder="Rechercher par projet ou contact..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '8px', fontSize: '13px', width: '250px' }}
                        />
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>

                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr 60px', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '12px 16px' }}>
                        {columns.map((col, idx) => (
                            <div key={idx} style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textAlign: col === 'Actions' ? 'center' : 'left' }}>
                                {col}
                            </div>
                        ))}
                    </div>

                    {/* Table Body */}
                    <div>
                        {currentData.length === 0 ? (
                            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                Aucun élément trouvé.
                            </div>
                        ) : (
                            currentData.map((item) => (
                                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr 60px', borderBottom: '1px solid var(--color-border)', padding: '8px 16px', alignItems: 'center', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div>{renderCell(item, 0)}</div>
                                    <div>{renderCell(item, 1)}</div>
                                    <div>{renderCell(item, 2)}</div>
                                    <div>{renderCell(item, 3)}</div>
                                    <div>{renderCell(item, 4)}</div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '6px', borderRadius: '4px' }}
                                            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#fed3d3'; e.currentTarget.style.color = '#e2445c'; }}
                                            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Button */}
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
                        <button
                            onClick={handleAddItem}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: '6px 10px', borderRadius: '4px' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Plus size={16} /> Ajouter une ligne
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CrmView;
