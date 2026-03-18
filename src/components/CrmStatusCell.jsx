import React, { useState } from 'react';

const STATUS_CONFIG = {
    'Nouveau': { label: 'Nouveau', color: '#579bfc', hover: '#4d8beb' },
    'En cours': { label: 'En cours', color: '#fdab3d', hover: '#e39937' },
    'En attente': { label: 'En attente', color: '#ffcb00', hover: '#e5b600' },
    'Gagné': { label: 'Gagné', color: '#00c875', hover: '#00b469' },
    'Perdu': { label: 'Perdu', color: '#e2445c', hover: '#cb3d52' }
};

const ORDER = ['Nouveau', 'En cours', 'En attente', 'Gagné', 'Perdu'];

const CrmStatusCell = ({ status, onUpdate }) => {
    const [isHovered, setIsHovered] = useState(false);

    const currentKey = status || 'Nouveau';
    const config = STATUS_CONFIG[currentKey] || STATUS_CONFIG['Nouveau'];

    const handleClick = () => {
        const currentIndex = ORDER.indexOf(currentKey);
        const nextIndex = (currentIndex + 1) % ORDER.length;
        onUpdate(ORDER[nextIndex]);
    };

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '100%',
                height: '34px',
                backgroundColor: isHovered && config.hover ? config.hover : config.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'background-color 0.2s, transform 0.1s',
                margin: '0 auto',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
            }}
        >
            {config.label}

            {/* Fold effect on corner */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '0',
                height: '0',
                borderStyle: 'solid',
                borderWidth: '0 8px 8px 0',
                borderColor: `transparent rgba(0,0,0,0.15) transparent transparent`,
                transition: 'border-width 0.2s',
                opacity: isHovered ? 1 : 0
            }}></div>
        </div>
    );
};

export default CrmStatusCell;
