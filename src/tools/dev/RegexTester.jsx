import React, { useState, useMemo } from 'react';
import { Flag } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const RegexTester = () => {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('gm');
    const [text, setText] = useState('');

    const matches = useMemo(() => {
        if (!pattern || !text) return [];
        try {
            const regex = new RegExp(pattern, flags);
            const results = [];
            let match;
            // Prevent infinite loops with global flag
            if (!flags.includes('g')) {
                match = regex.exec(text);
                if (match) results.push({ index: match.index, length: match[0].length, match: match[0] });
                return results;
            }

            while ((match = regex.exec(text)) !== null) {
                results.push({ index: match.index, length: match[0].length, match: match[0] });
                if (match.index === regex.lastIndex) regex.lastIndex++; // Avoid infinite loop for zero-width assertions
            }
            return results;
        } catch (e) {
            return [];
        }
    }, [pattern, flags, text]);

    const highlightText = () => {
        if (!pattern || matches.length === 0) return text;

        let lastIndex = 0;
        const parts = [];

        matches.forEach((m, i) => {
            // Non-matching part
            if (m.index > lastIndex) {
                parts.push(<span key={`n-${i}`}>{text.substring(lastIndex, m.index)}</span>);
            }
            // Matching part
            parts.push(
                <span key={`m-${i}`} className="bg-cyan-500/30 text-cyan-200 rounded-[2px] border-b border-cyan-500">
                    {text.substring(m.index, m.index + m.length)}
                </span>
            );
            lastIndex = m.index + m.length;
        });

        if (lastIndex < text.length) {
            parts.push(<span key="end">{text.substring(lastIndex)}</span>);
        }

        return parts;
    };

    return (
        <ToolWrapper
            title="Regex Tester"
            description="Test your regular expressions in real-time with highlighting."
            keywords="regex tester, regular expression validator, regex debug, js regex"
        >
            <div className="space-y-6">
                {/* Regex Input & Flags */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-400">Regular Expression</label>
                        <div className="flex items-center bg-[#0b1120] rounded-xl border border-white/10 px-4 py-3 focus-within:border-cyan-500/50">
                            <span className="text-gray-500 font-mono text-lg select-none">/</span>
                            <input
                                type="text"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white font-mono text-lg placeholder-gray-600"
                                placeholder="e.g. [a-z0-9]+"
                            />
                            <span className="text-gray-500 font-mono text-lg select-none">/</span>
                            <input
                                type="text"
                                value={flags}
                                onChange={(e) => setFlags(e.target.value)}
                                className="w-16 bg-transparent border-none focus:ring-0 text-gray-400 font-mono text-lg ml-2 placeholder-gray-700"
                                placeholder="flags"
                                title="Flags: g, i, m, s, u, y"
                            />
                        </div>
                    </div>

                    <div className="md:w-64 space-y-2">
                        <label className="text-sm font-medium text-gray-400">Common Flags</label>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {['g', 'i', 'm'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)}
                                    className={`px-3 py-1.5 rounded-lg border border-white/10 transition-colors ${flags.includes(f) ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    {f === 'g' ? 'Global' : f === 'i' ? 'Insensitive' : 'Multiline'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Test Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                    {/* Input Text */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-400">Test String</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 bg-[#0b1120] rounded-xl border border-white/10 focus:border-cyan-500/50 p-4 font-mono text-sm text-gray-300 focus:outline-none resize-none"
                            placeholder="Enter text to test regex against..."
                        />
                    </div>

                    {/* Output Highlight */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-gray-400">Match Result</label>
                            <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                                {matches.length} matches
                            </span>
                        </div>
                        <div className="flex-1 bg-[#0b1120] rounded-xl border border-white/10 p-4 font-mono text-sm text-gray-300 overflow-auto whitespace-pre-wrap break-words">
                            {highlightText()}
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default RegexTester;
