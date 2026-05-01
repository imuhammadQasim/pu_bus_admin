import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminService } from '../services/api';

const Reports = () => {
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await adminService.getRecentReports();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateReportStatus(id, status);
      // Refresh reports list
      fetchReports();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      case 'reviewed': return 'bg-info/10 text-info border-info/20';
      case 'pending': return 'bg-pu-red/10 text-pu-red border-pu-red/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-pu-red';
      case 'medium': return 'text-pu-bronze';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Reports</h1>
          <p className="text-muted-foreground mt-1">Manage and respond to feedback from students regarding bus services.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-white text-sm font-medium hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="btn-primary gap-2 text-sm">
            <Filter className="w-4 h-4" />
            Filter Reports
          </button>
        </div>
      </header>

      {/* Reports Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Priority</th>
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
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-secondary rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-secondary rounded-full"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-secondary rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                reports.map((report, i) => (
                  <motion.tr 
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-primary truncate max-w-[100px]">
                      {report.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary border border-primary/10">
                          {report.user?.firstName?.[0] || 'U'}
                        </div>
                        <span className="text-sm font-medium text-foreground">{report.user?.firstName} {report.user?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {report.route?.name || report.busNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-secondary text-primary transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-secondary text-success transition-colors" 
                          title="Mark Resolved"
                          onClick={() => handleStatusUpdate(report.id, 'resolved')}
                          disabled={report.status === 'resolved'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-secondary/30 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {reports.length} reports</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-border rounded bg-white disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-border rounded bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
