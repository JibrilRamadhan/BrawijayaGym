import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const toast = useToast();
    const [loginValue, setLoginValue] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await login(loginValue, password);
            toast.success(`Selamat datang kembali, ${res.user?.name || 'Member'}! 🎉`);
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-orange-900/40 mix-blend-multiply z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1540497077202-7c8a33801524?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Gym Motivation"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 flex flex-col justify-between h-full p-16 text-white">
                    <div>
                        <Link to="/" className="flex items-center space-x-3 group w-fit">
                            <motion.div
                                whileHover={{ rotate: -10 }}
                                className="bg-white/10 backdrop-blur-md p-2 rounded-lg"
                            >
                                <img src="/img/Logo.png" alt="logo" className='w-10 h-auto invert brightness-0' />
                            </motion.div>
                            <span className="font-bold text-xl tracking-tight">Brawijaya Gym</span>
                        </Link>
                    </div>
                    <div className="space-y-6">
                        <blockquote className="text-3xl font-bold leading-tight">
                            "Discipline is the bridge between goals and accomplishment."
                        </blockquote>
                        <p className="text-orange-200 text-lg">Jim Rohn</p>
                    </div>
                    <div className="flex space-x-2">
                        <div className="w-12 h-1 bg-white rounded-full"></div>
                        <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                        <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-black">
                <Link to="/" className="absolute top-8 left-8 lg:hidden text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">
                            Welcome Back
                        </h2>
                        <p className="mt-3 text-lg text-gray-400">
                            Masuk untuk mengakses jadwal dan membership Anda.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="login-field" className="block text-sm font-bold uppercase tracking-wide text-gray-400 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        id="login-field"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 border-2 border-zinc-800 rounded-none leading-5 bg-zinc-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-0 sm:text-sm transition-all text-white font-medium hover:border-zinc-700"
                                        placeholder="email@example.com"
                                        value={loginValue}
                                        onChange={(e) => setLoginValue(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-bold uppercase tracking-wide text-gray-400">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full pl-11 pr-12 py-3.5 border-2 border-zinc-800 rounded-none leading-5 bg-zinc-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-0 sm:text-sm transition-all text-white font-medium hover:border-zinc-700"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" /> : <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-zinc-700 rounded-none cursor-pointer bg-zinc-900"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors">
                                Ingat saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-black uppercase tracking-widest text-black bg-white hover:bg-gray-200 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-none rounded-none"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-bold text-white border-b-2 border-white hover:text-gray-300 hover:border-gray-300 pb-0.5 transition-all uppercase tracking-wide">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
