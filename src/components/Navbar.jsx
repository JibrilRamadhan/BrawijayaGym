import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Beranda', path: '/' },
        { name: 'Membership', path: '/register' },
        { name: 'Kelas', path: '/classes' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="absolute w-full z-50 top-0 bg-transparent py-5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <img src="/img/Logo.png" alt="" className='w-12 h-auto transition-transform group-hover:scale-110 brightness-0 invert' />
                        <span className="text-display text-xl tracking-tight text-white">
                            Brawijaya Gym
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-all relative hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.8)] ${isActive(link.path) ? 'text-white' : 'text-gray-300'
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.span
                                        layoutId="underline"
                                        className="absolute left-0 top-full block h-0.5 w-full bg-white mt-1"
                                    />
                                )}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-black bg-white hover:bg-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-zinc-600 text-sm font-medium rounded-full text-gray-300 hover:text-white hover:border-white transition-all"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-black bg-white hover:bg-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md"
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Member Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-orange-600 text-sm font-bold rounded-full text-white bg-orange-600 hover:bg-orange-700 hover:border-orange-700 transition-all shadow-md"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-300 hover:text-white focus:outline-none p-2"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10 shadow-xl overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(link.path)
                                        ? 'text-white bg-white/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <div className="pt-2">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-lg"
                                        >
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                            className="w-full flex items-center justify-center px-4 py-3 border border-zinc-700 text-base font-medium rounded-xl text-gray-300 hover:text-white hover:border-white transition-all"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="pt-2">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-lg"
                                        >
                                            <LogIn className="w-4 h-4 mr-2" />
                                            Member Login
                                        </Link>
                                    </div>
                                    <div className="pt-2">
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
