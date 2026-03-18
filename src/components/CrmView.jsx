import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Users, Briefcase, UserPlus, Search as SearchIcon, Plus, Trash2, Mail, Phone, Layout as LayoutIcon } from 'lucide-react';

const initialCrmData = {
    projects: [
        { id: 'p1', name: 'Refonte Site Web', client: 'Acme Corp', status: 'En cours', value: '5000€', deadline: '2026-12-01' }
    ],
    clients: [
        { id: 'c1', name: 'Acme Corp', contact: 'Alice Dupont', email: 'alice@acme.com', phone: '01 23 45 67 89' }
    ],
    prospects: [
        { id: 'pr1', name: 'Stark Industries', contact: 'Tony Stark', email: 'tony@stark.com', status: 'Chaud', value: '15000€' }
    ]
};

const CrmView = () => {
    const [crmData, setCrmData] = useState(() => {
        const saved = localStorage.getItem('pro-organizer-crm-data');
        return saved ? JSON.parse(saved) : initialCrmData;
    });

    const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'clients', 'prospects'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        localStorage.setItem('pro-organizer-crm-data', JSON.stringify(crmData));
    }, [crmData]);

    const handleAddItem = () => {
        const newItem = { id: uuidv4(), name: 'Nouvel élément' };

        if (activeTab === 'projects') {
            newItem.client = ''; newItem.status = 'À faire'; newItem.value = '0€'; newItem.deadline = '';
        } else if (activeTab === 'clients') {
            newItem.contact = ''; newItem.email = ''; newItem.phone = '';
        } else if (activeTab === 'prospects') {
            newItem.contact = ''; newItem.email = ''; newItem.status = 'Nouveau'; newItem.value = '0€';
        }

        setCrmData({
            ...crmData,
            [activeTab]: [...crmData[activeTab], newItem]
        });
    };

    const handleUpdateItem = (id, field, value) => {
        setCrmData({
            ...crmData,
            [activeTab]: crmData[activeTab].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    const handleDeleteItem = (id) => {
        if (confirm('Voulez-vous vraiment supprimer cet élément ?')) {
            setCrmData({
                ...crmData,
                [activeTab]: crmData[activeTab].filter(item => item.id !== id)
            });
        }
    };

    const currentData = crmData[activeTab].filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getColumns = () => {
        if (activeTab === 'projects') return ['Nom du Projet', 'Client', 'Statut', 'Valeur', 'Échéance', 'Actions'];
        if (activeTab === 'clients') return ['Nom de l\'Entreprise', 'Contact', 'Email', 'Téléphone', '', 'Actions'];
        if (activeTab === 'prospects') return ['Nom du Prospect', 'Contact', 'Email', 'Statut', 'Valeur Est.', 'Actions'];
        return [];
    };

    const titleMap = {
        projects: 'Gestion des Projets',
        clients: 'Annuaire Clients',
        prospects: 'Suivi des Prospects'
    };

    const renderCell = (item, colIndex) => {
        const inputStyle = {
            border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '14px', color: 'var(--color-text-main)'
        };

        if (activeTab === 'projects') {
            if (colIndex === 0) return <input style={inputStyle} value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} />;
            if (colIndex === 1) return <input style={inputStyle} value={item.client} onChange={e => handleUpdateItem(item.id, 'client', e.target.value)} placeholder="Client..." />;
            if (colIndex === 2) return (
                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} value={item.status} onChange={e => handleUpdateItem(item.id, 'status', e.target.value)}>
                    <option value="À faire">À faire</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                </select>
            );
            if (colIndex === 3) return <input style={inputStyle} value={item.value} onChange={e => handleUpdateItem(item.id, 'value', e.target.value)} placeholder="€" />;
            if (colIndex === 4) return <input type="date" style={inputStyle} value={item.deadline} onChange={e => handleUpdateItem(item.id, 'deadline', e.target.value)} />;
        }

        if (activeTab === 'clients') {
            if (colIndex === 0) return <input style={{ ...inputStyle, fontWeight: '500' }} value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} />;
            if (colIndex === 1) return <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><UserPlus size={14} color="var(--color-text-secondary)" /><input style={inputStyle} value={item.contact} onChange={e => handleUpdateItem(item.id, 'contact', e.target.value)} placeholder="Nom du contact" /></div>;
            if (colIndex === 2) return <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color="var(--color-text-secondary)" /><input style={inputStyle} value={item.email} onChange={e => handleUpdateItem(item.id, 'email', e.target.value)} placeholder="email..." /></div>;
            if (colIndex === 3) return <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} color="var(--color-text-secondary)" /><input style={inputStyle} value={item.phone} onChange={e => handleUpdateItem(item.id, 'phone', e.target.value)} placeholder="téléphone..." /></div>;
            if (colIndex === 4) return null;
        }

        if (activeTab === 'prospects') {
            if (colIndex === 0) return <input style={{ ...inputStyle, fontWeight: '500' }} value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} />;
            if (colIndex === 1) return <input style={inputStyle} value={item.contact} onChange={e => handleUpdateItem(item.id, 'contact', e.target.value)} placeholder="Contact..." />;
            if (colIndex === 2) return <input style={inputStyle} value={item.email} onChange={e => handleUpdateItem(item.id, 'email', e.target.value)} placeholder="Email..." />;
            if (colIndex === 3) return (
                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', color: item.status === 'Chaud' ? '#e2445c' : item.status === 'Froid' ? '#0073ea' : 'inherit' }} value={item.status} onChange={e => handleUpdateItem(item.id, 'status', e.target.value)}>
                    <option value="Nouveau">Nouveau</option>
                    <option value="Froid">Froid</option>
                    <option value="Tiède">Tiède</option>
                    <option value="Chaud">Chaud</option>
                </select>
            );
            if (colIndex === 4) return <input style={inputStyle} value={item.value} onChange={e => handleUpdateItem(item.id, 'value', e.target.value)} placeholder="€" />;
        }
        return null;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: 'var(--color-bg-app)' }}>
            <header style={{ padding: '24px 32px 0 32px', backgroundColor: 'var(--color-bg-surface)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Briefcase size={28} color="var(--color-primary)" />
                        CRM & Business
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Gérez vos clients, suivez vos prospects et pilotez vos projets.
                    </p>
                </div>

                {/* CRM Tabs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', borderBottom: '1px solid var(--color-border)' }}>
                    <button
                        onClick={() => setActiveTab('projects')}
                        style={{
                            padding: '8px 16px', borderBottom: activeTab === 'projects' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'projects' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: '14px',
                            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: activeTab === 'projects' ? '500' : '400', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none'
                        }}
                    >
                        <LayoutIcon size={16} /> Projets
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        style={{
                            padding: '8px 16px', borderBottom: activeTab === 'clients' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'clients' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: '14px',
                            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: activeTab === 'clients' ? '500' : '400', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none'
                        }}
                    >
                        <Users size={16} /> Clients
                    </button>
                    <button
                        onClick={() => setActiveTab('prospects')}
                        style={{
                            padding: '8px 16px', borderBottom: activeTab === 'prospects' ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeTab === 'prospects' ? 'var(--color-primary)' : 'var(--color-text-secondary)', fontSize: '14px',
                            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: activeTab === 'prospects' ? '500' : '400', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none'
                        }}
                    >
                        <UserPlus size={16} /> Prospects
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 16px' }}></div>

                    {/* Search */}
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-app)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                        <SearchIcon size={14} color="var(--color-text-secondary)" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '8px', fontSize: '13px' }}
                        />
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>

                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) 60px', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', padding: '12px 16px' }}>
                        {getColumns().map((col, idx) => (
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
                                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) 60px', borderBottom: '1px solid var(--color-border)', padding: '8px 16px', alignItems: 'center', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
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
                            <Plus size={16} /> Ajouter {activeTab === 'projects' ? 'un projet' : activeTab === 'clients' ? 'un client' : 'un prospect'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CrmView;
