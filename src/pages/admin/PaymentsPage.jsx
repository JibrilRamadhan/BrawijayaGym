import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';

const PaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await adminService.getPayments();
                setPayments(data);
            } catch (err) {
                console.error("Failed to fetch payments", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'settlement':
            case 'capture':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'expire':
            case 'expired':
            case 'failed':
            case 'cancel':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-zinc-800 text-zinc-400 border-zinc-700';
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                        <p className="text-zinc-500 mt-1">Review all recent membership and daily pass payments.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search order ID or name..."
                            className="bg-zinc-900 border border-zinc-800 text-sm rounded-xl py-2.5 pl-10 pr-4 w-full md:w-64 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative min-h-[400px]">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                            <p>No transaction records found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-950 text-xs uppercase text-zinc-500 font-medium">
                                        <th className="px-6 py-4 border-b border-zinc-800">Order ID</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Customer</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Plan</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Amount</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Status</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map((payment, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={payment.id}
                                            className="hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0"
                                        >
                                            <td className="px-6 py-4 text-sm font-mono text-zinc-300">
                                                {payment.order_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-white">{payment.user?.name}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{payment.user?.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-300 font-medium">
                                                {payment.plan?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-white tracking-tight">
                                                {formatRupiah(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${getStatusStyle(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-400 font-medium whitespace-nowrap">
                                                {new Date(payment.created_at).toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </motion.tr>
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

export default PaymentsPage;
