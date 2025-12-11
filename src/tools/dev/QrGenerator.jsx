import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Sparkles, Palette, Maximize2 } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';
import NeonButton from '../../components/advanced/NeonButton';

const QrGenerator = () => {
    const [text, setText] = useState('');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorLevel, setErrorLevel] = useState('M');
    const qrRef = useRef(null);

    const downloadQR = (format = 'png') => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.href = pngFile;
            downloadLink.download = `qrcode.${format}`;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const errorLevels = [
        { value: 'L', label: 'Low', desc: '~7% correction' },
        { value: 'M', label: 'Medium', desc: '~15% correction' },
        { value: 'Q', label: 'High', desc: '~25% correction' },
        { value: 'H', label: 'Max', desc: '~30% correction' }
    ];

    return (
        <ToolWrapper
            title="QR Code Generator"
            description="Create customizable QR codes with colors and error correction levels"
            keywords="qr code generator, qr code maker, create qr code, custom qr code"
        >
            <div className="max-w-6xl mx-auto space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Controls */}
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Content</h3>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 text-gray-300 focus:border-cyan-500/50 focus:outline-none resize-none h-32 transition-all"
                                placeholder="Enter URL, text, or data to encode..."
                            />
                        </div>

                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Palette className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-semibold text-white">Customization</h3>
                            </div>

                            {/* Size */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-400">Size</label>
                                    <span className="text-xl font-bold text-cyan-400">{size}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="128"
                                    max="512"
                                    step="64"
                                    value={size}
                                    onChange={(e) => setSize(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>

                            {/* Colors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Foreground</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="flex-1 bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Background</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="flex-1 bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error Correction */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-400">Error Correction Level</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {errorLevels.map(level => (
                                        <button
                                            key={level.value}
                                            onClick={() => setErrorLevel(level.value)}
                                            className={`p-3 rounded-lg text-xs font-bold transition-all ${errorLevel === level.value
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            <div>{level.label}</div>
                                            <div className="text-[10px] font-normal mt-1 opacity-70">{level.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-8">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="text-cyan-400" />
                                Preview
                            </h3>

                            {text ? (
                                <div
                                    ref={qrRef}
                                    className="flex items-center justify-center p-8 rounded-xl animate-bounce-in"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    <QRCodeSVG
                                        value={text}
                                        size={size}
                                        fgColor={fgColor}
                                        bgColor={bgColor}
                                        level={errorLevel}
                                        includeMargin={true}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-96 border-2 border-dashed border-white/20 rounded-xl">
                                    <div className="text-center text-gray-600">
                                        <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>Enter text to generate QR code</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {text && (
                            <NeonButton
                                onClick={() => downloadQR('png')}
                                icon={Download}
                                className="w-full"
                            >
                                Download QR Code
                            </NeonButton>
                        )}
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-white font-semibold mb-2">QR Code Tips</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                                <li>• Higher error correction allows QR codes to work even if partially damaged</li>
                                <li>• Ensure sufficient contrast between foreground and background colors</li>
                                <li>• Test your QR code with multiple scanners before printing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default QrGenerator;
