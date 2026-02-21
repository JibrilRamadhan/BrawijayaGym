import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
};

const colors = {
    success: {
        bg: 'bg-green-500/10 border-green-500/30',
        icon: 'text-green-500',
        bar: 'bg-green-500',
    },
    error: {
        bg: 'bg-red-500/10 border-red-500/30',
        icon: 'text-red-500',
        bar: 'bg-red-500',
    },
    info: {
        bg: 'bg-blue-500/10 border-blue-500/30',
        icon: 'text-blue-500',
        bar: 'bg-blue-500',
    },
};

const Toast = ({ toast, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const Icon = icons[toast.type] || Info;
    const color = colors[toast.type] || colors.info;

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`pointer-events-auto min-w-[320px] max-w-[420px] backdrop-blur-xl ${color.bg} border rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            <div className="flex items-start gap-3 p-4">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${color.icon}`} />
                <p className="text-white text-sm font-medium flex-1">{toast.message}</p>
                <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-white transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Progress bar */}
            <div className="h-0.5 w-full bg-white/5">
                <div
                    className={`h-full ${color.bar} animate-shrink`}
                    style={{ animation: 'shrink 4s linear forwards' }}
                />
            </div>
        </div>
    );
};

export default Toast;
