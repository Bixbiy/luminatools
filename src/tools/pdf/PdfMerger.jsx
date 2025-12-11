import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, FilePlus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const PdfMerger = () => {
    const [files, setFiles] = useState([]);
    const [isMerging, setIsMerging] = useState(false);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
        setFiles(prev => [...prev, ...pdfFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index, direction) => {
        const newFiles = [...files];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= files.length) return;

        [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
        setFiles(newFiles);
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;

        setIsMerging(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `merged-${Date.now()}.pdf`;
            link.click();
        } catch (error) {
            console.error('Merge failed:', error);
            alert('Failed to merge PDFs. Please ensure all files are valid PDF documents.');
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <ToolWrapper
            title="PDF Merger"
            description="Combine multiple PDF files into a single document. Arrange pages in any order."
            keywords="pdf merger, combine pdf, merge pdf files, join pdf"
        >
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex flex-col items-center justify-center">
                    <label className="group cursor-pointer w-full">
                        <div className="bg-[#0b1120] border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-all hover:bg-white/5">
                            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                            <p className="text-gray-300 font-medium mb-1">Add PDF Files</p>
                            <p className="text-gray-500 text-sm">Click to browse or drag and drop</p>
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>
                </div>

                {files.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FilePlus className="w-5 h-5 text-cyan-400" />
                                Selected Files ({files.length})
                            </h3>
                            <button
                                onClick={() => setFiles([])}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 divide-y divide-white/10">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="text-gray-400 font-mono text-sm w-8">{index + 1}.</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium truncate">{file.name}</div>
                                            <div className="text-gray-500 text-xs">{(file.size / 1024).toFixed(2)} KB</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => moveFile(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move up"
                                        >
                                            <MoveUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveFile(index, 'down')}
                                            disabled={index === files.length - 1}
                                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            title="Move down"
                                        >
                                            <MoveDown size={16} />
                                        </button>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={mergePdfs}
                            disabled={files.length < 2 || isMerging}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isMerging ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Download size={20} />
                                    Merge {files.length} PDF{files.length > 1 ? 's' : ''} & Download
                                </>
                            )}
                        </button>

                        {files.length < 2 && (
                            <p className="text-center text-sm text-gray-500">
                                Add at least 2 PDF files to merge
                            </p>
                        )}
                    </div>
                )}
            </div>
        </ToolWrapper>
    );
};

export default PdfMerger;
