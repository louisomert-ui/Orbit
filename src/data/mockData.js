export const initialData = {
    boards: [
        {
            id: 'b1',
            title: 'Roadmap Produit',
            color: '#0073ea',
            groups: [
                {
                    id: 'g1',
                    title: 'Q4 2026 Objectives',
                    color: '#579bfc',
                    items: [
                        {
                            id: 'i1',
                            name: 'Lancement Beta',
                            status: 'working',
                            date: '2026-11-15'
                        },
                        {
                            id: 'i2',
                            name: 'Design System V2',
                            status: 'stuck',
                            date: '2026-10-01'
                        }
                    ]
                },
                {
                    id: 'g2',
                    title: 'Backlog',
                    color: '#a25ddc',
                    items: [
                        {
                            id: 'i3',
                            name: 'Dark Mode',
                            status: 'gray',
                            date: ''
                        }
                    ]
                }
            ]
        },
        {
            id: 'b2',
            title: 'Marketing',
            color: '#f65f7c',
            groups: []
        }
    ]
};

export const statusOptions = {
    done: { label: 'Done', color: '#00c875' },
    working: { label: 'Working on it', color: '#fdab3d' },
    stuck: { label: 'Stuck', color: '#e2445c' },
    gray: { label: '', color: '#c4c4c4' }
};
