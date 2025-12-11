import { Search, FileText, Image, Video, Code, Calculator, Star, TrendingUp, Wrench, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ToolCard = ({ title, description, url, icon: Icon }) => (
    <Link to={url} className="group relative block">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-75 blur transition duration-500" />
        <div className="relative h-full bg-[#0b1120] border border-white/10 rounded-xl p-4 hover:bg-[#1e293b] transition-colors">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors truncate">{title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-2">{description}</p>
                </div>
            </div>
        </div>
    </Link>
);

const Home = () => {
    const tools = [
        {
            category: 'Developer Tools', icon: Code, tools: [
                { title: 'JSON Formatter', description: 'Format, validate & minify JSON', url: '/tools/json-formatter', icon: FileText },
                { title: 'Base64 Converter', description: 'Encode/decode Base64', url: '/tools/base64-converter', icon: Code },
                { title: 'Hash Generator', description: 'MD5, SHA-1, SHA-256, SHA-512', url: '/tools/hash-generator', icon: Code },
                { title: 'UUID Generator', description: 'Generate unique identifiers', url: '/tools/uuid-generator', icon: Code },
                { title: 'Code Formatter', description: 'Beautify HTML, CSS, JS', url: '/tools/code-formatter', icon: Code },
                { title: 'Regex Tester', description: 'Test regular expressions', url: '/tools/regex-tester', icon: Code },
                { title: 'QR Code Generator', description: 'Create QR codes', url: '/tools/qr-generator', icon: Code },
            ]
        },
        {
            category: 'Utility Tools', icon: Calculator, tools: [
                { title: 'Age Calculator', description: 'Calculate exact age', url: '/tools/age-calculator', icon: Calculator },
                { title: 'Percentage Calculator', description: 'Calculate percentages', url: '/tools/percentage-calculator', icon: Calculator },
                { title: 'EMI Calculator', description: 'Loan payment estimator', url: '/tools/emi-calculator', icon: Calculator },
                { title: 'Unit Converter', description: 'Length, weight, temp', url: '/tools/unit-converter', icon: Wrench },
                { title: 'Currency Converter', description: 'Exchange rates', url: '/tools/currency-converter', icon: TrendingUp },
            ]
        },
        {
            category: 'SEO Tools', icon: TrendingUp, tools: [
                { title: 'Meta Tag Generator', description: 'SEO & social tags', url: '/tools/meta-tag-generator', icon: Code },
                { title: 'Word Counter', description: 'Count words & chars', url: '/tools/word-counter', icon: FileText },
            ]
        },
        {
            category: 'Image Tools', icon: Image, tools: [
                { title: 'Image Compressor', description: 'Reduce file size', url: '/tools/image-compressor', icon: Image },
                { title: 'Image Resizer', description: 'Resize images', url: '/tools/image-resizer', icon: Image },
                { title: 'Format Converter', description: 'PNG, JPG, WebP', url: '/tools/image-format-converter', icon: Image },
            ]
        },
        {
            category: 'PDF Tools', icon: FileText, tools: [
                { title: 'PDF Merger', description: 'Combine PDFs', url: '/tools/pdf-merger', icon: FileText },
                { title: 'PDF Splitter', description: 'Extract pages', url: '/tools/pdf-splitter', icon: FileText },
            ]
        },
        {
            category: 'Video & Audio', icon: Video, tools: [
                { title: 'Video to MP3', description: 'Extract audio', url: '/tools/video-to-mp3', icon: Video },
            ]
        },
        {
            category: 'AI Tools', icon: Brain, tools: [
                { title: 'Text Summarizer', description: 'Auto summarize text', url: '/tools/text-summarizer', icon: Brain },
                { title: 'Keyword Extractor', description: 'SEO keyword analysis', url: '/tools/keyword-extractor', icon: Brain },
            ]
        },
    ];

    return (
        <>
            <Helmet>
                <title>LuminaTools - 22+ Free Online Tools | Privacy-First Web Utilities</title>
                <meta name="description" content="Free online tools for developers, creators, and professionals. JSON formatter, image compressor, PDF merger, and more. All processing happens in your browser." />
                <meta name="keywords" content="online tools, web tools, developer tools, image tools, pdf tools, free utilities" />
            </Helmet>

            <div className="space-y-12 py-8">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-gray-400 pb-2">
                            Master Your Workflow
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            22+ privacy-first web tools. Process files instantly in your browser. No uploads, no waiting.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tools..."
                                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* Tools Grid by Category */}
                {tools.map(({ category, icon: Icon, tools: categoryTools }) => (
                    <section key={category} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Icon className="w-6 h-6 text-cyan-400" />
                            <h2 className="text-2xl font-bold text-white">{category}</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {categoryTools.map(tool => (
                                <ToolCard key={tool.url} {...tool} />
                            ))}
                        </div>
                    </section>
                ))}

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-white/10 rounded-2xl p-8 text-center">
                    <Star className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">All Tools Are Free & Privacy-First</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Every tool processes data locally in your browser. We never see your files, and we never will.
                    </p>
                </section>
            </div>
        </>
    );
};

export default Home;
