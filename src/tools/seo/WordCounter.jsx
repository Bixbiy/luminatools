import React, { useState, useEffect } from 'react';
import { AlignLeft, Type, Clock } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const WordCounter = () => {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        readTime: 0,
        speakTime: 0
    });

    useEffect(() => {
        if (!text) {
            setStats({ words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, readTime: 0, speakTime: 0 });
            return;
        }

        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = text.split(/\n+/).filter(Boolean).length;

        // Average reading speed: 200 wpm
        const readTime = Math.ceil(words / 200);
        // Average speaking speed: 130 wpm
        const speakTime = Math.ceil(words / 130);

        setStats({ words, chars, charsNoSpace, sentences, paragraphs, readTime, speakTime });
    }, [text]);

    return (
        <ToolWrapper
            title="Word Counter"
            description="Count words, characters, sentences, and paragraphs in real-time. Estimate reading time."
            keywords="word counter, character counter, sentence counter, reading time estimator"
        >
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0b1120] border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-white">{stats.words}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Words</div>
                    </div>
                    <div className="bg-[#0b1120] border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-white">{stats.chars}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Characters</div>
                    </div>
                    <div className="bg-[#0b1120] border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-white">{stats.sentences}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Sentences</div>
                    </div>
                    <div className="bg-[#0b1120] border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-white">{stats.paragraphs}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Paragraphs</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 h-[500px]">
                    {/* Input Area */}
                    <div className="flex-1 space-y-2 flex flex-col">
                        <div className="flex justify-between items-center text-sm text-gray-400">
                            <span>Enter Text</span>
                            <button
                                onClick={() => setText('')}
                                className="text-red-400 hover:text-red-300 text-xs"
                            >
                                Clear Text
                            </button>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 text-gray-300 focus:border-cyan-500/50 focus:outline-none resize-none"
                            placeholder="Type or paste your content here..."
                        />
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-full md:w-64 space-y-6">
                        {/* Time Estimates */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="flex items-center gap-2 text-white font-semibold">
                                <Clock size={18} className="text-cyan-400" /> Time Estimates
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Reading Time</span>
                                    <span className="text-white font-medium">~ {stats.readTime} min</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Speaking Time</span>
                                    <span className="text-white font-medium">~ {stats.speakTime} min</span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h4 className="flex items-center gap-2 text-white font-semibold">
                                <AlignLeft size={18} className="text-cyan-400" /> Details
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Chars (no space)</span>
                                    <span className="text-white font-medium">{stats.charsNoSpace}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default WordCounter;
