import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Upload, Download, Music, Video, Loader } from 'lucide-react';
import ToolWrapper from '../../components/common/ToolWrapper';

const VideoToMp3 = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const ffmpegRef = useRef(new FFmpeg());

    const loadFFmpeg = async () => {
        const ffmpeg = ffmpegRef.current;
        if (ffmpeg.loaded) return;

        setIsLoading(true);
        try {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            ffmpeg.on('progress', ({ progress: p }) => {
                setProgress(Math.round(p * 100));
            });
        } catch (error) {
            console.error('Failed to load FFmpeg:', error);
            alert('Failed to load video processing engine. Please refresh and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setDownloadUrl(null);
        await loadFFmpeg();
    };

    const convertToMp3 = async () => {
        if (!file) return;

        setIsConverting(true);
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;

            // Write input file
            await ffmpeg.writeFile('input', await fetchFile(file));

            // Convert to MP3
            await ffmpeg.exec(['-i', 'input', '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', 'output.mp3']);

            // Read output
            const data = await ffmpeg.readFile('output.mp3');
            const blob = new Blob([data.buffer], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);

            setDownloadUrl(url);
            setProgress(100);
        } catch (error) {
            console.error('Conversion failed:', error);
            alert('Conversion failed. Please ensure the file is a valid video.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadMp3 = () => {
        if (!downloadUrl) return;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${file.name.replace(/\.[^/.]+$/, '')}.mp3`;
        link.click();
    };

    return (
        <ToolWrapper
            title="Video to MP3 Converter"
            description="Extract audio from video files and save as MP3. All processing happens in your browser."
            keywords="video to mp3, extract audio, video converter, mp3 converter"
        >
            <div className="max-w-4xl mx-auto space-y-8">

                {!file && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <label className="group cursor-pointer w-full">
                            <div className="bg-[#0b1120] border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-cyan-500/50 transition-all hover:bg-white/5">
                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                <p className="text-gray-300 text-lg font-medium mb-2">Upload Video File</p>
                                <p className="text-gray-500 text-sm">MP4, AVI, MOV, MKV, WebM, etc.</p>
                            </div>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-gray-300">Loading video processing engine...</p>
                        <p className="text-gray-500 text-sm mt-2">This may take a moment on first use (~30MB)</p>
                    </div>
                )}

                {file && !isLoading && (
                    <div className="space-y-6">
                        <div className="bg-[#0b1120] rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Video className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <div className="text-white font-medium">{file.name}</div>
                                        <div className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setDownloadUrl(null);
                                        setProgress(0);
                                    }}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Change File
                                </button>
                            </div>

                            {isConverting && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Converting to MP3...</span>
                                        <span className="text-cyan-400 font-bold">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {downloadUrl && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                                    <Music className="w-5 h-5 text-green-400" />
                                    <div className="flex-1">
                                        <div className="text-green-400 font-medium">Conversion Complete!</div>
                                        <div className="text-gray-400 text-sm">Your MP3 is ready to download</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!downloadUrl && !isConverting && (
                            <button
                                onClick={convertToMp3}
                                disabled={isConverting}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Music size={20} />
                                Convert to MP3
                            </button>
                        )}

                        {downloadUrl && (
                            <div className="flex gap-4">
                                <button
                                    onClick={downloadMp3}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                                >
                                    <Download size={20} />
                                    Download MP3
                                </button>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setDownloadUrl(null);
                                        setProgress(0);
                                    }}
                                    className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                                >
                                    Convert Another
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">
                        ⚠️ <strong>Note:</strong> Video processing happens entirely in your browser. Large files may take time and consume significant memory.
                    </p>
                </div>
            </div>
        </ToolWrapper>
    );
};

export default VideoToMp3;
