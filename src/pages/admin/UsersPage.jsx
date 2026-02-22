import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';
import AdminLayout from '../../layouts/AdminLayout';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminService.getUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-zinc-500 mt-1">View and manage all registered members and guests.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
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
                    ) : filteredUsers.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                            <p>No users found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-950 text-xs uppercase text-zinc-500 font-medium">
                                        <th className="px-6 py-4 border-b border-zinc-800">User Info</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Type</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Status</th>
                                        <th className="px-6 py-4 border-b border-zinc-800">Joined</th>
                                        <th className="px-6 py-4 border-b border-zinc-800 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, idx) => {
                                        const isGuest = user.is_guest;
                                        return (
                                            <motion.tr
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={user.id}
                                                className="hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-white">{user.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-zinc-400">{user.email}</span>
                                                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                        <span className="text-xs text-zinc-500">{user.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${isGuest
                                                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {isGuest ? 'Guest' : 'Member'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${user.is_active
                                                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                                            : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                        }`}>
                                                        {user.is_active ? 'Active' : 'Deactivated'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-400 font-medium">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${user.is_active
                                                                ? 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white'
                                                                : 'border-green-500/50 text-green-500 hover:bg-green-500 hover:text-white'
                                                            }`}
                                                    >
                                                        {user.is_active ? 'Ban Account' : 'Reactivate'}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UsersPage;
