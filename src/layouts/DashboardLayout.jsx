import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, LogOut, Home } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Membership', path: '/plans', icon: CreditCard },
    ];

    const isActive = (path) => location.pathname === path;

    const initial = (user?.username || '?')[0].toUpperCase();

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Bar */}
            <header className="border-b border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <img src="/img/Logo.png" alt="logo" className="w-8 h-auto invert brightness-0 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm tracking-tight">Brawijaya Gym</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-medium transition-all ${isActive(item.path)
                                        ? 'text-white bg-zinc-900'
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-gray-500 hover:text-white transition-colors hidden md:block">
                            <Home className="w-4 h-4" />
                        </Link>
                        <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center text-xs font-bold">
                            {initial}
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div className="md:hidden flex border-t border-zinc-900">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all ${isActive(item.path) ? 'text-white border-b border-white' : 'text-gray-600'
                                }`}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
