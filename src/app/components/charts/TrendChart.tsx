// import { TrendingUp } from 'lucide-react';
// import { Scan } from '@/app/lib/test';
//
// interface TrendChartProps {
//     scans: Scan[];
// }
//
// export default function TrendChart({ scans }: TrendChartProps) {
//     const diseaseByDate = scans.reduce((acc, scan) => {
//         const dateKey = scan.date.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short'
//         });
//         if (!acc[dateKey]) {
//             acc[dateKey] = {
//                 Healthy: 0,
//                 'Leaf Spot': 0,
//                 'Algal Leaf Spot': 0,
//                 Other: 0
//             };
//         }
//         if (acc[dateKey][scan.disease] !== undefined) {
//             acc[dateKey][scan.disease]++;
//         } else {
//             acc[dateKey]['Other']++;
//         }
//         return acc;
//     }, {} as Record<string, Record<string, number>>);
//
//     const dates = Object.keys(diseaseByDate).slice(-10);
//
//     const colors = {
//         'Healthy': '#22c55e',
//         'Leaf Spot': '#f59e0b',
//         'Algal Leaf Spot': '#ef4444',
//         'Other': '#8b5cf6'
//     };
//
//     return (
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//                 <TrendingUp className="w-5 h-5 text-primary-600" />
//                 <h3 className="text-lg font-semibold">Disease Trends Over Time</h3>
//             </div>
//
//             <div className="space-y-4">
//                 {dates.map((date, idx) => {
//                     const data = diseaseByDate[date];
//                     const total = Object.values(data).reduce((a, b) => a + b, 0);
//
//                     return (
//                         <div key={idx}>
//                             <div className="text-xs text-gray-600 mb-1">{date}</div>
//                             <div className="flex h-8 rounded-lg overflow-hidden bg-gray-100">
//                                 {Object.entries(data).map(([disease, count]) => {
//                                     if (count === 0) return null;
//                                     const width = (count / total) * 100;
//                                     return (
//                                         <div
//                                             key={disease}
//                                             style={{
//                                                 width: `${width}%`,
//                                                 backgroundColor: colors[disease as keyof typeof colors]
//                                             }}
//                                             className="flex items-center justify-center text-xs text-white font-medium"
//                                             title={`${disease}: ${count}`}
//                                         >
//                                             {width > 15 && count}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//
//             <div className="mt-6 flex flex-wrap gap-4">
//                 {Object.entries(colors).map(([disease, color]) => (
//                     <div key={disease} className="flex items-center gap-2">
//                         <div
//                             className="w-3 h-3 rounded-full"
//                             style={{ backgroundColor: color }}
//                         />
//                         <span className="text-xs text-gray-600">{disease}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }