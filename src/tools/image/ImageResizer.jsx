import React, { useState } from 'react';
import { Upload, Download, Maximize2 } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const ImageResizer = () => {
    const [originalFile, setOriginalFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [newDimensions, setNewDimensions] = useState({ width: 0, height: 0 });
    const [maintainAspect, setMaintainAspect] = useState(true);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setOriginalFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setDimensions({ width: img.width, height: img.height });
                setNewDimensions({ width: img.width, height: img.height });
                setPreview(event.target.result);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleWidthChange = (value) => {
        const width = Number(value);
        if (maintainAspect && dimensions.width > 0) {
            const aspectRatio = dimensions.height / dimensions.width;
            setNewDimensions({ width, height: Math.round(width * aspectRatio) });
        } else {
            setNewDimensions(prev => ({ ...prev, width }));
        }
    };

    const handleHeightChange = (value) => {
        const height = Number(value);
        if (maintainAspect && dimensions.height > 0) {
            const aspectRatio = dimensions.width / dimensions.height;
            setNewDimensions({ height, width: Math.round(height * aspectRatio) });
        } else {
            setNewDimensions(prev => ({ ...prev, height }));
        }
    };

    const resizeImage = () => {
        if (!originalFile || !preview) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = newDimensions.width;
            canvas.height = newDimensions.height;

            ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `resized-${originalFile.name}`;
                link.click();
            }, originalFile.type || 'image/png');
        };

        img.src = preview;
    };

    return (
        <ToolWrapper
            title="Image Resizer"
            description="Resize images to custom dimensions while maintaining aspect ratio or setting exact sizes."
            keywords="image resizer, resize image, change image size, scale image"
        >
            <div className="max-w-4xl mx-auto space-y-8">

                {!originalFile && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <label className="group cursor-pointer">
                            <div className="bg-[#0b1120] border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-cyan-500/50 transition-all hover:bg-white/5">
                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                <p className="text-gray-300 text-lg font-medium mb-2">Upload image to resize</p>
                                <p className="text-gray-500 text-sm">Any image format supported</p>
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
                                    <Maximize2 size={20} className="text-cyan-400" /> Dimensions
                                </h3>

                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 uppercase mb-1">Original Size</div>
                                    <div className="text-white font-medium">{dimensions.width} × {dimensions.height} px</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Width (px)</label>
                                        <input
                                            type="number"
                                            value={newDimensions.width}
                                            onChange={(e) => handleWidthChange(e.target.value)}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Height (px)</label>
                                        <input
                                            type="number"
                                            value={newDimensions.height}
                                            onChange={(e) => handleHeightChange(e.target.value)}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={maintainAspect}
                                            onChange={(e) => setMaintainAspect(e.target.checked)}
                                            className="w-4 h-4 accent-cyan-500"
                                        />
                                        <span className="text-sm text-gray-300">Maintain aspect ratio</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={resizeImage}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                                >
                                    <Download size={20} /> Resize & Download
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
                                New size: {newDimensions.width} × {newDimensions.height} px
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolWrapper>
    );
};

export default ImageResizer;
