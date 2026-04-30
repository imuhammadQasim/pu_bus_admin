import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Bus, 
  MapPin, 
  AlertCircle, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../services/api';

const StatCard = ({ icon: Icon, label, value, change, positive = true, color = "primary", loading }) => (
  <div className="glass-card p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
    {loading && (
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )}
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl bg-primary/10 text-primary`}>
        <Icon className="w-6 h-6" />
      </div>
      {!loading && (
        <div className={`flex items-center gap-1 text-xs font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}%
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-foreground">{loading ? "---" : value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData, statusData] = await Promise.all([
        adminService.getStats(),
        adminService.getRecentReports(),
        adminService.getSystemStatus()
      ]);
      setStats(statsData);
      setReports(reportsData);
      setSystemStatus(statusData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1 font-medium">System performance and student activity at a glance.</p>
        </div>
        <button 
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-foreground hover:bg-secondary transition-all active:scale-95 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Bus} 
          label="Total Buses" 
          value={stats?.totalBuses} 
          change={stats?.busesChange} 
          loading={loading}
        />
        <StatCard 
          icon={MapPin} 
          label="Active Routes" 
          value={stats?.activeRoutes} 
          change={stats?.routesChange} 
          loading={loading}
        />
        <StatCard 
          icon={AlertCircle} 
          label="Pending Reports" 
          value={stats?.pendingReports} 
          change={stats?.reportsChange} 
          positive={false} 
          loading={loading}
        />
        <StatCard 
          icon={Users} 
          label="Total Students" 
          value={stats?.totalStudents?.toLocaleString()} 
          change={stats?.studentsChange} 
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Pending Student Reports</h2>
            <button className="text-primary text-sm font-bold hover:underline">View all reports</button>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-sm">
            <div className="divide-y divide-border">
              <AnimatePresence mode='wait'>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="p-5 flex items-center justify-between gap-4 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary"></div>
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-secondary rounded"></div>
                          <div className="w-48 h-3 bg-secondary rounded"></div>
                        </div>
                      </div>
                      <div className="w-20 h-6 bg-secondary rounded-full"></div>
                    </div>
                  ))
                ) : (
                  reports.map((report, i) => (
                    <motion.div 
                      key={report.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-5 hover:bg-secondary/20 transition-colors flex items-center justify-between gap-4 group cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/5 group-hover:bg-primary group-hover:text-white transition-colors">
                          {report.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{report.user}</p>
                          <p className="text-xs text-muted-foreground font-medium">{report.type} • <span className="text-primary/70">{report.route}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {report.time}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                          report.status === 'pending' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">System Status</h2>
          <div className="glass-card p-6 rounded-2xl space-y-6 border border-border/50 shadow-sm relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            <div className="space-y-5">
              {systemStatus.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'} animate-pulse`}></div>
                    <span className="text-sm font-bold text-foreground/80">{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${item.active ? 'text-green-600' : 'text-red-600'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-border">
              <button className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pu-navy-dark transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20">
                <TrendingUp className="w-4 h-4" />
                View Detailed Analytics
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-pu-gold/5 border border-pu-gold/20">
            <h4 className="text-sm font-bold text-pu-navy mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Quick Tip
            </h4>
            <p className="text-xs text-pu-navy/70 leading-relaxed font-medium">
              You can resolve multiple reports at once by selecting them in the Reports management section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
