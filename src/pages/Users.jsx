import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Mail, ShieldCheck, UserMinus, UserCheck } from 'lucide-react';
import { adminService } from '../services/api';
import { motion } from 'framer-motion';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await adminService.getUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Directory</h1>
          <p className="text-muted-foreground mt-1">Manage student accounts and verify university email addresses.</p>
        </div>
        <div className="flex items-center gap-3 bg-pu-gold/10 px-4 py-2 rounded-xl border border-pu-gold/20">
          <ShieldCheck className="w-5 h-5 text-pu-navy" />
          <span className="text-sm font-bold text-pu-navy uppercase tracking-wider">All Users Verified</span>
        </div>
      </header>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, email, or department..." className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-card h-40 rounded-2xl animate-pulse bg-secondary/30"></div>
          ))
        ) : (
          users.map((user, i) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-bold text-lg border border-border">
                    {user.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{user.firstName} {user.lastName}</h3>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{user.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  user.isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-600 transition-colors">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
