import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolWrapper = ({ title, description, keywords, children }) => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Helmet>
                <title>{title} | LuminaTools</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Helmet>

            <div className="flex items-center space-x-4 mb-8">
                <Link to="/" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        {title}
                    </h1>
                    <p className="text-gray-400 mt-1">{description}</p>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl min-h-[60vh]">
                {children}
            </div>
        </div>
    );
};

export default ToolWrapper;
