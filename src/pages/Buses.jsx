import React, { useState, useEffect } from "react";
import {
  Bus as BusIcon,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Users,
  User as UserIcon,
  Route as RouteIcon,
  AlertTriangle,
} from "lucide-react";
import { adminService } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBus, setEditingBus] = useState(null);
  const [busToDelete, setBusToDelete] = useState(null);

  const [formData, setFormData] = useState({
    busNumber: "",
    routeId: "",
    conductorName: "",
    driverName: "",
    capacity: "",
    status: "ACTIVE",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [busesData, routesData] = await Promise.all([
        adminService.getBuses(),
        adminService.getRoutes(),
      ]);
      setBuses(busesData);
      setRoutes(routesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBusCreationModal = () => {
    setEditingBus(null);
    setFormData({
      busNumber: "",
      routeId: "",
      conductorName: "",
      driverName: "",
      capacity: "",
      status: "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setFormData({
      busNumber: bus.busNumber,
      routeId: bus.routeId || "",
      conductorName: bus.conductorName || "",
      driverName: bus.driverName || "",
      capacity: bus.capacity?.toString() || "",
      status: bus.status || "ACTIVE",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBus) {
        await adminService.updateBus(editingBus.id, formData);
      } else {
        await adminService.createBus(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      alert(error.message || "Failed to save bus");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (bus) => {
    setBusToDelete(bus);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!busToDelete) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteBus(busToDelete.id);
      setIsDeleteModalOpen(false);
      setBusToDelete(null);
      fetchData();
    } catch (error) {
      alert(error.message || "Failed to delete bus");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBuses = buses.filter((bus) =>
    bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bus.driverName && bus.driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (bus.route?.name && bus.route.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Fleet Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all PU buses, their status, and assigned routes.
          </p>
        </div>
        <button onClick={handleBusCreationModal} className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </header>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by bus number, driver, or route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Bus Number</th>
                <th className="px-6 py-4">Assigned Route</th>
                <th className="px-6 py-4">Driver / Conductor</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 w-20 bg-secondary rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 bg-secondary rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 bg-secondary rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-12 bg-secondary rounded"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-16 bg-secondary rounded-full"></div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-8 w-8 bg-secondary rounded ml-auto"></div>
                        </td>
                      </tr>
                    ))
                : filteredBuses.map((bus, i) => (
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
                          <span className="text-sm font-bold text-foreground">
                            {bus.busNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bus.route?.color || '#cbd5e1' }} />
                           <span className="text-sm text-muted-foreground">
                            {bus.route?.name || "Unassigned"}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium text-foreground flex items-center gap-1">
                            <UserIcon className="w-3 h-3 text-muted-foreground" />
                            {bus.driverName || "N/A"}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {bus.conductorName || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                        {bus.capacity || "0"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            bus.status === "ACTIVE"
                              ? "bg-success/10 text-success border-success/20"
                              : bus.status === "MAINTENANCE"
                                ? "bg-pu-red/10 text-pu-red border-pu-red/20"
                                : "bg-pu-gold/10 text-pu-gold border-pu-gold/20"
                          }`}
                        >
                          {bus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditBus(bus)}
                            className="p-2 hover:bg-secondary rounded-lg text-primary transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(bus)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
          {!loading && filteredBuses.length === 0 && (
            <div className="p-12 text-center">
              <BusIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No buses found</p>
              <p className="text-sm text-muted-foreground/60">Try adjusting your search or add a new bus.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-border"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                    <BusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {editingBus ? "Edit Bus" : "Add New Bus"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {editingBus ? "Update bus information" : "Register a new bus to the fleet"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-border"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Bus Number
                    </label>
                    <div className="relative">
                      <BusIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. LEC-1234"
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 outline-none transition-all"
                        value={formData.busNumber}
                        onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Assign Route
                    </label>
                    <div className="relative">
                      <RouteIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 outline-none transition-all appearance-none"
                        value={formData.routeId}
                        onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                      >
                        <option value="">Select a route</option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Driver Name
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 outline-none transition-all"
                          value={formData.driverName}
                          onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Conductor Name
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Full name"
                          className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 outline-none transition-all"
                          value={formData.conductorName}
                          onChange={(e) => setFormData({ ...formData, conductorName: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Bus Capacity
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 72"
                        className="w-full px-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 outline-none transition-all"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">
                        Status
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 outline-none transition-all appearance-none"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="MAINTENANCE">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : (editingBus ? "Update Bus" : "Add Bus")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-border p-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Confirm Deletion</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Are you sure you want to delete bus <span className="font-bold text-foreground">{busToDelete?.busNumber}</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex w-full gap-3 pt-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50"
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Buses;
