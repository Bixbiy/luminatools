import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Copy, Check, Download, RefreshCw, Sparkles } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';

const UuidGenerator = () => {
    const [uuids, setUuids] = useState([]);
    const [quantity, setQuantity] = useState(5);
    const [copied, setCopied] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateUUIDs = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const newUUIDs = Array.from({ length: quantity }, () => ({
                id: uuidv4(),
                timestamp: Date.now()
            }));
            setUuids(newUUIDs);
            setIsGenerating(false);
        }, 300); // Animation effect
    };

    const copyUUID = (uuid) => {
        navigator.clipboard.writeText(uuid);
        setCopied(uuid);
        setTimeout(() => setCopied(''), 2000);
    };

    const copyAll = () => {
        const allUUIDs = uuids.map(u => u.id).join('\n');
        navigator.clipboard.writeText(allUUIDs);
        setCopied('all');
        setTimeout(() => setCopied(''), 2000);
    };

    const downloadJSON = () => {
        const data = JSON.stringify(uuids.map(u => u.id), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uuids.json';
        a.click();
    };

    const downloadCSV = () => {
        const csv = ['UUID'].concat(uuids.map(u => u.id)).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uuids.csv';
        a.click();
    };

    return (
        <ToolWrapper
            title="UUID Generator"
            description="Generate unique identifiers (v4) with bulk export options"
            keywords="uuid generator, guid generator, unique id, identifier generator"
        >
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Controls */}
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400">Quantity</label>
                            <span className="text-2xl font-bold text-cyan-400">{quantity}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>1 UUID</span>
                            <span>100 UUIDs</span>
                        </div>
                    </div>

                    <NeonButton
                        onClick={generateUUIDs}
                        loading={isGenerating}
                        icon={Sparkles}
                        className="w-full"
                    >
                        Generate {quantity} UUID{quantity > 1 ? 's' : ''}
                    </NeonButton>
                </div>

                {/* UUIDs List */}
                {uuids.length > 0 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Generated UUIDs ({uuids.length})
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyAll}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied === 'all'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                                        }`}
                                >
                                    {copied === 'all' ? <Check size={16} /> : <Copy size={16} />}
                                    {copied === 'all' ? 'Copied!' : 'Copy All'}
                                </button>
                                <button
                                    onClick={downloadJSON}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-all"
                                >
                                    <Download size={16} />
                                    JSON
                                </button>
                                <button
                                    onClick={downloadCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-all"
                                >
                                    <Download size={16} />
                                    CSV
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 overflow-hidden">
                            <div className="max-h-[500px] overflow-auto">
                                <div className="divide-y divide-white/10">
                                    {uuids.map((uuid, index) => (
                                        <div
                                            key={uuid.id}
                                            className="group flex items-center justify-between p-4 hover:bg-white/5 transition-all animate-slide-in-left"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-cyan-400">#{index + 1}</span>
                                                </div>
                                                <code className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">
                                                    {uuid.id}
                                                </code>
                                            </div>
                                            <button
                                                onClick={() => copyUUID(uuid.id)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all opacity-0 group-hover:opacity-100 ${copied === uuid.id
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {copied === uuid.id ? <Check size={14} /> : <Copy size={14} />}
                                                {copied === uuid.id ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-white/10 rounded-2xl p-6">
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-cyan-400" />
                        About UUID v4
                    </h4>
                    <p className="text-sm text-gray-400">
                        Universally Unique Identifiers (UUIDs) version 4 are randomly generated with 122 bits of entropy,
                        providing a probability of duplication so low it's practically negligible for most use cases.
                    </p>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default UuidGenerator;
