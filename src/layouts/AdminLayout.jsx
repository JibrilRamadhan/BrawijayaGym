import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, CreditCard, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/admin', icon: Home, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Manage Users' },
        { path: '/admin/payments', icon: CreditCard, label: 'Transactions' },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className="w-64 bg-zinc-950 border-r border-zinc-900 hidden md:flex flex-col"
            >
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/img/Logo.png" alt="Logo" className="w-8 h-8 invert brightness-0" />
                        <span className="font-bold text-xl tracking-tight">Admin Panel</span>
                    </Link>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-zinc-900">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <Users className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
