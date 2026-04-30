import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Package, Filter, CheckCircle2, Clock, MapPin, User, Tag } from 'lucide-react';
import { adminService } from '../services/api';
import { motion } from 'framer-motion';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await adminService.getLostFoundItems();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lost & Found Portal</h1>
          <p className="text-muted-foreground mt-1">Manage items found on buses and coordinate returns to students.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white border border-border px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
             <span className="text-sm font-bold text-primary">Pending: {items.filter(i => i.status === 'pending').length}</span>
           </div>
           <button className="btn-primary gap-2">
            <Package className="w-4 h-4" />
            Post Found Item
          </button>
        </div>
      </header>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search for items, locations, or names..." className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
        <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass-card h-56 rounded-2xl animate-pulse bg-secondary/30"></div>
          ))
        ) : (
          items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-border/50 hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 blur-2xl transition-opacity group-hover:opacity-100 ${
                item.status === 'returned' ? 'bg-green-500/10' : 'bg-pu-red/10'
              }`}></div>

              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  item.status === 'returned' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                }`}>
                  <Package className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  item.status === 'returned' ? 'bg-success/10 text-success border-success/20' : 'bg-pu-red/10 text-pu-red border-pu-red/20'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{item.item}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Found by: {item.reportedBy}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  {item.date}
                </div>
                {item.status === 'pending' && (
                  <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Returned
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default LostFound;
