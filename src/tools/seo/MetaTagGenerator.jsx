import React, { useState, useEffect } from 'react';
import { Copy, Eye } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const MetaTagGenerator = () => {
    const [data, setData] = useState({
        title: '',
        description: '',
        keywords: '',
        author: '',
        viewport: 'width=device-width, initial-scale=1.0',
        robots: 'index, follow',
        charset: 'UTF-8'
    });

    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Generate HTML
        let html = `<!-- Primary Meta Tags -->
<title>${data.title}</title>
<meta name="title" content="${data.title}">
<meta name="description" content="${data.description}">
<meta name="keywords" content="${data.keywords}">
<meta name="author" content="${data.author}">
<meta name="viewport" content="${data.viewport}">
<meta name="robots" content="${data.robots}">
<meta charset="${data.charset}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.description}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${data.title}">
<meta property="twitter:description" content="${data.description}">`;

        setCode(html);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolWrapper
            title="Meta Tag Generator"
            description="Generate standard and social media meta tags for better SEO visibility."
            keywords="meta tag generator, seo tool, open graph generator, twitter card generator"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Introduction / Form */}
                <div className="space-y-6">
                    <div className="bg-[#0b1120] border border-white/10 p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Site Information</h3>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Page Title</label>
                            <input
                                name="title"
                                value={data.title} onChange={handleChange}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                            />
                            <div className="text-right text-xs text-gray-500">{data.title.length}/60 chars</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Description</label>
                            <textarea
                                name="description"
                                value={data.description} onChange={handleChange}
                                rows="3"
                                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none resize-none"
                            />
                            <div className="text-right text-xs text-gray-500">{data.description.length}/160 chars</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Keywords (comma separated)</label>
                            <input
                                name="keywords"
                                value={data.keywords} onChange={handleChange}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Author</label>
                            <input
                                name="author"
                                value={data.author} onChange={handleChange}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-[#0b1120] border border-white/10 p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-semibold text-white">Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Robots</label>
                                <select
                                    name="robots"
                                    value={data.robots} onChange={handleChange}
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                >
                                    <option value="index, follow">Index, Follow</option>
                                    <option value="noindex, follow">No Index, Follow</option>
                                    <option value="index, nofollow">Index, No Follow</option>
                                    <option value="noindex, nofollow">No Index, No Follow</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Charset</label>
                                <input
                                    name="charset"
                                    disabled
                                    value={data.charset}
                                    className="w-full bg-[#1e293b]/50 border border-white/10 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Generated HTML</h3>
                        <button
                            onClick={copyToClipboard}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-cyan-400 hover:bg-white/10'}`}
                        >
                            <Copy size={16} /> <span>{copied ? 'Copied' : 'Copy Code'}</span>
                        </button>
                    </div>

                    <div className="flex-1 bg-[#0b1120] rounded-2xl border border-white/10 overflow-hidden relative group">
                        <textarea
                            readOnly
                            value={code}
                            className="w-full h-full bg-transparent border-none p-6 font-mono text-xs md:text-sm text-gray-300 focus:outline-none resize-none"
                        />
                    </div>

                    {/* Preview Card */}
                    <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                            <Eye size={16} /> <span>Search Engine Preview (Google)</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-gray-400">www.example.com › ...</div>
                            <div className="text-xl text-[#8ab4f8] hover:underline cursor-pointer truncate">
                                {data.title || 'Page Title'}
                            </div>
                            <div className="text-sm text-gray-300 line-clamp-2">
                                {data.description || 'This is how your page description will look in search engine results. Write a compelling summary to increase click-through rates.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default MetaTagGenerator;
