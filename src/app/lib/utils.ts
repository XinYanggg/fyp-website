export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export function generateMockScans() {
    const diseases = ['Healthy', 'Leaf Spot', 'Algal Leaf Spot'];
    const scans = [];
    const now = new Date();

    for (let i = 30; i >= 0; i -= 3) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        scans.push({
            disease: diseases[Math.floor(Math.random() * diseases.length)],
            confidence: Math.floor(Math.random() * 20) + 80,
            timestamp: date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: date
        });
    }
    return scans;
}