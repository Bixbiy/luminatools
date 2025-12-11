import React, { useState } from 'react';

const NeonButton = ({
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger'
    size = 'md', // 'sm' | 'md' | 'lg'
    icon: Icon,
    className = ''
}) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = (e) => {
        if (disabled || loading) return;

        // Create ripple effect
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick(e);
    };

    const variants = {
        primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]',
        secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]',
        danger: 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled || loading}
            className={`
        relative overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-bold text-white
        transition-all duration-300 ease-out
        transform active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        flex items-center justify-center gap-2
        ${className}
      `}
        >
            {/* Ripple effects */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}

            {/* Loading spinner */}
            {loading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}

            {/* Icon */}
            {Icon && !loading && <Icon className="w-5 h-5" />}

            {/* Content */}
            <span className="relative z-10">{children}</span>

            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </button>
    );
};

export default NeonButton;
