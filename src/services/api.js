// Mock API Service for Admin Portal
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const adminService = {
  getStats: async () => {
    await delay(800);
    return {
      totalBuses: 42,
      activeRoutes: 18,
      pendingReports: 7,
      totalStudents: 1284,
      busesChange: 12,
      routesChange: 4,
      reportsChange: 25,
      studentsChange: 8
    };
  },

  getRecentReports: async () => {
    await delay(1000);
    return [
      { id: 1, user: "Ali Ahmed", type: "Bus Delay", route: "Route 12", time: "10 mins ago", status: "pending", initials: "AA" },
      { id: 2, user: "Sana Khan", type: "Conductor Behavior", route: "Route 5", time: "25 mins ago", status: "reviewed", initials: "SK" },
      { id: 3, user: "Umar Raza", type: "Lost Item", route: "Route 8", time: "1 hour ago", status: "pending", initials: "UR" },
      { id: 4, user: "Zainab Bibi", type: "App Bug", route: "N/A", time: "3 hours ago", status: "resolved", initials: "ZB" },
      { id: 5, user: "Hamza Ali", type: "Route Change", route: "Route 3", time: "5 hours ago", status: "pending", initials: "HA" },
    ];
  },

  getSystemStatus: async () => {
    await delay(500);
    return [
      { name: "Backend API", status: "online", active: true },
      { name: "Live Tracking", status: "active", active: true },
      { name: "Database Backup", status: "failed", active: false },
      { name: "Notification Service", status: "online", active: true },
    ];
  },

  getBuses: async () => {
    await delay(700);
    return [
      { id: 1, busNumber: "BUS-001", route: "Route 1 (Old Campus)", status: "Active", driver: "Muhammad Ali", capacity: "60/72" },
      { id: 2, busNumber: "BUS-012", route: "Route 12 (Johar Town)", status: "In Maintenance", driver: "Ahmed Raza", capacity: "0/72" },
      { id: 3, busNumber: "BUS-005", route: "Route 5 (Gulberg)", status: "Active", driver: "Umar Farooq", capacity: "45/72" },
      { id: 4, busNumber: "BUS-022", route: "Route 22 (Wapda Town)", status: "Active", driver: "Sajid Khan", capacity: "55/72" },
      { id: 5, busNumber: "BUS-008", route: "Route 8 (Faisal Town)", status: "Delayed", driver: "Bilal Malik", capacity: "68/72" },
    ];
  },

  getRoutes: async () => {
    await delay(600);
    return [
      { id: 1, name: "Route 1", origin: "Old Campus", destination: "New Campus", stops: 12, buses: 4, color: "#1e3a8a" },
      { id: 2, name: "Route 12", origin: "Johar Town", destination: "New Campus", stops: 15, buses: 3, color: "#b45309" },
      { id: 3, name: "Route 5", origin: "Gulberg", destination: "New Campus", stops: 10, buses: 2, color: "#15803d" },
      { id: 4, name: "Route 22", origin: "Wapda Town", destination: "New Campus", stops: 18, buses: 5, color: "#be123c" },
    ];
  },

  getUsers: async () => {
    await delay(900);
    return [
      { id: 1, name: "Zaid Ahmed", email: "zaid.student@pu.edu.pk", department: "IT", status: "Active", joinDate: "Sep 2023" },
      { id: 2, name: "Ayesha Noor", email: "ayesha.n@pu.edu.pk", department: "Pharmacy", status: "Active", joinDate: "Oct 2023" },
      { id: 3, name: "Fatima Gul", email: "fatima.g@pu.edu.pk", department: "Law", status: "Inactive", joinDate: "Aug 2023" },
      { id: 4, name: "Usman Ghani", email: "usman.ghani@pu.edu.pk", department: "Engineering", status: "Active", joinDate: "Nov 2023" },
      { id: 5, name: "Khadija Ali", email: "khadija.a@pu.edu.pk", department: "Business", status: "Active", joinDate: "Jan 2024" },
    ];
  },

  getLostFoundItems: async () => {
    await delay(800);
    return [
      { id: 1, item: "Scientific Calculator", category: "Electronics", location: "Route 12 - Seat 24", date: "Oct 28, 2023", reportedBy: "Ali Raza", status: "pending" },
      { id: 2, item: "Leather Wallet (Black)", category: "Personal", location: "Route 5 - Front Row", date: "Oct 27, 2023", reportedBy: "Sana Malik", status: "returned" },
      { id: 3, item: "PU Student Card", category: "Documents", location: "New Campus Terminal", date: "Oct 26, 2023", reportedBy: "Zainab Bibi", status: "pending" },
      { id: 4, item: "Blue Backpack", category: "Bag", location: "Route 22", date: "Oct 25, 2023", reportedBy: "Umar Khan", status: "pending" },
      { id: 5, item: "Apple AirPods", category: "Electronics", location: "Route 8 - Back Seat", date: "Oct 24, 2023", reportedBy: "Fatima Noor", status: "returned" },
    ];
  }
};
