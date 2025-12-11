import React, { useState } from 'react';
import * as prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';
import * as parserCss from 'prettier/plugins/postcss';
import * as parserBabel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import { Code, Trash2, Copy, Check } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const CodeFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('html');
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const formatCode = async (code, lang) => {
        if (!code) {
            setOutput('');
            setError(null);
            return;
        }
        try {
            let result = '';
            if (lang === 'html') {
                result = await prettier.format(code, {
                    parser: 'html',
                    plugins: [parserHtml],
                });
            } else if (lang === 'css') {
                result = await prettier.format(code, {
                    parser: 'css',
                    plugins: [parserCss],
                });
            } else if (lang === 'javascript') {
                result = await prettier.format(code, {
                    parser: 'babel',
                    plugins: [parserBabel, estree],
                });
            }
            setOutput(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            // setOutput(''); // Don't clear output, maybe user wants to see partial? actually prettier fails completely usually.
        }
    };

    const handleFormat = () => {
        formatCode(input, language);
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolWrapper
            title="Code Formatter"
            description="Beautify and format HTML, CSS, and JavaScript with Prettier."
            keywords="code formatter, html beautifier, css formatter, js prettifier"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
                {/* Input */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center bg-[#0b1120] p-2 rounded-t-xl border border-white/10 border-b-0">
                        <div className="flex space-x-2">
                            {['html', 'css', 'javascript'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => { setLanguage(lang); formatCode(input, lang); }}
                                    className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${language === lang ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {lang === 'javascript' ? 'JS' : lang}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => { setInput(''); setOutput(''); setError(null); }}
                            className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-[#0b1120] rounded-b-xl border border-white/10 focus:border-cyan-500/50 p-4 font-mono text-xs md:text-sm text-gray-300 focus:outline-none resize-none"
                        placeholder={`Paste your ${language.toUpperCase()} code here...`}
                        spellCheck="false"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center bg-[#0b1120] p-2 rounded-t-xl border border-white/10 border-b-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm font-medium pl-2">Output</span>
                            {error && <span className="text-xs text-red-400 animate-pulse">Syntax Error</span>}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleFormat}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                            >
                                Format
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className={`p-1 transition-colors ${copied ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative bg-[#0b1120] rounded-b-xl border border-white/10 overflow-hidden">
                        {error ? (
                            <div className="absolute inset-0 p-4 font-mono text-red-400 text-xs overflow-auto whitespace-pre-wrap">
                                {error}
                            </div>
                        ) : (
                            <textarea
                                readOnly
                                value={output}
                                className="w-full h-full bg-transparent border-none p-4 font-mono text-xs md:text-sm text-green-400 focus:outline-none resize-none"
                                placeholder="Formatted code will appear here..."
                            />
                        )}
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default CodeFormatter;
