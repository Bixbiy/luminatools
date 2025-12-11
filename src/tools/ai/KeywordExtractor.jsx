import React, { useState } from 'react';
import { Tag, Copy, Check, Download, Sparkles } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';

const KeywordExtractor = () => {
    const [inputText, setInputText] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [numKeywords, setNumKeywords] = useState(10);
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const extractKeywords = (text, count) => {
        if (!text.trim()) return [];

        const stopWords = new Set([
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
            'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
            'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
            'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
            'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
            'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
            'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
            'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
        ]);

        const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

        const wordFreq = {};
        words.forEach(word => {
            if (!stopWords.has(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const docFreq = {};

        sentences.forEach(sentence => {
            const uniqueWords = new Set(
                sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
            );
            uniqueWords.forEach(word => {
                if (!stopWords.has(word)) {
                    docFreq[word] = (docFreq[word] || 0) + 1;
                }
            });
        });

        const tfidf = {};
        Object.keys(wordFreq).forEach(word => {
            const tf = wordFreq[word];
            const idf = Math.log(sentences.length / (docFreq[word] || 1));
            tfidf[word] = tf * idf;
        });

        return Object.entries(tfidf)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([word, score]) => ({
                word,
                score: score.toFixed(2),
                frequency: wordFreq[word]
            }));
    };

    const handleExtract = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const result = extractKeywords(inputText, numKeywords);
            setKeywords(result);
            setIsProcessing(false);
        }, 500);
    };

    const copyKeywords = () => {
        const text = keywords.map(k => k.word).join(', ');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadCSV = () => {
        const csv = ['Keyword,Score,Frequency']
            .concat(keywords.map(k => `${k.word},${k.score},${k.frequency}`))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keywords.csv';
        a.click();
    };

    return (
        <ToolWrapper
            title="AI Keyword Extractor"
            description="Extract important keywords and phrases using TF-IDF algorithm"
            keywords="keyword extractor, seo keywords, text analysis, keyword generator"
        >
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Settings */}
                <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-4 animate-fade-in">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400">Number of Keywords</label>
                            <span className="text-3xl font-bold text-cyan-400 animate-pulse-glow">{numKeywords}</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            value={numKeywords}
                            onChange={(e) => setNumKeywords(Number(e.target.value))}
                            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="flex flex-col space-y-3 h-[500px] animate-fade-in">
                        <label className="text-sm font-medium text-gray-400">Input Text</label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 text-gray-300 focus:border-cyan-500/50 focus:outline-none resize-none transition-all"
                            placeholder="Paste your text, article, or content here..."
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col space-y-3 h-[500px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                <Tag size={16} className="text-cyan-400" /> Extracted Keywords
                            </label>
                            {keywords.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyKeywords}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy All'}
                                    </button>
                                    <button
                                        onClick={downloadCSV}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-all"
                                    >
                                        <Download size={14} />
                                        CSV
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 overflow-auto">
                            {keywords.length > 0 ? (
                                <div className="space-y-2">
                                    {keywords.map((keyword, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all animate-slide-in-left"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-cyan-400">#{index + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="text-white font-medium">{keyword.word}</span>
                                                    <div className="text-xs text-gray-500">
                                                        Score: {keyword.score} • Frequency: {keyword.frequency}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                                style={{
                                                    width: `${Math.min((keyword.score / keywords[0].score) * 100, 100)}px`
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-600 text-center">
                                    Keywords will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <NeonButton
                        onClick={handleExtract}
                        disabled={!inputText.trim()}
                        loading={isProcessing}
                        icon={Tag}
                        className="flex-1"
                    >
                        Extract Keywords
                    </NeonButton>
                    <NeonButton
                        onClick={() => {
                            setInputText('');
                            setKeywords([]);
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
                                Uses TF-IDF (Term Frequency-Inverse Document Frequency) algorithm to identify
                                the most relevant keywords in your text. Perfect for SEO optimization and content analysis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default KeywordExtractor;
