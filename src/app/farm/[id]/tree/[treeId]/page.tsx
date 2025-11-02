'use client';

import {useParams, useRouter} from 'next/navigation';
import {MessageSquare} from 'lucide-react';
import {useApp} from '@/app/context/AppContext';
import Breadcrumb from '@/app/components/ui/Breadcrumb';
import Button from '@/app/components/ui/Button';
import Modal from '@/app/components/ui/Modal';
import {useState} from 'react';
import {Send} from 'lucide-react';
import NotFound from "@/app/not-found";

export default function TreeDetailPage({
                                           params
                                       }: {
    params: { id: string; treeId: string }
}) {
    const router = useRouter();
    const {farms, selectedFarm, selectedTree, setSelectedTree} = useApp();
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);
    const [chatInput, setChatInput] = useState('');

    const {id, treeId} = useParams();

    const farm = farms.find(f => f.id === id) || selectedFarm;
    const tree = farm?.trees.find(t => t.id === treeId) || selectedTree;

    if (!farm || !tree) {
        return <NotFound/>
    }

    const getRecommendation = (disease: string) => {
        if (disease === 'Healthy') {
            return 'You may maintain the current conditions of the durian tree. Continue regular monitoring and care practices.';
        }
        return 'Apply appropriate fungicide treatment and improve tree care practices. Consider consulting with agricultural experts for targeted interventions.';
    };

    const handleSendMessage = () => {
        if (chatInput.trim()) {
            setChatMessages([...chatMessages, {role: 'user', message: chatInput}]);

            setTimeout(() => {
                const responses = [
                    'Based on the diagnosis, I recommend applying copper-based fungicide and improving drainage around the tree.',
                    'The tree appears healthy. Continue regular monitoring and maintain current care practices.',
                    'Consider pruning affected leaves and applying organic neem oil spray weekly.',
                    'Increase spacing between trees to improve air circulation and reduce humidity.'
                ];
                setChatMessages(prev => [
                    ...prev,
                    {role: 'ai', message: responses[Math.floor(Math.random() * responses.length)]}
                ]);
            }, 1000);

            setChatInput('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
            <div className="max-w-7xl mx-auto py-10 px-6">
                <Breadcrumb
                    items={[
                        {label: 'dashboard', onClick: () => router.push('/dashboard')},
                        {label: farm.name, onClick: () => router.push(`/farm/${farm.id}`)},
                        {label: `Tree #${tree.id}`}
                    ]}
                />

                <h1 className="text-4xl font-bold mb-8 text-gray-900">Tree #{tree.id}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900">Tree Information</h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm text-gray-600">Durian Cultivar:</span>
                                <p className="text-lg font-medium text-gray-900">{tree.cultivar}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Current Status:</span>
                                <p className="text-lg">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      tree.currentDisease === 'Healthy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                  }`}>
                    {tree.currentDisease}
                  </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl border border-green-500 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary-600"/>
                            AI Recommendation
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">{getRecommendation(tree.currentDisease)}</p>
                        <Button
                            onClick={() => setShowChat(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <MessageSquare className="w-5 h-5"/>
                            Chat with AI Assistant
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Scan History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Disease</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Confidence</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Scan Time</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {tree.scans.map((scan, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          scan.disease === 'Healthy'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                      }`}>
                        {scan.disease}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{scan.confidence}%</td>
                                    <td className="px-6 py-4 text-gray-600">{scan.timestamp}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={showChat} onClose={() => setShowChat(false)} title="AI Assistant">
                <div className="h-96 flex flex-col">
                    <div
                        className="flex-1 overflow-y-auto mb-4 space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {chatMessages.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400"/>
                                <p>Ask me anything about your tree&#39;s health!</p>
                                <p className="text-sm mt-2">I can provide recommendations and answer questions.</p>
                            </div>
                        )}
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        msg.role === 'user'
                                            ? 'bg-primary-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                    }`}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your question..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Send className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}