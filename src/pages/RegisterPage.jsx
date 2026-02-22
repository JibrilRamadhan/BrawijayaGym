import React, { useState, useEffect } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle, Calendar, Shield, Zap, Crown, Phone, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import subscriptionService from '../services/subscriptionService';

// Success sound via Web Audio API
const playSuccessSound = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50];
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

const planIcons = { trial: Zap, harian: Calendar, member: Crown };
const planColors = { trial: 'from-orange-500 to-orange-300', harian: 'from-blue-500 to-cyan-400', member: 'from-orange-600 to-red-600' };

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, loadUser } = useAuth();

    // Steps: 1=Plan, 2=Form, 3=Confirmation, 4=Success
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Plans from API
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(true);

    // Form State — no username/password for trial/harian
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        emailConfirm: '',
        phone: '',
        days: 1,
        // Member-specific fields
        first_name: '',
        last_name: '',
        middle_name: '',
        jenis_kelamin: '',
    });

    // Success Data
    const [successData, setSuccessData] = useState(null);

    // Fetch Plans from API
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await subscriptionService.getPlans();
                setPlans(res.data);
            } catch {
                setError('Gagal memuat paket. Pastikan server backend berjalan.');
            } finally {
                setPlansLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setStep(2);
        setError('');
    };

    const isMemberPlan = selectedPlan?.type === 'member';

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (formData.email !== formData.emailConfirm) {
            setError("Email tidak sama! Silakan ketik ulang.");
            return;
        }
        if (isMemberPlan && !formData.jenis_kelamin) {
            setError("Jenis kelamin wajib dipilih untuk paket Member.");
            return;
        }
        if (isMemberPlan && !formData.first_name.trim()) {
            setError("Nama depan wajib diisi untuk paket Member.");
            return;
        }
        setError('');
        setStep(3);
    };

    const processRegistration = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Step 1: Register user (no password for trial/harian, auto-generated for member)
            await register({
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                plan_type: selectedPlan.type,
            });

            // Step 2: Join plan
            const days = selectedPlan.type === 'harian' ? formData.days : null;
            const memberData = isMemberPlan ? {
                first_name: formData.first_name,
                last_name: formData.last_name,
                middle_name: formData.middle_name,
                jenis_kelamin: formData.jenis_kelamin,
            } : null;

            const joinRes = await subscriptionService.joinPlan(
                selectedPlan.id,
                formData.name,
                formData.phone,
                days,
                memberData
            );

            if (selectedPlan.type === 'trial' || selectedPlan.price === 0) {
                // Trial — instant success
                await loadUser();
                playSuccessSound();
                setSuccessData({
                    subscriptionUuid: joinRes.data?.subscription_uuid,
                    planName: joinRes.data?.plan_name || selectedPlan.name,
                    planType: joinRes.data?.type || selectedPlan.type,
                    startDate: joinRes.data?.start_date ? new Date(joinRes.data.start_date).toLocaleDateString('id-ID') : '-',
                    endDate: joinRes.data?.end_date ? new Date(joinRes.data.end_date).toLocaleDateString('id-ID') : '-',
                    userName: formData.name,
                });
                setIsLoading(false);
                setStep(4);
                return;
            }

            // Paid plan — use Midtrans Snap
            const snapToken = joinRes.data?.snap_token;
            const paymentUuid = joinRes.data?.payment_uuid;

            if (snapToken && window.snap) {
                window.snap.pay(snapToken, {
                    onSuccess: () => navigate(`/payment-status/${paymentUuid}`),
                    onPending: () => navigate(`/payment-status/${paymentUuid}`),
                    onError: () => navigate(`/payment-status/${paymentUuid}`),
                    onClose: () => {
                        setIsLoading(false);
                        setError('Pembayaran dibatalkan.');
                        setStep(3);
                    },
                });
            } else if (joinRes.data?.redirect_url) {
                window.location.href = joinRes.data.redirect_url;
            } else {
                setIsLoading(false);
                setError('Midtrans tidak tersedia. Coba lagi.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.';
            setError(msg);
            setIsLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (price === 0 || price === '0') return 'GRATIS';
        return `Rp ${Number(price).toLocaleString('id-ID')}`;
    };

    const getDurationLabel = (plan) => {
        if (!plan) return '';
        if (plan.type === 'trial') return '24 Jam';
        if (plan.duration_unit === 'days') return `${plan.duration_value} Hari`;
        if (plan.duration_unit === 'months') return `${plan.duration_value} Bulan`;
        if (plan.duration_unit === 'years') return `${plan.duration_value} Tahun`;
        return `${plan.duration_value} ${plan.duration_unit}`;
    };

    const getTotalPrice = () => {
        if (!selectedPlan) return 0;
        if (selectedPlan.type === 'harian') return selectedPlan.price * formData.days;
        return selectedPlan.price;
    };

    return (
        <div className="min-h-screen flex bg-black font-sans text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">

                {/* Header Steps */}
                <div className="w-full max-w-3xl mb-12">
                    <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
                        <img src="/img/Logo.png" alt="" className='w-10 h-auto invert brightness-0' />
                        <span className="font-bold text-xl tracking-tight">Brawijaya Gym</span>
                    </Link>

                    {/* Progress Bar */}
                    {step < 4 && (
                        <div className="flex justify-between items-center relative">
                            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-800 -z-10"></div>
                            {[1, 2, 3].map((s) => (
                                <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? 'bg-orange-600 border-orange-600 text-white' : 'bg-black border-gray-600 text-gray-600'}`}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-4xl"
                >
                    {/* STEP 1: PLAN SELECTION */}
                    {step === 1 && (
                        <div className="text-center">
                            <h2 className="text-4xl font-black mb-2 uppercase italic">Pilih Membership</h2>
                            <p className="text-gray-400 mb-10">Sesuaikan dengan kebutuhan latihanmu</p>

                            {plansLoading ? (
                                <div className="flex justify-center py-16">
                                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 mb-8">
                                    {error}
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                                    {plans.map((plan) => {
                                        const IconComp = planIcons[plan.type] || Shield;
                                        const gradient = planColors[plan.type] || 'from-gray-600 to-gray-500';
                                        return (
                                            <div
                                                key={plan.id}
                                                onClick={() => handlePlanSelect(plan)}
                                                className="group relative bg-zinc-900 border border-zinc-800 p-6 cursor-pointer hover:border-orange-500 transition-all hover:-translate-y-2 overflow-hidden"
                                            >
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>
                                                <IconComp className="w-10 h-10 text-white mb-5 group-hover:scale-110 transition-transform" />
                                                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                                                <p className="text-xs text-gray-500 mb-4">{getDurationLabel(plan)}</p>
                                                <div className="text-2xl font-black mb-6">
                                                    {formatPrice(plan.price)}
                                                    {plan.type === 'harian' && <span className="text-xs font-normal text-gray-500 block mt-1">/hari</span>}
                                                </div>
                                                <button className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors">
                                                    Pilih Paket
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <p className="mt-8 text-gray-500">
                                Sudah punya akun? <Link to="/login" className="text-white underline">Login disini</Link>
                            </p>
                        </div>
                    )}

                    {/* STEP 2: USER FORM — No username/password for trial & harian */}
                    {step === 2 && (
                        <div className="max-w-md mx-auto bg-zinc-900 p-8 border border-zinc-800">
                            <button onClick={() => { setStep(1); setError(''); }} className="flex items-center text-gray-400 hover:text-white mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                            </button>
                            <h2 className="text-2xl font-bold mb-6 uppercase">Data Diri</h2>

                            {isMemberPlan && (
                                <div className="bg-orange-500/10 border border-orange-500/30 text-orange-300 p-3 mb-6 text-sm">
                                    <Crown className="w-4 h-4 inline mr-2" />
                                    Paket <strong>Member</strong> memerlukan data tambahan.
                                </div>
                            )}

                            {/* Info: Password dikirim via email untuk member */}
                            {isMemberPlan && (
                                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-3 mb-6 text-sm">
                                    <Info className="w-4 h-4 inline mr-2" />
                                    Password akan <strong>di-generate otomatis</strong> dan dikirim ke email Anda.
                                </div>
                            )}

                            {/* Info: Trial/Harian tanpa password */}
                            {!isMemberPlan && (
                                <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 mb-6 text-sm">
                                    <Info className="w-4 h-4 inline mr-2" />
                                    Paket <strong>{selectedPlan?.type === 'trial' ? 'Trial' : 'Harian'}</strong> tidak memerlukan password.
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                {/* Nama Lengkap — always required */}
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Nama Lengkap</label>
                                    <input name="name" type="text" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                                </div>
                                {/* Email — always required */}
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Email</label>
                                    <input name="email" type="email" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="email@example.com" value={formData.email} onChange={handleChange} />
                                </div>
                                {/* Konfirmasi Email — always required */}
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Konfirmasi Email</label>
                                    <input name="emailConfirm" type="email" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="Ketik ulang email" value={formData.emailConfirm} onChange={handleChange} />
                                    {formData.emailConfirm && formData.email !== formData.emailConfirm && (
                                        <p className="text-red-400 text-xs mt-1">Email tidak cocok</p>
                                    )}
                                </div>
                                {/* No. Telepon — always required */}
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-400 mb-2">No. Telepon</label>
                                    <input name="phone" type="tel" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="08xxxxxxxxxx" value={formData.phone} onChange={handleChange} />
                                </div>

                                {/* Member-specific fields */}
                                {isMemberPlan && (
                                    <>
                                        <div className="border-t border-zinc-700 pt-5 mt-5">
                                            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4">Data Member</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Nama Depan *</label>
                                                <input name="first_name" type="text" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="John" value={formData.first_name} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Nama Belakang</label>
                                                <input name="last_name" type="text" className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="Doe" value={formData.last_name} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Nama Tengah <span className="text-gray-600">(opsional)</span></label>
                                            <input name="middle_name" type="text" className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" placeholder="" value={formData.middle_name} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Jenis Kelamin *</label>
                                            <select name="jenis_kelamin" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none appearance-none" value={formData.jenis_kelamin} onChange={handleChange}>
                                                <option value="" disabled>Pilih...</option>
                                                <option value="L">Laki-laki</option>
                                                <option value="P">Perempuan</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Jumlah Hari — only for harian */}
                                {selectedPlan?.type === 'harian' && (
                                    <div>
                                        <label className="block text-sm font-bold uppercase text-gray-400 mb-2">Jumlah Hari</label>
                                        <input name="days" type="number" min="1" required className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-orange-500 outline-none" value={formData.days} onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })} />
                                    </div>
                                )}

                                {/* NO password fields — removed for all plan types */}

                                <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-500 font-bold uppercase tracking-widest transition-all mt-4">
                                    Lanjut ke Konfirmasi
                                </button>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: CONFIRMATION & PAYMENT */}
                    {step === 3 && (
                        <div className="max-w-md mx-auto bg-zinc-900 p-8 border border-zinc-800 text-center">
                            <button onClick={() => { setStep(2); setError(''); }} className="flex items-center text-gray-400 hover:text-white mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                            </button>
                            <h2 className="text-2xl font-bold mb-6 uppercase">Konfirmasi</h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="bg-black p-6 mb-8 border border-zinc-700 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Paket</span>
                                    <span className="font-bold text-orange-400">{selectedPlan?.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Durasi</span>
                                    <span>{getDurationLabel(selectedPlan)}{selectedPlan?.type === 'harian' ? ` (${formData.days} hari)` : ''}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Nama</span>
                                    <span>{formData.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Email</span>
                                    <span className="text-sm">{formData.email}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Telepon</span>
                                    <span>{formData.phone}</span>
                                </div>

                                {/* Member-specific summary */}
                                {isMemberPlan && (
                                    <>
                                        <div className="border-t border-zinc-700 mt-3 pt-3">
                                            <p className="text-xs font-bold uppercase text-orange-400 mb-2">Data Member</p>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-400">Nama Depan</span>
                                            <span>{formData.first_name}</span>
                                        </div>
                                        {formData.last_name && (
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Nama Belakang</span>
                                                <span>{formData.last_name}</span>
                                            </div>
                                        )}
                                        {formData.middle_name && (
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-400">Nama Tengah</span>
                                                <span>{formData.middle_name}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-400">Jenis Kelamin</span>
                                            <span>{formData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                        </div>
                                    </>
                                )}

                                {/* Password info */}
                                {isMemberPlan && (
                                    <div className="border-t border-zinc-700 mt-3 pt-3">
                                        <div className="flex items-start gap-2 text-blue-400 text-sm">
                                            <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>Password akan dikirim ke email <strong>{formData.email}</strong></span>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-lg">Total</span>
                                    <span className="text-2xl font-bold">
                                        {formatPrice(getTotalPrice())}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={processRegistration}
                                disabled={isLoading}
                                className={`w-full py-4 font-bold uppercase tracking-widest transition-all flex justify-center items-center ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : (getTotalPrice() === 0 ? "Daftar & Aktifkan" : "Daftar & Bayar")}
                            </button>
                            <p className="mt-4 text-xs text-gray-500">
                                {getTotalPrice() === 0 ? "Akun Anda akan langsung aktif." : "Anda akan diarahkan ke halaman pembayaran aman Midtrans."}
                            </p>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS RECEIPT */}
                    {step === 4 && successData && (
                        <div className="max-w-md mx-auto">
                            <div className="bg-white text-black p-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-orange-600"></div>

                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Registrasi Berhasil!</h2>
                                    <p className="text-gray-600">Selamat bergabung di Brawijaya Gym</p>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-300 py-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Member</span>
                                        <span className="font-bold">{successData.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Paket</span>
                                        <span className="font-bold text-orange-600">{successData.planName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Mulai</span>
                                        <span className="font-bold">{successData.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Berlaku Hingga</span>
                                        <span className="font-bold">{successData.endDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm uppercase">Tipe</span>
                                        <span className={`font-bold ${successData.planType === 'member' ? 'text-green-600' : 'text-gray-600'}`}>
                                            {successData.planType === 'member' ? 'Member Resmi' : successData.planType === 'trial' ? 'Trial (Guest)' : 'Daily Pass (Guest)'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-300 py-4">
                                    {isMemberPlan ? (
                                        <>
                                            <p className="text-xs text-blue-600 text-center font-bold">📧 Password login telah dikirim ke email Anda</p>
                                            <p className="text-xs text-gray-400 text-center mt-1">Cek inbox email <strong>{formData.email}</strong></p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center">Paket {successData.planType === 'trial' ? 'Trial' : 'Harian'} tidak memerlukan login.</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate(isMemberPlan ? '/login' : '/dashboard')}
                                    className="w-full mt-4 py-3 bg-black text-white font-bold uppercase hover:bg-gray-800 transition-colors"
                                >
                                    {isMemberPlan ? 'Login ke Dashboard' : 'Masuk ke Dashboard'}
                                </button>
                            </div>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
