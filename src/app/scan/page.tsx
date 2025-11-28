'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, Upload } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import Breadcrumb from '@/app/components/ui/Breadcrumb';
import Button from '@/app/components/ui/Button';
import {useState, useRef, useEffect} from 'react';

export default function ScanPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const farmIdFromUrl = searchParams.get('farmId');

    const { farms, selectedFarm, setSelectedFarm, saveScan, detectDisease } = useApp();
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [scanResult, setScanResult] = useState<{ disease: string; confidence: number } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFarmId, setSelectedFarmId] = useState(farmIdFromUrl || '');
    const [selectedTreeId, setSelectedTreeId] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const currentFarm = farms.find(f => f._id?.toString() === selectedFarmId) || selectedFarm;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    const handleDetect = async () => {
        if (uploadedImage) {
            setLoading(true);
            const data = await detectDisease(uploadedImage);
            if (data) {
                setScanResult({ disease: data.prediction.toLowerCase().split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" "), confidence: Math.round(data.confidence * 10000) / 100, });
            }
            setLoading(false);
        }
    };

    const handleSaveScan = () => {
        if (scanResult && selectedTreeId && selectedFarmId) {
            saveScan(selectedFarmId, selectedTreeId, scanResult.disease, scanResult.confidence);
            alert('Scan saved successfully!');
            setScanResult(null);
            setUploadedImage(null);
            setSelectedTreeId('');
            router.push(`/farm/${selectedFarmId}`);
        }
    };

    const handleReset = () => {
        setScanResult(null);
        setUploadedImage(null);
        setSelectedTreeId('');

        // Reset the file input field by setting its value to an empty string
        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // Clear the file input
        }

        if (cameraInputRef.current) {
            cameraInputRef.current.value = '';  // Clear the camera input (if used)
        }
    };

    useEffect(() => {
        // Check if the device is mobile or desktop
        const checkIfMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice = /iphone|ipod|ipad|android/.test(userAgent);
            setIsMobile(isMobileDevice);
        };
        checkIfMobile();
    }, [isMobile]);

    useEffect(() => {
        if (!uploadedImage) return;

        const updatePreview = () => {
            const objectUrl = URL.createObjectURL(uploadedImage);
            setPreviewUrl(objectUrl);
            return objectUrl;
        };

        const objectUrl = updatePreview();

        // cleanup: revoke old object URL
        return () => URL.revokeObjectURL(objectUrl);
    }, [uploadedImage]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
            <div className="max-w-7xl mx-auto py-10 px-6">
                {currentFarm && (
                    <Breadcrumb
                        items={[
                            {label: 'dashboard', onClick: () => router.push('/dashboard')},
                            {label: currentFarm.name, onClick: () => router.push(`/farm/${currentFarm._id}`)},
                            {label: 'Scan'}
                        ]}
                    />
                )}

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Disease Detection</h2>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                    />

                    {!uploadedImage && (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                                <p className="text-gray-600 mb-6">Drop files or click to upload</p>
                                <div className="flex gap-4 justify-center flex-wrap">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 hover:shadow-md"
                                    >
                                        <Upload className="w-5 h-5 inline mr-2"/>
                                        Browse Files
                                    </button>
                                    {isMobile && (
                                        <Button
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <Camera className="w-5 h-5 inline mr-2"/>
                                            Take Photo
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {uploadedImage && (
                        <div className="mb-6">
                            <img
                                src={previewUrl ?? undefined}
                                alt="Uploaded leaf"
                                className="w-full max-h-96 object-contain rounded-xl shadow-md"
                            />
                        </div>
                    )}

                    {uploadedImage && !scanResult && (
                        <Button
                            onClick={handleDetect}
                            disabled={loading}
                            className="w-full text-black py-3 font-medium bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? "Detecting..." : "Detect Disease"}
                        </Button>
                    )}

                    {scanResult && (
                        <div className="space-y-6">
                            <div className="text-center p-8 rounded-xl">
                                <h2 className="text-3xl font-bold mb-3 text-gray-900">Result: {scanResult.disease}</h2>
                                <p className="text-2xl font-bold text-primary-600">Confidence: {scanResult.confidence}%</p>
                                {scanResult.confidence === 0 && (
                                    <p className="text-red-600 font-semibold mt-3">
                                        The image does not look like a durian leaf
                                    </p>
                                )}
                            </div>

                            {scanResult.confidence !== 0 && (
                                <>
                                    {!farmIdFromUrl && (
                                        <div className="relative w-full">
                                            <select
                                                value={selectedFarmId}
                                                onChange={(e) => {
                                                    setSelectedFarmId(e.target.value);
                                                    const farm = farms.find(f => f._id?.toString() === e.target.value);
                                                    if (farm) setSelectedFarm(farm);
                                                    setSelectedTreeId('');
                                                }}
                                                className="w-full appearance-none px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                                            >
                                                <option value="">Select a farm</option>
                                                {farms.map((farm) => (
                                                    <option key={farm._id?.toString()} value={farm._id?.toString()}>
                                                        {farm.name} - {farm.location}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                                                <svg
                                                    className="w-4 h-4 text-gray-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {currentFarm && (
                                        <div className="relative w-full">
                                            <select
                                                value={selectedTreeId}
                                                onChange={(e) => setSelectedTreeId(e.target.value)}
                                                className="w-full appearance-none px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                                            >
                                                <option value="">Select a tree</option>
                                                {currentFarm.trees.map((tree) => (
                                                    <option key={tree.id} value={tree.id}>
                                                        Tree #{tree.id} - {tree.cultivar}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                                                <svg
                                                    className="w-4 h-4 text-gray-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleSaveScan}
                                    disabled={!selectedTreeId || !selectedFarmId || scanResult.confidence==0}
                                    className="flex-1 py-4 font-semibold w-full text-black bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Save Result
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="flex-1 py-4 font-semibold px-6 border-2 border-gray-300 rounded-lg text-sm cursor-pointer transition-all duration-300 ease-in-out hover:border-primary-500 hover:text-primary-600 hover:bg-gray-100 hover:shadow-md"
                                >
                                    Scan Another
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}