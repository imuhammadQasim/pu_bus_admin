import React, { useState, useEffect } from 'react';
import { Bus as BusIcon, Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { adminService } from '../services/api';
import { motion } from 'framer-motion';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      const data = await adminService.getBuses();
      setBuses(data);
      setLoading(false);
    };
    fetchBuses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">Manage all PU buses, their status, and assigned routes.</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </header>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by bus number or driver..." className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        <table className="w-full text-left">
          <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Bus Number</th>
              <th className="px-6 py-4">Assigned Route</th>
              <th className="px-6 py-4">Driver Name</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-secondary rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-secondary rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-secondary rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-secondary rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-6 w-16 bg-secondary rounded-full"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-secondary rounded ml-auto"></div></td>
                </tr>
              ))
            ) : (
              buses.map((bus, i) => (
                <motion.tr 
                  key={bus.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <BusIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{bus.busNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{bus.route}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{bus.driver}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{bus.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      bus.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 
                      bus.status === 'In Maintenance' ? 'bg-pu-red/10 text-pu-red border-pu-red/20' : 
                      'bg-pu-gold/10 text-pu-gold border-pu-gold/20'
                    }`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-secondary rounded-lg text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Buses;
