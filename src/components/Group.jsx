import React, { useState } from 'react';
import ItemRow from './ItemRow';
import { ChevronDown, MoreHorizontal, Trash2, Palette, GripVertical } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLORS = ['#0073ea', '#579bfc', '#a25ddc', '#f65f7c', '#00c875', '#e2445c', '#fdab3d', '#333333'];

const Group = ({ group, boardColor, onUpdateGroup, onDeleteGroup, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const activeColor = group.color || boardColor || '#0073ea';

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ 
        id: group.id,
        data: {
            type: 'GROUP',
            group
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        marginBottom: '32px', 
        backgroundColor: '#fff', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: isDragging ? '0 10px 30px rgba(0,0,0,0.15)' : 'var(--shadow-sm)', 
        padding: '4px 0 0 0', 
        overflow: 'hidden',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    const handleTitleChange = (e) => {
        if (e.target.value !== group.title) {
            onUpdateGroup({ title: e.target.value });
        }
    };

    // Stats calculation
    const total = group.items.length;
    const stats = group.items.reduce((acc, item) => {
        const s = item.status || 'gray';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const getStatusColor = (s) => `var(--color-status-${s})`;

    return (
        <div ref={setNodeRef} style={style}>
            {/* Group Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px' }}>
                
                {/* Drag Handle */}
                <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--color-text-light)', display: 'flex' }}>
                    <GripVertical size={16} />
                </div>

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <ChevronDown size={18} color={activeColor} />
                    </button>
                    {showColorPicker && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: '#fff',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '8px',
                            borderRadius: '8px',
                            zIndex: 100,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            width: '140px',
                            border: '1px solid var(--color-border)'
                        }}>
                            {COLORS.map(c => (
                                <div
                                    key={c}
                                    onClick={() => {
                                        onUpdateGroup({ color: c });
                                        setShowColorPicker(false);
                                    }}
                                    style={{ width: '24px', height: '24px', backgroundColor: c, borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    defaultValue={group.title}
                    onBlur={handleTitleChange}
                    style={{
                        color: activeColor,
                        fontSize: '18px',
                        fontWeight: '600',
                        border: '1px solid transparent',
                        background: 'transparent',
                        outline: 'none',
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.border = '1px solid var(--color-primary)'; }}
                    onBlurCapture={(e) => { e.target.style.background = 'transparent'; e.target.style.border = '1px solid transparent'; }}
                />
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', fontWeight: '500' }}>{group.items.length} items</span>

                <button
                    onClick={onDeleteGroup}
                    style={{ marginLeft: 'auto', color: 'var(--color-text-light)', cursor: 'pointer', opacity: 0.6 }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#e2445c'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.color = 'var(--color-text-light)'; }}
                    title="Supprimer le groupe"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Table Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 50px', // Adjusted for drag handle space
                marginBottom: '4px',
                paddingRight: '0'
            }}>
                <div></div>
                <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Item</div>
                <div style={{ padding: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                    Status
                    {/* Battery Bar for Status */}
                    {total > 0 && (
                        <div style={{ height: '6px', width: '80%', margin: '4px auto 0', display: 'flex', borderRadius: '3px', overflow: 'hidden' }}>
                            {Object.entries(stats).map(([status, count]) => (
                                <div key={status} style={{ width: `${(count / total) * 100}%`, backgroundColor: getStatusColor(status) }} />
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ padding: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>Date</div>
                <div style={{ padding: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>Créé le</div>
                <div></div>
            </div>

            {/* Items */}
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <SortableContext 
                    items={group.items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {group.items.map(item => (
                        <ItemRow
                            key={item.id}
                            item={item}
                            onUpdate={(updates) => onUpdateItem(item.id, updates)}
                            onDelete={() => onDeleteItem(item.id)}
                            groupId={group.id}
                        />
                    ))}
                </SortableContext>

                {/* Add Item Input */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 50px', // MATCHING GRID
                    gap: '1px',
                    backgroundColor: 'transparent'
                }}>
                    <div style={{ backgroundColor: '#fff', borderRight: '4px solid transparent' }}></div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--color-border)',
                        borderRight: '1px solid var(--color-border)',
                        gridColumn: '2 / -1' /* Span remaining */
                    }}>
                        <input
                            type="text"
                            placeholder="+ Add item"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    onAddItem(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Group;
