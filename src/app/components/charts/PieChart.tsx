interface PieChartProps {
    data: Array<{ disease: string; count: number; percentage: number }>;
}

export default function PieChart({ data }: PieChartProps) {
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="text-center">
            <h3 className="text-sm font-semibold mb-4">Disease Distribution</h3>
            <div className="relative w-40 h-40 mx-auto">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {data.map((item, index) => {
                        let startAngle = 0;
                        for (let i = 0; i < index; i++) {
                            startAngle += (data[i].percentage / 100) * 360;
                        }
                        const angle = (item.percentage / 100) * 360;
                        const endAngle = startAngle + angle;

                        const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
                        const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
                        const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
                        const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);

                        const largeArc = angle > 180 ? 1 : 0;

                        return (
                            <path
                                key={index}
                                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                fill={colors[index % colors.length]}
                                />
                            );
                    })}
                </svg>
            </div>
            <div className="mt-4 space-y-1">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div
                            className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span>{item.disease}: {item.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}