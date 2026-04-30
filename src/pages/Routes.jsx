import React, { useState, useEffect } from 'react';
import { Map, Plus, Search, MapPin, Bus, Layers } from 'lucide-react';
import { adminService } from '../services/api';
import { motion } from 'framer-motion';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      const data = await adminService.getRoutes();
      setRoutes(data);
      setLoading(false);
    };
    fetchRoutes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Route Management</h1>
          <p className="text-muted-foreground mt-1">Configure bus routes, stops, and schedule frequencies.</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Create New Route
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-card h-48 rounded-2xl animate-pulse bg-secondary/30"></div>
          ))
        ) : (
          routes.map((route, i) => (
            <motion.div 
              key={route.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-border/50 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${route.color}15`, color: route.color }}>
                  <Map className="w-6 h-6" />
                </div>
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      B{j+1}
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{route.name}</h3>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {route.origin} → {route.destination}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Stops</p>
                    <p className="text-sm font-bold text-foreground">{route.stops}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Buses</p>
                    <p className="text-sm font-bold text-foreground">{route.buses}</p>
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

export default Routes;
