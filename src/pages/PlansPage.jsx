import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Crown, Calendar, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import subscriptionService from '../services/subscriptionService';
import DashboardLayout from '../layouts/DashboardLayout';

const planIcons = { trial: Zap, harian: Calendar, member: Crown };

const PlansPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [joining, setJoining] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        days: 1,
        // Member-specific
        first_name: '',
        last_name: '',
        middle_name: '',
        jenis_kelamin: '',
    });

    const isMemberPlan = selectedPlan?.type === 'member';

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await subscriptionService.getPlans();
                setPlans(res.data);
            } catch {
                setError('Gagal memuat paket.');
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setShowForm(true);
        setError('');
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!selectedPlan) return;

        // Validate member fields
        if (isMemberPlan) {
            if (!formData.first_name.trim()) {
                setError('Nama depan wajib diisi untuk paket Member.');
                return;
            }
            if (!formData.jenis_kelamin) {
                setError('Jenis kelamin wajib dipilih untuk paket Member.');
                return;
            }
        }

        setJoining(true);
        setError('');

        try {
            const days = selectedPlan.type === 'harian' ? formData.days : null;
            const memberData = isMemberPlan ? {
                first_name: formData.first_name,
                last_name: formData.last_name,
                middle_name: formData.middle_name,
                jenis_kelamin: formData.jenis_kelamin,
            } : null;

            const res = await subscriptionService.joinPlan(
                selectedPlan.id,
                formData.name,
                formData.phone,
                days,
                memberData
            );

            if (selectedPlan.type === 'trial') {
                toast.success('Trial aktif!');
                navigate('/dashboard');
                return;
            }

            const snapToken = res.data?.snap_token;
            const paymentUuid = res.data?.payment_uuid;

            if (snapToken && window.snap) {
                window.snap.pay(snapToken, {
                    onSuccess: () => { toast.success('Pembayaran berhasil!'); navigate(`/payment-status/${paymentUuid}`); },
                    onPending: () => { toast.info('Menunggu pembayaran...'); navigate(`/payment-status/${paymentUuid}`); },
                    onError: () => navigate(`/payment-status/${paymentUuid}`),
                    onClose: () => { setJoining(false); setError('Dibatalkan.'); },
                });
            } else if (res.data?.redirect_url) {
                window.location.href = res.data.redirect_url;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
            toast.error('Gagal join paket.');
            setJoining(false);
        }
    };

    const formatPrice = (price) => {
        if (price === 0) return 'Gratis';
        return `Rp ${Number(price).toLocaleString('id-ID')}`;
    };

    const getDurationLabel = (plan) => {
        if (plan.type === 'trial') return '24 Jam';
        if (plan.duration_unit === 'days') return `${plan.duration_value} Hari`;
        if (plan.duration_unit === 'months') return `${plan.duration_value} Bulan`;
        if (plan.duration_unit === 'years') return `${plan.duration_value} Tahun`;
        return `${plan.duration_value} ${plan.duration_unit}`;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.2em] mb-3">Membership Plans</p>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.9]">
                        Pilih Paket<br />
                        <span className="text-gray-500">Yang Cocok</span>
                    </h1>
                </motion.div>

                {error && !showForm && (
                    <div className="bg-red-900/20 border-l-2 border-red-500 text-red-400 px-4 py-3 mb-8 text-sm">
                        {error}
                    </div>
                )}

                {!showForm ? (
                    <>
                        {/* Plans List — editorial style, not grid cards */}
                        <div className="space-y-2">
                            {plans.map((plan, i) => {
                                const IconComp = planIcons[plan.type] || Shield;
                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08 }}
                                        onClick={() => handlePlanSelect(plan)}
                                        className="group flex items-center justify-between p-6 bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-all border-l-0 hover:border-l-2 hover:border-orange-500"
                                    >
                                        <div className="flex items-center gap-6">
                                            <IconComp className="w-6 h-6 text-gray-500 group-hover:text-orange-500 transition-colors" />
                                            <div>
                                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                                <p className="text-gray-600 text-sm">{getDurationLabel(plan)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-xl font-black">
                                                {formatPrice(plan.price)}
                                                {plan.type === 'harian' && <span className="text-xs font-normal text-gray-600">/hari</span>}
                                            </span>
                                            <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    /* Join Form */
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg"
                    >
                        <button
                            onClick={() => { setShowForm(false); setError(''); }}
                            className="flex items-center text-gray-500 hover:text-white mb-8 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                        </button>

                        {/* Plan Summary */}
                        <div className="mb-8 pb-8 border-b border-zinc-800">
                            <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">Paket dipilih</p>
                            <h2 className="text-3xl font-black uppercase">{selectedPlan?.name}</h2>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-2xl font-black text-orange-500">
                                    {selectedPlan?.type === 'harian'
                                        ? formatPrice(selectedPlan.price * formData.days)
                                        : formatPrice(selectedPlan?.price)
                                    }
                                </span>
                                <span className="text-gray-600 text-sm">{getDurationLabel(selectedPlan)}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-900/20 border-l-2 border-red-500 text-red-400 px-4 py-3 mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleJoin} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Lengkap</label>
                                <input type="text" required className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none placeholder-gray-700 text-lg" placeholder="Nama lengkap Anda" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">No. Telepon</label>
                                <input type="tel" required className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none placeholder-gray-700 text-lg" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>

                            {/* Member-specific fields */}
                            {isMemberPlan && (
                                <>
                                    <div className="border-t border-zinc-800 pt-6 mt-6">
                                        <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4">Data Member</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Depan *</label>
                                            <input type="text" required className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none placeholder-gray-700 text-lg" placeholder="John" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Belakang</label>
                                            <input type="text" className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none placeholder-gray-700 text-lg" placeholder="Doe" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Tengah <span className="text-gray-700">(opsional)</span></label>
                                        <input type="text" className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none placeholder-gray-700 text-lg" value={formData.middle_name} onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Jenis Kelamin *</label>
                                        <select required className="w-full bg-black border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none text-lg appearance-none" value={formData.jenis_kelamin} onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}>
                                            <option value="" disabled>Pilih...</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {selectedPlan?.type === 'harian' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Jumlah Hari</label>
                                    <input type="number" min="1" required className="w-full bg-transparent border-b border-zinc-700 py-3 text-white focus:border-orange-500 outline-none text-lg" value={formData.days} onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })} />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={joining}
                                className="w-full mt-4 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : selectedPlan?.price === 0 ? 'Aktifkan' : 'Bayar'}
                            </button>
                        </form>
                    </motion.div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default PlansPage;
