import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Clock, Calendar, Crown, Zap, Shield } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

// Membership time progress bar component
const MembershipChart = ({ subscription }) => {
    const { startDate, endDate, totalDays, daysUsed, daysRemaining, percentUsed, isExpired } = useMemo(() => {
        if (!subscription) return {};
        const start = new Date(subscription.start_date);
        const end = new Date(subscription.end_date);
        const now = new Date();
        const totalMs = end - start;
        const usedMs = Math.min(now - start, totalMs);
        const totalDays = Math.max(1, Math.ceil(totalMs / (1000 * 60 * 60 * 24)));
        const daysUsed = Math.max(0, Math.ceil(usedMs / (1000 * 60 * 60 * 24)));
        const daysRemaining = Math.max(0, totalDays - daysUsed);
        const percentUsed = Math.min(100, Math.max(0, (usedMs / totalMs) * 100));
        const isExpired = now > end;
        return {
            startDate: start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            endDate: end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            totalDays, daysUsed, daysRemaining, percentUsed, isExpired
        };
    }, [subscription]);

    if (!subscription) return null;

    const getBarColor = () => {
        if (isExpired) return 'bg-red-500';
        if (percentUsed > 80) return 'bg-orange-500';
        if (percentUsed > 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const planTypeLabel = {
        trial: { label: 'Trial', icon: Zap, color: 'text-orange-400' },
        harian: { label: 'Daily Pass', icon: Calendar, color: 'text-blue-400' },
        member: { label: 'Member', icon: Crown, color: 'text-orange-500' },
    };

    const planInfo = planTypeLabel[subscription.plan_type] || { label: subscription.plan_name, icon: Shield, color: 'text-gray-400' };
    const PlanIcon = planInfo.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="bg-zinc-900 p-6 md:p-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <PlanIcon className={`w-5 h-5 ${planInfo.color}`} />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Paket Aktif</p>
                        <h3 className={`font-black text-lg uppercase ${planInfo.color}`}>{subscription.plan_name}</h3>
                    </div>
                </div>
                <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {isExpired ? 'Expired' : 'Aktif'}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>{startDate}</span>
                    <span>{endDate}</span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentUsed}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                        className={`h-full rounded-full ${getBarColor()} transition-colors`}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-2xl font-black text-white">{totalDays}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Total Hari</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-black text-gray-400">{daysUsed}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Terpakai</p>
                </div>
                <div className="text-center">
                    <p className={`text-2xl font-black ${isExpired ? 'text-red-400' : daysRemaining <= 3 ? 'text-orange-400' : 'text-green-400'}`}>{daysRemaining}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Sisa Hari</p>
                </div>
            </div>

            {/* Visual Day Blocks */}
            {totalDays <= 31 && (
                <div className="mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Timeline</p>
                    <div className="flex flex-wrap gap-1">
                        {Array.from({ length: totalDays }, (_, i) => {
                            const isPast = i < daysUsed;
                            const isToday = i === daysUsed - 1 || (i === 0 && daysUsed === 0);
                            return (
                                <div
                                    key={i}
                                    title={`Hari ${i + 1}`}
                                    className={`w-4 h-4 rounded-sm transition-all ${isToday
                                        ? 'bg-orange-500 ring-2 ring-orange-400 ring-offset-1 ring-offset-zinc-900'
                                        : isPast
                                            ? 'bg-zinc-600'
                                            : 'bg-zinc-800'
                                        }`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-zinc-600" />
                            <span className="text-[10px] text-gray-600">Terpakai</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-orange-500" />
                            <span className="text-[10px] text-gray-600">Hari ini</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-zinc-800" />
                            <span className="text-[10px] text-gray-600">Tersisa</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Expired warning */}
            {isExpired && (
                <div className="mt-6 pt-4 border-t border-zinc-800">
                    <p className="text-red-400 text-sm mb-3">Membership telah berakhir. Perpanjang sekarang!</p>
                    <Link
                        to="/plans"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                        Perpanjang <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Low days warning */}
            {!isExpired && daysRemaining <= 3 && daysRemaining > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-800">
                    <p className="text-orange-400 text-sm">⚠️ Sisa {daysRemaining} hari lagi! Perpanjang sebelum habis.</p>
                </div>
            )}
        </motion.div>
    );
};

const DashboardPage = () => {
    const { user } = useAuth();

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Pagi' : hour < 15 ? 'Siang' : hour < 18 ? 'Sore' : 'Malam';

    const initial = (user?.name || '?')[0].toUpperCase();
    const hasSubscription = !!user?.subscription;
    const isMember = !user?.is_guest;

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">

                {/* Hero Greeting — editorial style */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative mb-12"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div>
                            <p className="text-gray-500 text-sm tracking-widest uppercase mb-3">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9]">
                                Selamat {greeting},<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{user?.name}</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-zinc-800 flex items-center justify-center text-2xl font-black text-white">
                                {initial}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{user?.name}</p>
                                <p className="text-gray-500 text-xs">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 h-px bg-zinc-800"></div>
                </motion.section>

                {/* Membership Chart — shows if user has active subscription */}
                {hasSubscription && (
                    <div className="mb-8">
                        <MembershipChart subscription={user.subscription} />
                    </div>
                )}

                {/* Bento Grid — ref: web2 style mixed blocks */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    {/* Big CTA Card */}
                    <Link
                        to="/plans"
                        className="md:col-span-2 relative group overflow-hidden bg-zinc-900 min-h-[220px] flex flex-col justify-end p-8 hover:bg-zinc-800 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/10 rounded-full blur-[80px] group-hover:bg-orange-600/20 transition-all"></div>
                        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">Membership</p>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-3">
                            {user?.is_guest ? 'Mulai Perjalanan\nFitness Anda' : 'Kelola\nMembership'}
                        </h2>
                        <p className="text-gray-500 text-sm mb-6 max-w-md">
                            {user?.is_guest
                                ? 'Pilih paket yang sesuai dengan kebutuhan Anda. Mulai dari trial gratis 24 jam.'
                                : 'Lihat status membership, perpanjang paket, atau upgrade ke level berikutnya.'
                            }
                        </p>
                        <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider group-hover:gap-4 transition-all">
                            <span>Lihat Paket</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>

                    {/* Status Card */}
                    <div className="bg-zinc-900 p-8 flex flex-col justify-between min-h-[220px]">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Status</p>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`w-3 h-3 rounded-full ${user?.is_guest ? 'bg-zinc-600' : 'bg-green-500 animate-pulse'}`}></span>
                                <span className="font-black text-lg uppercase">{user?.is_guest ? 'Guest' : 'Member'}</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-xs">
                            {user?.is_guest
                                ? 'Belum memiliki membership aktif'
                                : 'Membership aktif — nikmati seluruh fasilitas'
                            }
                        </p>
                    </div>
                </motion.section>

                {/* Info Row */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Nama', value: user?.name },
                        { label: 'Email', value: user?.email },
                        { label: 'Tipe', value: isMember ? 'Member' : 'Non-Member' },
                        { label: 'Paket', value: user?.subscription?.plan_name || 'Belum ada' },
                    ].map((item, i) => (
                        <div key={i} className="bg-zinc-900/60 p-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-2">{item.label}</p>
                            <p className="text-white font-bold text-sm truncate">{item.value}</p>
                        </div>
                    ))}
                </motion.section>

                {/* Banner Section — editorial image style */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="relative overflow-hidden mb-8"
                >
                    <div className="relative h-[200px] md:h-[260px] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
                            alt="Gym"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-2">
                                {user?.is_guest
                                    ? <>Siap Untuk<br /><span className="text-orange-400">Transformasi?</span></>
                                    : <>Terus Berlatih,<br /><span className="text-orange-400">Jangan Berhenti.</span></>
                                }
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                {user?.is_guest
                                    ? 'Gabung sekarang dan mulai perjalananmu. Tersedia trial gratis.'
                                    : 'Konsistensi adalah kunci. Setiap repetisi membawamu selangkah lebih dekat.'
                                }
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Quick Links — minimal */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.6 }}
                    className="flex flex-col md:flex-row gap-4"
                >
                    <Link
                        to="/"
                        className="flex-1 flex items-center justify-between bg-zinc-900 p-6 group hover:bg-zinc-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Home className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-bold uppercase tracking-wider">Beranda</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link
                        to="/plans"
                        className="flex-1 flex items-center justify-between bg-zinc-900 p-6 group hover:bg-zinc-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold uppercase tracking-wider">Lihat Paket</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                </motion.section>

            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
