import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Download, Sparkles, TrendingDown, Zap } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';
import SmartFileUpload from '../../components/advanced/SmartFileUpload';

const ImageCompressor = () => {
    const [file, setFile] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [compressedPreview, setCompressedPreview] = useState(null);
    const [quality, setQuality] = useState(80);
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stats, setStats] = useState(null);
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setCompressedFile(null);
        setStats(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const compressImage = async () => {
        if (!file) return;

        setIsCompressing(true);
        setProgress(0);

        try {
            const options = {
                maxSizeMB: quality / 100 * 10,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                quality: quality / 100,
                onProgress: (p) => setProgress(Math.round(p))
            };

            const compressed = await imageCompression(file, options);
            setCompressedFile(compressed);

            const reader = new FileReader();
            reader.onloadend = () => {
                setCompressedPreview(reader.result);
            };
            reader.readAsDataURL(compressed);

            const reduction = ((1 - compressed.size / file.size) * 100).toFixed(1);
            setStats({
                originalSize: (file.size / 1024).toFixed(2),
                compressedSize: (compressed.size / 1024).toFixed(2),
                reduction,
                percentage: ((compressed.size / file.size) * 100).toFixed(1)
            });
            setProgress(100);
        } catch (error) {
            console.error('Compression failed:', error);
        } finally {
            setIsCompressing(false);
        }
    };

    const downloadCompressed = () => {
        if (!compressedFile) return;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(compressedFile);
        link.download = `compressed-${file.name}`;
        link.click();
    };

    return (
        <ToolWrapper
            title="Image Compressor"
            description="Reduce image file size while maintaining quality with advanced compression"
            keywords="image compressor, compress image, reduce image size, optimize images"
        >
            <div className="max-w-6xl mx-auto space-y-8">

                {!file && (
                    <div className="animate-fade-in">
                        <SmartFileUpload
                            accept="image/*"
                            onFileSelect={handleFileSelect}
                            title="Upload Image to Compress"
                            subtitle="JPG, PNG, WebP supported"
                            showPreview={true}
                        />
                    </div>
                )}

                {file && !compressedFile && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-white font-medium">{file.name}</div>
                                    <div className="text-gray-500 text-sm">{(file.size / 1024).toFixed(2)} KB</div>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setOriginalPreview(null);
                                    }}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Change File
                                </button>
                            </div>

                            {originalPreview && (
                                <img src={originalPreview} alt="Original" className="w-full max-h-96 object-contain rounded-xl bg-slate-900" />
                            )}
                        </div>

                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-gray-400">Compression Quality</label>
                                    <span className="text-2xl font-bold text-cyan-400 animate-pulse-glow">{quality}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Maximum Compression</span>
                                    <span>Best Quality</span>
                                </div>
                            </div>

                            {isCompressing && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Compressing...</span>
                                        <span className="text-cyan-400 font-bold">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 animate-pulse-glow"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <NeonButton
                                onClick={compressImage}
                                disabled={isCompressing}
                                loading={isCompressing}
                                icon={Zap}
                                className="w-full"
                            >
                                Compress Image
                            </NeonButton>
                        </div>
                    </div>
                )}

                {compressedFile && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#0b1120] rounded-xl border border-white/10 p-4 text-center">
                                <div className="text-3xl font-bold text-white">{stats.originalSize} KB</div>
                                <div className="text-xs text-gray-400 uppercase mt-1">Original</div>
                            </div>
                            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-500/30 p-4 text-center animate-pulse-glow">
                                <div className="text-3xl font-bold text-cyan-400">{stats.compressedSize} KB</div>
                                <div className="text-xs text-gray-400 uppercase mt-1">Compressed</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30 p-4 text-center animate-pulse-glow">
                                <div className="text-3xl font-bold text-green-400 flex items-center justify-center gap-2">
                                    <TrendingDown size={28} />
                                    {stats.reduction}%
                                </div>
                                <div className="text-xs text-gray-400 uppercase mt-1">Reduction</div>
                            </div>
                        </div>

                        {/* Comparison Slider */}
                        <div className="relative bg-[#0b1120] rounded-2xl border border-white/10 p-4 overflow-hidden">
                            <div className="relative h-96">
                                <img src={originalPreview} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
                                <div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                >
                                    <img src={compressedPreview} alt="Compressed" className="absolute inset-0 w-full h-full object-contain" />
                                </div>

                                {/* Slider Handle */}
                                <div
                                    className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                    style={{ left: `${sliderPosition}%` }}
                                    onMouseDown={(e) => {
                                        const rect = e.currentTarget.parentElement.getBoundingClientRect();
                                        const handleMove = (moveEvent) => {
                                            const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                                            setSliderPosition(Math.max(0, Math.min(100, x)));
                                        };
                                        const handleUp = () => {
                                            document.removeEventListener('mousemove', handleMove);
                                            document.removeEventListener('mouseup', handleUp);
                                        };
                                        document.addEventListener('mousemove', handleMove);
                                        document.addEventListener('mouseup', handleUp);
                                    }}
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-4 bg-white"></div>
                                            <div className="w-0.5 h-4 bg-white"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Labels */}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-white">
                                    Original
                                </div>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-cyan-400">
                                    Compressed
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <NeonButton
                                onClick={downloadCompressed}
                                icon={Download}
                                className="flex-1"
                            >
                                Download Compressed ({stats.compressedSize} KB)
                            </NeonButton>
                            <NeonButton
                                onClick={() => {
                                    setFile(null);
                                    setCompressedFile(null);
                                    setOriginalPreview(null);
                                    setCompressedPreview(null);
                                    setStats(null);
                                }}
                                variant="secondary"
                                className="px-8"
                            >
                                Compress Another
                            </NeonButton>
                        </div>
                    </div>
                )}
            </div>
        </ToolWrapper>
    );
};

export default ImageCompressor;
