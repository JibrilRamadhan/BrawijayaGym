import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft, RefreshCw, ArrowRight, Volume2 } from 'lucide-react';
import paymentService from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

const statusMap = {
    settlement: { icon: CheckCircle, label: 'Berhasil', color: 'text-green-500', accent: 'border-green-500' },
    capture: { icon: CheckCircle, label: 'Berhasil', color: 'text-green-500', accent: 'border-green-500' },
    pending: { icon: Clock, label: 'Menunggu', color: 'text-yellow-500', accent: 'border-yellow-500' },
    deny: { icon: XCircle, label: 'Ditolak', color: 'text-red-500', accent: 'border-red-500' },
    cancel: { icon: XCircle, label: 'Dibatalkan', color: 'text-red-500', accent: 'border-red-500' },
    expire: { icon: XCircle, label: 'Kadaluarsa', color: 'text-gray-500', accent: 'border-gray-500' },
    expired: { icon: XCircle, label: 'Kadaluarsa', color: 'text-gray-500', accent: 'border-gray-500' },
    failed: { icon: XCircle, label: 'Gagal', color: 'text-red-500', accent: 'border-red-500' },
    failure: { icon: XCircle, label: 'Gagal', color: 'text-red-500', accent: 'border-red-500' },
};

// Generate success sound using Web Audio API
const playSuccessSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.5);
        });
    } catch (e) { /* Audio not supported */ }
};

// Generate fail sound
const playFailSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [400, 350]; // descending
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.25);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.25 + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.25);
            osc.stop(ctx.currentTime + i * 0.25 + 0.5);
        });
    } catch (e) { /* Audio not supported */ }
};

const PaymentStatusPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const { loadUser, user } = useAuth();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [polling, setPolling] = useState(false);
    const prevStatusRef = useRef(null);
    const soundPlayedRef = useRef(false);

    const fetchStatus = async () => {
        try {
            const res = await paymentService.checkStatus(uuid);
            setPayment(res);

            const newStatus = res?.status;
            const wasStillPending = prevStatusRef.current === 'pending' || prevStatusRef.current === null;

            // Play sound when status transitions
            if (!soundPlayedRef.current && wasStillPending) {
                if (newStatus === 'settlement' || newStatus === 'capture') {
                    playSuccessSound();
                    soundPlayedRef.current = true;
                    // CRITICAL: Refresh user context to update is_guest and subscription data
                    await loadUser();
                } else if (['failed', 'failure', 'deny', 'cancel', 'expire', 'expired'].includes(newStatus)) {
                    playFailSound();
                    soundPlayedRef.current = true;
                }
            }

            prevStatusRef.current = newStatus;
            setPolling(newStatus === 'pending');
        } catch {
            setError('Gagal memuat status.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStatus(); }, [uuid]);
    useEffect(() => {
        if (!polling) return;
        const id = setInterval(fetchStatus, 3000);
        return () => clearInterval(id);
    }, [polling]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="max-w-lg mx-auto py-20">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Link to={user?.is_guest ? "/" : "/dashboard"} className="text-gray-500 hover:text-white text-sm flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> {user?.is_guest ? "Beranda" : "Dashboard"}
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const status = payment?.status || 'pending';
    const receipt = payment?.receipt || {};
    const config = statusMap[status] || statusMap.pending;
    const StatusIcon = config.icon;
    const isSuccess = status === 'settlement' || status === 'capture';
    const isFailed = ['failed', 'failure', 'deny', 'cancel', 'expire', 'expired'].includes(status);
    const isMember = receipt?.plan_type === 'member';

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const rows = [
        ['Order ID', receipt?.order_id],
        ['Paket', receipt?.plan_name],
        ['Tipe', isMember ? 'Member Resmi' : 'Daily Pass (Guest)'],
        ['Jumlah', receipt?.amount ? `Rp ${Number(receipt.amount).toLocaleString('id-ID')}` : null],
        ['Metode', receipt?.method],
        ['Dibayar', receipt?.paid_at ? formatDate(receipt.paid_at) : null],
    ].filter(([, v]) => v);

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <Link to={!isMember ? "/" : "/dashboard"} className="text-gray-600 hover:text-white text-sm flex items-center gap-2 mb-10">
                    <ArrowLeft className="w-4 h-4" /> {!isMember ? "Beranda" : "Dashboard"}
                </Link>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Status */}
                    <div className={`border-l-2 ${config.accent} pl-6 mb-10`}>
                        <div className="flex items-center gap-3 mb-2">
                            <StatusIcon className={`w-6 h-6 ${config.color}`} />
                            <h1 className="text-3xl font-black uppercase tracking-tight">{config.label}</h1>
                            {isSuccess && (
                                <Volume2 className="w-4 h-4 text-green-600 animate-pulse" />
                            )}
                        </div>
                        {polling && (
                            <p className="text-yellow-600 text-sm flex items-center gap-2">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Memeriksa status pembayaran...
                            </p>
                        )}
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-0 mb-10">
                        <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">Detail Transaksi</p>
                        {rows.map(([label, value], i) => (
                            <div key={i} className="flex justify-between py-4 border-b border-zinc-900">
                                <span className="text-gray-500 text-sm">{label}</span>
                                <span className="text-white font-bold text-sm">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Subscription Info — shown only on success */}
                    {isSuccess && receipt?.subscription && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900 border border-zinc-800 p-6 mb-10"
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 mb-4">Subscription Aktif</p>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Mulai</span>
                                    <span className="text-white font-bold text-sm">{formatDate(receipt.subscription.start_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Berlaku Hingga</span>
                                    <span className="text-white font-bold text-sm">{formatDate(receipt.subscription.end_date)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className="text-green-400 font-bold text-sm uppercase">{receipt.subscription.status}</span>
                                </div>
                            </div>
                            {receipt?.email && isMember && (
                                <div className="mt-4 pt-4 border-t border-zinc-800">
                                    <p className="text-xs text-gray-500">Login dengan: <span className="text-white font-bold">{receipt.email}</span></p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Failed / Expired message */}
                    {isFailed && (
                        <div className="bg-red-900/10 border border-red-500/20 p-6 mb-10">
                            <p className="text-red-400 text-sm mb-3">
                                {status === 'expire' || status === 'expired'
                                    ? 'Pembayaran telah melewati batas waktu. Silakan daftar ulang untuk mendapatkan link pembayaran baru.'
                                    : 'Pembayaran gagal atau dibatalkan. Silakan coba daftar ulang.'}
                            </p>
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sm font-bold uppercase tracking-wider text-red-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                Daftar Ulang <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {!isSuccess && (
                            <button
                                onClick={fetchStatus}
                                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold uppercase tracking-wider transition-colors"
                            >
                                Cek Ulang
                            </button>
                        )}
                        <Link
                            to={!isMember ? "/" : "/dashboard"}
                            className="px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                        >
                            {!isMember ? 'Kembali ke Beranda' : (isSuccess ? 'Ke Dashboard Member' : 'Dashboard')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default PaymentStatusPage;
