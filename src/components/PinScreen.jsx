import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const PinScreen = ({ onUnlock, title = "Tableau Protégé" }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handlePinChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        setPin(val);
        setError(false);

        if (val.length === 4) {
            // Attempt unlock automatically on 4 digits
            onUnlock(val, (success) => {
                if (!success) {
                    setError(true);
                    setPin('');
                }
            });
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: 'var(--color-bg-app)',
            color: 'var(--color-text-main)'
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '320px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: error ? '#fee2e2' : '#e0f2fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    color: error ? '#ef4444' : '#0284c7',
                    transition: 'all 0.3s'
                }}>
                    <Lock size={32} />
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{title}</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
                    Entrez le code PIN à 4 chiffres pour accéder.
                </p>

                <input
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={handlePinChange}
                    autoFocus
                    placeholder="• • • •"
                    style={{
                        fontSize: '32px',
                        letterSpacing: '12px',
                        textAlign: 'center',
                        width: '100%',
                        border: 'none',
                        borderBottom: `2px solid ${error ? '#ef4444' : '#cbd5e1'}`,
                        outline: 'none',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        color: error ? '#ef4444' : 'inherit',
                        fontWeight: 'bold'
                    }}
                />

                {error && (
                    <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '16px', fontWeight: '500' }}>
                        Code incorrect, essayez encore.
                    </p>
                )}
            </div>
        </div>
    );
};

export default PinScreen;
