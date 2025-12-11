import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Lock, Copy, Check, FileText, Upload } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';
import SmartFileUpload from '../../components/advanced/SmartFileUpload';

const HashGenerator = () => {
    const [text, setText] = useState('');
    const [hashes, setHashes] = useState({});
    const [copied, setCopied] = useState('');
    const [mode, setMode] = useState('text'); // 'text' | 'file'
    const [isProcessing, setIsProcessing] = useState(false);

    const algorithms = [
        { name: 'MD5', func: CryptoJS.MD5, color: 'text-cyan-400' },
        { name: 'SHA-1', func: CryptoJS.SHA1, color: 'text-blue-400' },
        { name: 'SHA-256', func: CryptoJS.SHA256, color: 'text-purple-400' },
        { name: 'SHA-512', func: CryptoJS.SHA512, color: 'text-pink-400' },
    ];

    const generateHashes = () => {
        if (!text.trim()) return;

        setIsProcessing(true);
        const newHashes = {};

        algorithms.forEach(({ name, func }) => {
            newHashes[name] = func(text).toString();
        });

        setTimeout(() => {
            setHashes(newHashes);
            setIsProcessing(false);
        }, 300); // Simulate processing for animation effect
    };

    const handleFileHash = async (file) => {
        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            const newHashes = {};

            algorithms.forEach(({ name, func }) => {
                const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(content));
                newHashes[name] = func(wordArray).toString();
            });

            setHashes(newHashes);
            setIsProcessing(false);
        };

        reader.readAsArrayBuffer(file);
    };

    const copyHash = (hash) => {
        navigator.clipboard.writeText(hash);
        setCopied(hash);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <ToolWrapper
            title="Hash Generator"
            description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files with advanced features"
            keywords="hash generator, md5, sha256, sha512, checksum, file hash"
        >
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Mode Toggle */}
                <div className="flex items-center justify-center gap-2 bg-[#0b1120] rounded-2xl p-1 border border-white/10 w-fit mx-auto">
                    <button
                        onClick={() => setMode('text')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'text'
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <FileText size={18} />
                        Text Mode
                    </button>
                    <button
                        onClick={() => setMode('file')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'file'
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Upload size={18} />
                        File Mode
                    </button>
                </div>

                {/* Input Area */}
                {mode === 'text' ? (
                    <div className="space-y-3 animate-fade-in">
                        <label className="text-sm font-medium text-gray-400">Input Text</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-[#0b1120] border border-white/10 rounded-xl p-4 text-gray-300 focus:border-cyan-500/50 focus:outline-none resize-none h-32 transition-all"
                            placeholder="Enter text to hash..."
                        />
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <SmartFileUpload
                            onFileSelect={handleFileHash}
                            title="Upload File to Hash"
                            subtitle="Supports any file type"
                            icon={Lock}
                        />
                    </div>
                )}

                {/* Generate Button */}
                {mode === 'text' && (
                    <NeonButton
                        onClick={generateHashes}
                        disabled={!text.trim() || isProcessing}
                        loading={isProcessing}
                        icon={Lock}
                        className="w-full"
                    >
                        Generate Hashes
                    </NeonButton>
                )}

                {/* Hash Results */}
                {Object.keys(hashes).length > 0 && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Lock className="text-cyan-400" size={20} />
                            Generated Hashes
                        </h3>

                        <div className="grid gap-4">
                            {algorithms.map(({ name, color }, index) => (
                                <div
                                    key={name}
                                    className="group bg-[#0b1120] rounded-xl border border-white/10 p-4 hover:border-cyan-500/30 transition-all duration-300 animate-slide-in-left"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
                                            <span className={`font-bold text-lg ${color}`}>{name}</span>
                                        </div>
                                        <button
                                            onClick={() => copyHash(hashes[name])}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied === hashes[name]
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {copied === hashes[name] ? (
                                                <>
                                                    <Check size={14} />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-gray-300 break-all hover:text-white transition-colors">
                                        {hashes[name]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Panel */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-white/10 rounded-2xl p-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Lock size={18} className="text-cyan-400" />
                        About Hash Functions
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                            <span className="text-cyan-400 font-bold">MD5:</span> 128-bit, fast but not cryptographically secure
                        </div>
                        <div>
                            <span className="text-blue-400 font-bold">SHA-1:</span> 160-bit, deprecated for security
                        </div>
                        <div>
                            <span className="text-purple-400 font-bold">SHA-256:</span> 256-bit, industry standard
                        </div>
                        <div>
                            <span className="text-pink-400 font-bold">SHA-512:</span> 512-bit, maximum security
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default HashGenerator;
