import React from 'react';
import StatusCell from './StatusCell';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const ItemRow = ({ item, onUpdate, onDelete, groupId }) => {

    // dnd-kit hook
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id,
        data: {
            type: 'ITEM',
            item,
            groupId // Needed to know source group when dragging
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.3 : 1
    };

    // Helper for date color
    const getDateColor = () => {
        if (!item.date || item.status === 'done') return 'var(--color-text-secondary)';
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        // Simple string comparison works for ISO dates
        if (item.date < todayStr) return '#e2445c'; // Overdue

        if (item.date === todayStr) return '#fdab3d'; // Today

        const tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        const tmrwStr = format(tmrw, 'yyyy-MM-dd');
        if (item.date === tmrwStr) return '#fdab3d'; // Tomorrow

        return 'var(--color-text-secondary)';
    };

    const getDateWeight = () => {
        if (!item.date || item.status === 'done') return 'normal';
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        return item.date <= todayStr ? '600' : 'normal';
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="item-row"
        >
            <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 50px', // Adjusted for handle
                gap: '1px',
                backgroundColor: 'var(--color-border-light)',
                marginBottom: '1px',
                transition: 'background 0.2s',
                position: 'relative'
            }}>

                {/* Drag Handle & Indent */}
                <div style={{
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ddd',
                    cursor: 'grab'
                }}
                    {...attributes} {...listeners}
                    className="drag-handle"
                >
                    <GripVertical size={14} />
                </div>

                {/* Name Cell */}
                <div style={{ backgroundColor: '#fff', padding: '0', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        defaultValue={item.name}
                        onBlur={(e) => {
                            if (e.target.value !== item.name) onUpdate({ name: e.target.value });
                        }}
                        placeholder="Ajouter un nom..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            height: '100%',
                            padding: '8px 12px',
                            fontSize: '14px',
                            color: 'var(--color-text-main)',
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>

                {/* Status Cell */}
                <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                    <StatusCell
                        status={item.status}
                        onUpdate={(newStatus) => onUpdate({ status: newStatus })}
                    />
                </div>

                {/* Date Cell */}
                <div style={{ backgroundColor: '#fff', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                        type="date"
                        value={item.date || ''}
                        onChange={(e) => onUpdate({ date: e.target.value })}
                        style={{
                            border: 'none',
                            fontSize: '13px',
                            color: getDateColor(),
                            fontWeight: getDateWeight(),
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Created At Cell */}
                <div style={{ backgroundColor: '#fff', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                        {item.createdAt ? format(new Date(item.createdAt), 'd MMM', { locale: fr }) : '-'}
                    </span>
                </div>

                {/* Delete/More */}
                <div
                    style={{
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <button
                        className="delete-btn"
                        onClick={onDelete}
                        style={{
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                </div>

            </div>

            {/* Inline styles for hover effect */}
            <style>{`
          .item-row:hover .delete-btn { opacity: 1 !important; }
          .item-row:hover .drag-handle { color: var(--color-text-secondary) !important; }
          .item-row:hover { z-index: 2; box-shadow: var(--shadow-sm); }
       `}</style>
        </div>
    );
};

export default ItemRow;
