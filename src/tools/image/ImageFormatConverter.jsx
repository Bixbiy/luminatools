import React, { useState } from 'react';
import { Upload, Download, RefreshCw } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const ImageFormatConverter = () => {
    const [originalFile, setOriginalFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [outputFormat, setOutputFormat] = useState('png');
    const [quality, setQuality] = useState(92);

    const formats = [
        { value: 'png', label: 'PNG', mime: 'image/png' },
        { value: 'jpg', label: 'JPG', mime: 'image/jpeg' },
        { value: 'webp', label: 'WebP', mime: 'image/webp' }
    ];

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setOriginalFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const convertImage = () => {
        if (!originalFile || !preview) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const selectedFormat = formats.find(f => f.value === outputFormat);
            const qualityValue = outputFormat === 'png' ? 1 : quality / 100;

            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                const extension = outputFormat;
                const baseName = originalFile.name.replace(/\.[^/.]+$/, '');
                link.download = `${baseName}.${extension}`;
                link.click();
            }, selectedFormat.mime, qualityValue);
        };

        img.src = preview;
    };

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toUpperCase();
    };

    return (
        <ToolWrapper
            title="Image Format Converter"
            description="Convert images between PNG, JPG, and WebP formats with quality control."
            keywords="image converter, png to jpg, jpg to png, webp converter, convert image format"
        >
            <div className="max-w-4xl mx-auto space-y-8">

                {!originalFile && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <label className="group cursor-pointer">
                            <div className="bg-[#0b1120] border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-cyan-500/50 transition-all hover:bg-white/5">
                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                <p className="text-gray-300 text-lg font-medium mb-2">Upload image to convert</p>
                                <p className="text-gray-500 text-sm">PNG, JPG, WebP, and more</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {originalFile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <RefreshCw size={20} className="text-cyan-400" /> Conversion Settings
                                </h3>

                                <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Original Format</span>
                                    <span className="text-white font-bold">{getFileExtension(originalFile.name)}</span>
                                </div>

                                <div className="flex items-center gap-3 py-4">
                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                                    <RefreshCw size={16} className="text-cyan-400" />
                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Output Format</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {formats.map(format => (
                                            <button
                                                key={format.value}
                                                onClick={() => setOutputFormat(format.value)}
                                                className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${outputFormat === format.value
                                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                                    }`}
                                            >
                                                {format.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {outputFormat !== 'png' && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium text-gray-400">Quality</label>
                                            <span className="text-cyan-400 font-bold">{quality}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={quality}
                                            onChange={(e) => setQuality(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={convertImage}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                                >
                                    <Download size={20} /> Convert & Download
                                </button>
                                <button
                                    onClick={() => {
                                        setOriginalFile(null);
                                        setPreview(null);
                                    }}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="space-y-2">
                            <div className="text-sm text-gray-400">Preview</div>
                            <div className="bg-slate-900 rounded-2xl border border-white/10 p-4 flex items-center justify-center min-h-[400px]">
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-w-full max-h-96 object-contain"
                                    />
                                )}
                            </div>
                            <div className="text-xs text-center text-gray-500">
                                File: {originalFile.name} ({(originalFile.size / 1024).toFixed(2)} KB)
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolWrapper>
    );
};

export default ImageFormatConverter;
