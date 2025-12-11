import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Trash2, Search, GitBranch, Code2, Sparkles } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';

const JsonFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState('formatted'); // 'formatted' | 'tree' | 'minified'
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState(null);

    const formatJSON = () => {
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError('');

            // Calculate stats
            const size = new Blob([input]).size;
            const formattedSize = new Blob([formatted]).size;
            setStats({
                originalSize: (size / 1024).toFixed(2),
                formattedSize: (formattedSize / 1024).toFixed(2),
                keys: countKeys(parsed),
                depth: getDepth(parsed)
            });
        } catch (e) {
            setError(e.message);
            setOutput('');
            setStats(null);
        }
    };

    const minifyJSON = () => {
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError('');

            const size = new Blob([input]).size;
            const minifiedSize = new Blob([minified]).size;
            setStats({
                originalSize: (size / 1024).toFixed(2),
                minifiedSize: (minifiedSize / 1024).toFixed(2),
                reduction: (((size - minifiedSize) / size) * 100).toFixed(1) + '%'
            });
        } catch (e) {
            setError(e.message);
            setOutput('');
        }
    };

    const countKeys = (obj, count = 0) => {
        if (!obj || typeof obj !== 'object') return count;

        Object.keys(obj).forEach(key => {
            count++;
            count = countKeys(obj[key], count);
        });

        return count;
    };

    const getDepth = (obj, depth = 0) => {
        if (!obj || typeof obj !== 'object') return depth;

        const depths = Object.values(obj).map(val => getDepth(val, depth + 1));
        return Math.max(depth, ...depths);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJSON = () => {
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
    };

    const highlightJSON = (json) => {
        if (!json) return '';

        return json
            .replace(/(".*?")(\s*:)/g, '<span class="text-cyan-400">$1</span>$2')
            .replace(/:\s*(".*?")/g, ': <span class="text-green-400">$1</span>')
            .replace(/:\s*(\d+)/g, ': <span class="text-yellow-400">$1</span>')
            .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>');
    };

    const renderTreeView = (obj, level = 0) => {
        if (!obj || typeof obj !== 'object') return null;

        return (
            <div className={`${level > 0 ? 'ml-6 border-l-2 border-white/10 pl-4' : ''}`}>
                {Object.entries(obj).map(([key, value], index) => (
                    <div key={index} className="py-1">
                        <div className="flex items-start gap-2">
                            <span className="text-cyan-400 font-mono text-sm">"{key}":</span>
                            {typeof value === 'object' && value !== null ? (
                                <span className="text-gray-500 text-sm">{Array.isArray(value) ? '[...]' : '{...}'}</span>
                            ) : (
                                <span className={`font-mono text-sm ${typeof value === 'string' ? 'text-green-400' :
                                    typeof value === 'number' ? 'text-yellow-400' :
                                        'text-purple-400'
                                    }`}>
                                    {JSON.stringify(value)}
                                </span>
                            )}
                        </div>
                        {typeof value === 'object' && value !== null && renderTreeView(value, level + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ToolWrapper
            title="JSON Formatter"
            description="Format, validate, and minify JSON with advanced features and beautification"
            keywords="json formatter, json validator, json beautifier, json minifier"
        >
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Controls */}
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* View Mode Tabs */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                            {[
                                { id: 'formatted', icon: Code2, label: 'Format' },
                                { id: 'minified', icon: Sparkles, label: 'Minify' },
                                { id: 'tree', icon: Tree, label: 'Tree' },
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setViewMode(mode.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === mode.id
                                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <mode.icon size={16} />
                                    {mode.label}
                                </button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {output && (
                                <>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-colors"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={downloadJSON}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-colors"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                            {Object.entries(stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                    <div className="text-2xl font-bold text-cyan-400 animate-bounce-in">{value}</div>
                                    <div className="text-xs text-gray-500 uppercase mt-1">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="flex flex-col space-y-3 h-[600px] animate-fade-in">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <FileText size={16} /> Input JSON
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 text-gray-300 font-mono text-sm focus:border-cyan-500/50 focus:outline-none resize-none transition-all"
                            placeholder='{"name": "John", "age": 30}'
                        />
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-slide-in-left">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>

                    {/* Output */}
                    <div className="flex flex-col space-y-3 h-[600px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Sparkles size={16} className="text-cyan-400" /> Output
                        </label>
                        <div className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 overflow-auto">
                            {viewMode === 'tree' && output ? (
                                <div className="text-sm">
                                    {renderTreeView(JSON.parse(output))}
                                </div>
                            ) : (
                                <pre
                                    className="text-gray-300 font-mono text-sm whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: highlightJSON(output) }}
                                />
                            )}
                            {!output && (
                                <div className="h-full flex items-center justify-center text-gray-600">
                                    Your formatted JSON will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <NeonButton
                        onClick={viewMode === 'minified' ? minifyJSON : formatJSON}
                        disabled={!input.trim()}
                        icon={viewMode === 'minified' ? Sparkles : Code2}
                        className="flex-1"
                    >
                        {viewMode === 'minified' ? 'Minify JSON' : 'Format JSON'}
                    </NeonButton>
                    <NeonButton
                        onClick={() => {
                            setInput('');
                            setOutput('');
                            setError('');
                            setStats(null);
                        }}
                        variant="secondary"
                        icon={Trash2}
                        className="px-8"
                    >
                        Clear
                    </NeonButton>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default JsonFormatter;
