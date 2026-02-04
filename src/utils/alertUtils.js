import { isPast, isToday, isTomorrow, parseISO, isValid } from 'date-fns';

export const getAlerts = (boards) => {
    const alerts = [];
    const now = new Date();
    // Reset time part for strict date comparison if needed, 
    // but date-fns isPast compares with current time. 
    // Since our inputs are YYYY-MM-DD string, parseISO gives local midnight usually.
    // Let's rely on simple string comparison or set hours to end of day for overdue.

    boards.forEach(board => {
        board.groups.forEach(group => {
            group.items.forEach(item => {
                if (!item.date || item.status === 'done') return;

                const date = parseISO(item.date);
                if (!isValid(date)) return;

                // Check Overdue: Date is strictly before today (yesterday or earlier)
                // isPast(date) is true if date < now. 
                // Since 'date' from input type=date is usually midnight local, 
                // if today is 4th, item date is 4th 00:00. isPast is true if now is 4th 10:00.
                // We want overdue only if date < today (strictly).
                // So we can check if !isToday(date) && !isTomorrow(date) && isPast(date).

                if (isPast(date) && !isToday(date)) {
                    alerts.push({
                        type: 'overdue',
                        message: 'En retard',
                        item,
                        group,
                        board,
                        date: item.date
                    });
                } else if (isToday(date) || isTomorrow(date)) {
                    alerts.push({
                        type: 'soon',
                        message: isToday(date) ? "Aujourd'hui" : 'Demain',
                        item,
                        group,
                        board,
                        date: item.date
                    });
                }
            });
        });
    });

    // Sort by date urgency
    return alerts.sort((a, b) => new Date(a.date) - new Date(b.date));
};
