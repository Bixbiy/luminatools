import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Image as ImageIcon } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';
import SmartFileUpload from '../../components/advanced/SmartFileUpload';

const Base64Converter = () => {
    const [mode, setMode] = useState('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [inputMode, setInputMode] = useState('text'); // 'text' | 'file'

    const handleEncode = () => {
        try {
            const encoded = btoa(input);
            setOutput(encoded);
            setError('');
        } catch (e) {
            setError('Failed to encode: ' + e.message);
            setOutput('');
        }
    };

    const handleDecode = () => {
        try {
            const decoded = atob(input);
            setOutput(decoded);
            setError('');

            // Check if it's an image
            if (input.startsWith('data:image/') || input.includes('base64,')) {
                setImagePreview(input.includes('data:') ? input : `data:image/png;base64,${input}`);
            }
        } catch (e) {
            setError('Failed to decode: Invalid Base64 string');
            setOutput('');
        }
    };

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            setOutput(base64);

            if (file.type.startsWith('image/')) {
                setImagePreview(base64);
            }
        };
        reader.readAsDataURL(file);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${mode}d.txt`;
        a.click();
    };

    return (
        <ToolWrapper
            title="Base64 Converter"
            description="Encode and decode Base64 strings with support for text and files"
            keywords="base64 encoder, base64 decoder, base64 converter, encode decode"
        >
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Mode Toggle */}
                <div className="flex items-center justify-center gap-2 bg-[#0b1120] rounded-2xl p-1 border border-white/10 w-fit mx-auto">
                    <button
                        onClick={() => {
                            setMode('encode');
                            setInput('');
                            setOutput('');
                            setError('');
                            setImagePreview(null);
                        }}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'encode'
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Encode
                    </button>
                    <button
                        onClick={() => {
                            setMode('decode');
                            setInput('');
                            setOutput('');
                            setError('');
                            setImagePreview(null);
                        }}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'decode'
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Decode
                    </button>
                </div>

                {/* Input Mode for Encode */}
                {mode === 'encode' && (
                    <div className="flex items-center justify-center gap-2 bg-[#0b1120] rounded-xl p-1 border border-white/10 w-fit mx-auto">
                        <button
                            onClick={() => setInputMode('text')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === 'text'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <FileText size={16} />
                            Text
                        </button>
                        <button
                            onClick={() => setInputMode('file')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${inputMode === 'file'
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <ImageIcon size={16} />
                            File
                        </button>
                    </div>
                )}

                {/* Input Area */}
                {mode === 'encode' && inputMode === 'file' ? (
                    <div className="animate-fade-in">
                        <SmartFileUpload
                            onFileSelect={handleFileUpload}
                            title="Upload File to Encode"
                            subtitle="Images, documents, any file type"
                            showPreview={true}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input */}
                        <div className="flex flex-col space-y-3 h-[500px] animate-fade-in">
                            <label className="text-sm font-medium text-gray-400">
                                Input {mode === 'encode' ? 'Text' : 'Base64'}
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 text-gray-300 font-mono text-sm focus:border-cyan-500/50 focus:outline-none resize-none transition-all"
                                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                            />
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm animate-slide-in-left">
                                    ⚠️ {error}
                                </div>
                            )}
                        </div>

                        {/* Output */}
                        <div className="flex flex-col space-y-3 h-[500px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-400">
                                    Output {mode === 'encode' ? 'Base64' : 'Text'}
                                </label>
                                <div className="flex gap-2">
                                    {output && (
                                        <>
                                            <button
                                                onClick={copyToClipboard}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-white/5 text-cyan-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                            <button
                                                onClick={downloadFile}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white transition-all"
                                            >
                                                <Download size={14} />
                                                Download
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 bg-[#0b1120] border border-white/10 rounded-xl p-4 overflow-auto">
                                {imagePreview && mode === 'decode' ? (
                                    <div className="h-full flex flex-col items-center justify-center gap-4">
                                        <img src={imagePreview} alt="Preview" className="max-h-96 rounded-lg border border-white/10" />
                                        <p className="text-xs text-gray-500">Image Preview</p>
                                    </div>
                                ) : output ? (
                                    <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap break-all">
                                        {output}
                                    </pre>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-600">
                                        Your {mode}d output will appear here
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {!(mode === 'encode' && inputMode === 'file') && (
                    <NeonButton
                        onClick={mode === 'encode' ? handleEncode : handleDecode}
                        disabled={!input.trim()}
                        icon={mode === 'encode' ? FileText : ImageIcon}
                        className="w-full"
                    >
                        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
                    </NeonButton>
                )}
            </div>
        </ToolWrapper>
    );
};

export default Base64Converter;
