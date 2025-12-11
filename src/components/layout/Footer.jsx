import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full py-8 mt-auto border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-400">
                <div className="mb-4 md:mb-0">
                    <span className="font-semibold text-gray-200">LuminaTools</span> &copy; {new Date().getFullYear()}
                    <p className="text-sm mt-1">Premium Web Utilities. Privacy First.</p>
                </div>

                <div className="flex space-x-6">
                    <a href="#" className="hover:text-cyan-400 transition-colors"><Github size={20} /></a>
                    <a href="#" className="hover:text-cyan-400 transition-colors"><Twitter size={20} /></a>
                    <a href="#" className="hover:text-cyan-400 transition-colors"><Mail size={20} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
