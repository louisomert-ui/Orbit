import React, { useState } from 'react';

const STATUS_CONFIG = {
    done: { label: 'Done', color: 'var(--color-status-done)', hover: 'var(--color-status-done-hover)' },
    working: { label: 'Working on it', color: 'var(--color-status-working)', hover: 'var(--color-status-working-hover)' },
    stuck: { label: 'Stuck', color: 'var(--color-status-stuck)', hover: 'var(--color-status-stuck-hover)' },
    gray: { label: '', color: 'var(--color-status-gray)', hover: 'var(--color-status-gray-hover)' }
};

const ORDER = ['gray', 'working', 'done', 'stuck'];

const StatusCell = ({ status, onUpdate }) => {
    const [isHovered, setIsHovered] = useState(false);

    const currentKey = status || 'gray';
    const config = STATUS_CONFIG[currentKey] || STATUS_CONFIG['gray'];

    const handleClick = () => {
        const currentIndex = ORDER.indexOf(currentKey);
        const nextIndex = (currentIndex + 1) % ORDER.length;
        onUpdate(ORDER[nextIndex]);

        // Tiny bounce animation effect could be triggered here via state/class
    };

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '100%',
                height: '34px', /* Slightly shorter than row height for padding effect */
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
                overflow: 'hidden'
            }}
        >
            {config.label}

            {/* Fold effect on corner (Monday signature) */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '0',
                height: '0',
                borderStyle: 'solid',
                borderWidth: '0 8px 8px 0',
                borderColor: `transparent rgba(0,0,0,0.1) transparent transparent`,
                transition: 'border-width 0.2s',
                opacity: isHovered ? 1 : 0
            }}></div>
        </div>
    );
};

export default StatusCell;
