import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, TrendingDown } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';

const TextSummarizer = () => {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [summaryLength, setSummaryLength] = useState(3);
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const extractiveSummarize = (text, numSentences) => {
        if (!text.trim()) return '';

        const sentences = text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        if (sentences.length <= numSentences) return text;

        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFreq = {};
        words.forEach(word => {
            if (word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const sentenceScores = sentences.map(sentence => {
            const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
            const score = words.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
            return { sentence, score };
        });

        const topSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, numSentences)
            .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));

        return topSentences.map(s => s.sentence).join('. ') + '.';
    };

    const handleSummarize = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const result = extractiveSummarize(inputText, summaryLength);
            setSummary(result);
            setIsProcessing(false);
        }, 500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = inputText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const summaryWordCount = summary.trim().split(/\s+/).filter(w => w.length > 0).length;
    const reduction = wordCount > 0 ? (((wordCount - summaryWordCount) / wordCount) * 100).toFixed(1) : 0;

    return (
        <ToolWrapper
            title="AI Text Summarizer"
            description="Automatically summarize long text into key points using AI algorithm"
            keywords="text summarizer, ai summarizer, summarize text, tldr generator"
        >
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Settings */}
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-4 animate-fade-in">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400">Summary Length (sentences)</label>
                            <span className="text-3xl font-bold text-cyan-400 animate-pulse-glow">{summaryLength}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={summaryLength}
                            onChange={(e) => setSummaryLength(Number(e.target.value))}
                            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Very Short</span>
                            <span>Long</span>
                        </div>
                    </div>

                    {/* Stats */}
                    {summary && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{wordCount}</div>
                                <div className="text-xs text-gray-500 uppercase">Original Words</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-400">{summaryWordCount}</div>
                                <div className="text-xs text-gray-500 uppercase">Summary Words</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                                    <TrendingDown size={20} />
                                    {reduction}%
                                </div>
                                <div className="text-xs text-gray-500 uppercase">Reduction</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="flex flex-col space-y-3 h-[500px] animate-fade-in">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <FileText size={16} /> Input Text
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 text-gray-300 leading-relaxed focus:border-cyan-500/50 focus:outline-none resize-none transition-all"
                            placeholder="Paste your text here to summarize..."
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col space-y-3 h-[500px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Sparkles size={16} className="text-cyan-400" /> Summary
                            </label>
                            {summary && (
                                <button
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                                        }`}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <div className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 overflow-auto">
                            {summary ? (
                                <p className="text-gray-300 leading-relaxed">{summary}</p>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-600 text-center">
                                    Your AI-generated summary will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <NeonButton
                        onClick={handleSummarize}
                        disabled={!inputText.trim()}
                        loading={isProcessing}
                        icon={Sparkles}
                        className="flex-1"
                    >
                        Summarize Text
                    </NeonButton>
                    <NeonButton
                        onClick={() => {
                            setInputText('');
                            setSummary('');
                        }}
                        variant="secondary"
                        className="px-8"
                    >
                        Clear
                    </NeonButton>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-semibold mb-2">How It Works</h4>
                            <p className="text-sm text-gray-400">
                                This tool uses extractive summarization - selecting the most important sentences from your text
                                based on word frequency analysis. Perfect for quick summaries of articles, reports, and documents.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default TextSummarizer;
