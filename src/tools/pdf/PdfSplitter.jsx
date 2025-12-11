import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, Scissors, FileText } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const PdfSplitter = () => {
    const [file, setFile] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [splitMode, setSplitMode] = useState('range'); // 'range' | 'individual'
    const [pageRange, setPageRange] = useState('');
    const [isSplitting, setIsSplitting] = useState(false);

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') return;

        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            setFile(selectedFile);
            setPageCount(pdf.getPageCount());
            setPageRange(`1-${pdf.getPageCount()}`);
        } catch (error) {
            alert('Failed to load PDF. Please ensure it is a valid PDF file.');
        }
    };

    const parsePageRange = (range, total) => {
        const pages = new Set();
        const parts = range.split(',').map(s => s.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                if (isNaN(start) || isNaN(end) || start < 1 || end > total || start > end) continue;
                for (let i = start; i <= end; i++) pages.add(i - 1); // 0-indexed
            } else {
                const page = parseInt(part);
                if (!isNaN(page) && page >= 1 && page <= total) pages.add(page - 1);
            }
        }

        return Array.from(pages).sort((a, b) => a - b);
    };

    const splitPdf = async () => {
        if (!file || !pageRange.trim()) return;

        setIsSplitting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const originalPdf = await PDFDocument.load(arrayBuffer);

            if (splitMode === 'individual') {
                // Split into individual pages
                for (let i = 0; i < pageCount; i++) {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
                    newPdf.addPage(copiedPage);

                    const pdfBytes = await newPdf.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `page-${i + 1}.pdf`;
                    link.click();
                }
            } else {
                // Extract specific pages
                const pagesToExtract = parsePageRange(pageRange, pageCount);
                if (pagesToExtract.length === 0) {
                    alert('Invalid page range. Please use format: 1,2,3 or 1-5 or 1-3,7,9-12');
                    return;
                }

                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(originalPdf, pagesToExtract);
                copiedPages.forEach(page => newPdf.addPage(page));

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `extracted-pages.pdf`;
                link.click();
            }
        } catch (error) {
            console.error('Split failed:', error);
            alert('Failed to split PDF. Please check your page range and try again.');
        } finally {
            setIsSplitting(false);
        }
    };

    return (
        <ToolWrapper
            title="PDF Splitter"
            description="Extract specific pages from PDF documents or split into individual pages."
            keywords="pdf splitter, split pdf, extract pdf pages, pdf page extractor"
        >
            <div className="max-w-4xl mx-auto space-y-8">

                {!file && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <label className="group cursor-pointer w-full">
                            <div className="bg-[#0b1120] border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-cyan-500/50 transition-all hover:bg-white/5">
                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                <p className="text-gray-300 text-lg font-medium mb-2">Upload PDF to split</p>
                                <p className="text-gray-500 text-sm">One PDF file at a time</p>
                            </div>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {file && (
                    <div className="space-y-6">
                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <div className="text-white font-medium">{file.name}</div>
                                        <div className="text-gray-500 text-sm">{pageCount} pages</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setPageCount(0);
                                    }}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Change File
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Split Mode</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setSplitMode('range')}
                                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${splitMode === 'range'
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            <Scissors className="w-4 h-4 inline mr-2" />
                                            Extract Range
                                        </button>
                                        <button
                                            onClick={() => setSplitMode('individual')}
                                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${splitMode === 'individual'
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            <FileText className="w-4 h-4 inline mr-2" />
                                            Individual Pages
                                        </button>
                                    </div>
                                </div>

                                {splitMode === 'range' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">
                                            Page Range
                                            <span className="text-xs text-gray-600 ml-2">(e.g., "1-3,7,9-12")</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={pageRange}
                                            onChange={(e) => setPageRange(e.target.value)}
                                            placeholder="1,2,3 or 1-5"
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-cyan-500 focus:outline-none"
                                        />
                                        <p className="text-xs text-gray-600">
                                            Total pages available: 1-{pageCount}
                                        </p>
                                    </div>
                                )}

                                {splitMode === 'individual' && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                        <p className="text-yellow-400 text-sm">
                                            ⚠️ This will download {pageCount} separate PDF files
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={splitPdf}
                            disabled={isSplitting || (splitMode === 'range' && !pageRange.trim())}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSplitting ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Download size={20} />
                                    {splitMode === 'individual' ? `Download ${pageCount} Pages` : 'Extract & Download'}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </ToolWrapper>
    );
};

export default PdfSplitter;
