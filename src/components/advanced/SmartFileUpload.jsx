import React, { useState, useRef } from 'react';
import { Upload, X, File, Check } from 'lucide-react';

const SmartFileUpload = ({
    accept = '*',
    multiple = false,
    maxSize = 100 * 1024 * 1024, // 100MB default
    onFileSelect,
    icon: CustomIcon,
    title = 'Upload File',
    subtitle = 'Click or drag to upload',
    showPreview = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState({});
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
    };

    const handleFiles = (newFiles) => {
        const validFiles = newFiles.filter(file => {
            if (file.size > maxSize) {
                alert(`${file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB`);
                return false;
            }
            return true;
        });

        if (!multiple && validFiles.length > 0) {
            setFiles([validFiles[0]]);
            if (onFileSelect) onFileSelect(validFiles[0]);
            generatePreview(validFiles[0]);
        } else {
            setFiles(prev => [...prev, ...validFiles]);
            if (onFileSelect) onFileSelect(validFiles);
            validFiles.forEach(generatePreview);
        }
    };

    const generatePreview = (file) => {
        if (file.type.startsWith('image/') && showPreview) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [file.name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (fileName) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        setPreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[fileName];
            return newPreviews;
        });
    };

    const IconComponent = CustomIcon || Upload;

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-12
          transition-all duration-300 ease-out
          ${isDragging
                        ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                        : 'border-white/20 hover:border-cyan-500/50 hover:bg-white/5'
                    }
        `}
            >
                {/* Animated background */}
                <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-600/5
        `} />

                <div className="relative z-10 flex flex-col items-center space-y-4">
                    {/* Icon with animation */}
                    <div className={`
            p-6 rounded-2xl bg-cyan-500/10 
            transition-transform duration-300
            ${isDragging ? 'scale-110 rotate-12' : 'group-hover:scale-105'}
          `}>
                        <IconComponent className={`
              w-12 h-12 transition-colors duration-300
              ${isDragging ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'}
            `} />
                    </div>

                    {/* Text */}
                    <div className="text-center">
                        <p className="text-lg font-medium text-white mb-1">{title}</p>
                        <p className="text-sm text-gray-400">{subtitle}</p>
                        <p className="text-xs text-gray-600 mt-2">
                            Max size: {maxSize / 1024 / 1024}MB
                        </p>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="hidden"
                />
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-400">
                            Selected Files ({files.length})
                        </h4>
                        <button
                            onClick={() => {
                                setFiles([]);
                                setPreviews({});
                            }}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-3 p-3 bg-[#0b1120] rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-200"
                            >
                                {/* Preview or Icon */}
                                {previews[file.name] ? (
                                    <img
                                        src={previews[file.name]}
                                        alt={file.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                        <File className="w-6 h-6 text-cyan-400" />
                                    </div>
                                )}

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>

                                {/* Success/Remove */}
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-400" />
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartFileUpload;
