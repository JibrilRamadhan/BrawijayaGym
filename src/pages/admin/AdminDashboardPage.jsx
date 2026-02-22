import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_revenue: 0,
        recent_payments: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const statCards = [
        { title: 'Total Members', value: stats.total_users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Total Revenue', value: formatRupiah(stats.total_revenue), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Active Plans', value: stats.recent_payments.length ? 'Active' : 'N/A', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-zinc-500 mt-2">Welcome back, monitor your gym's performance here.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4"
                            >
                                <div className={`p-4 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                                    <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Recent Transactions */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-8">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                        <h2 className="font-bold text-xl flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            Recent Payments
                        </h2>
                    </div>
                    {stats.recent_payments.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500">No recent transactions found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-950 text-xs uppercase text-zinc-500 font-medium">
                                        <th className="px-6 py-4 border-b border-zinc-800">User</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Plan</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Amount</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recent_payments.map((payment, i) => (
                                        <tr key={payment.id} className="hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0 text-sm">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-white">{payment.user?.name}</p>
                                                <p className="text-xs text-zinc-500">{payment.user?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300">{payment.plan?.name || '-'}</td>
                                            <td className="px-6 py-4 text-green-400 font-medium">{formatRupiah(payment.amount)}</td>
                                            <td className="px-6 py-4 text-zinc-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
