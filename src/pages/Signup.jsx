import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bus, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(formData);
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-white font-inter">
      {/* Left Side - Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Bus className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary">PU Bus Admin</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Request Access</h2>
            <p className="text-muted-foreground mt-2 font-medium">Join the administration team to manage PU transport.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="John" className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="admin.name@pu.edu.pk" className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Admin Code</label>
              <div className="relative group">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="text" required placeholder="Enter Verification Code" className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input type="password" required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pu-navy-dark transition-all transform active:scale-[0.98] shadow-lg shadow-primary/25 mt-4">
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Create Admin Account <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual Area */}
      <div className="hidden lg:flex flex-1 bg-pu-navy-dark relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-pu-gold/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-white text-2xl font-bold mb-4">Secure Admin Access</h3>
            <p className="text-white/60 mb-8 font-medium">Your account will require verification by the system administrator before you can access sensitive data.</p>
            
            <div className="space-y-4">
              {[
                "Manage Bus Waypoints",
                "Review Student Feedback",
                "Live Fleet Monitoring",
                "User Role Management"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 text-sm font-semibold">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <Shield className="w-3 h-3" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
