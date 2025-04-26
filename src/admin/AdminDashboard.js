// src/components/AdminDashboard.js
import React, { useEffect, useState, useContext } from "react";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import SwipeChart from "./SwipeChart";

function Card({ title, value, onClick }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`} onClick={onClick}>
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className="text-3xl font-bold text-black">{value}</p>
    </div>
  );
}

function ExpandableCard({ title, summary, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md mb-6">
      <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-3xl font-bold mt-1">{summary}</p>
        </div>
        <div className="text-4xl font-bold">{open ? '−' : '+'}</div>
      </div>
      {open && <div className="p-6 border-t border-gray-200">{children}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const { accessToken } = useContext(AuthContext);
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem("adminToken") === "true");
  const [authError, setAuthError] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [data, setData] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [nutrition,setNutrition]=useState(null)

  const handleLogin = (e) => {
    e.preventDefault();
    const envUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const envPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    if (loginForm.username === envUsername && loginForm.password === envPassword) {
      localStorage.setItem("adminToken", "true");
      setAdminLoggedIn(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials.");
    }
  };

  useEffect(() => {
    if (!adminLoggedIn) return;

    const fetchAll = async () => {
      try {
        const [aRes, eRes, mRes, nRes] = await Promise.all([
          axios.get("/api/admin/analytics", { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get("/api/admin/engagementStats", { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get("/api/admin/fullAnalytics", { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get("/api/admin/nutritionStats", { headers: { Authorization: `Bearer ${accessToken}` } }),
        ]);
        setData(aRes.data);
        setEngagement(eRes.data);
        setMetrics(mRes.data);
        setNutrition(nRes.data); 
      } catch (err) {
        console.error("Fetch error:", err);
        setAuthError("Failed to load data.");
        setAdminLoggedIn(false);
        localStorage.removeItem("adminToken");
      }
    };

    fetchAll();
  }, [adminLoggedIn, accessToken]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(res.data);
      setShowUserModal(true);
    } catch (err) {
      console.error("User list fetch error:", err);
    }
  };

  const fetchUserSummary = async (userid) => {
    if (!userid) {
      console.error("Invalid user ID provided");
      return;
    }
    
    try {
      setUserSummary(null); // Clear previous data
      
      const res = await axios.get(`/api/admin/userSummary/${userid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (res.data) {
        setUserSummary(res.data);
      } else {
        console.error("Empty response received");
      }
    } catch (err) {
      console.error("User summary fetch failed:", err.response?.data || err.message);
      // Show error to user
      alert(`Failed to load user data: ${err.response?.data?.error || err.message}`);
    }
  };

  if (!adminLoggedIn) {
    return (
      <div className="p-10 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="Username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full border p-2 rounded" />
          <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border p-2 rounded" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">Login</button>
          {authError && <p className="text-red-500">{authError}</p>}
        </form>
      </div>
    );
  }

  if (!data || !engagement || !metrics) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-b from-sky-100 to-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
        <button onClick={() => { localStorage.removeItem("adminToken"); setAdminLoggedIn(false); }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card title="Total Users" value={data.totalUsers} onClick={fetchUsers} />
        <Card title="Completed Tasks" value={data.completedTasks} />
        <Card title="DAUs Today" value={engagement.dau} />
      </div>

      <ExpandableCard title="User Progress & Engagement" summary={`${engagement.dau} active users today`}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <SwipeChart data={engagement.swipeCounts} />
            <ul className="mt-4 text-sm space-y-1">
              <li>Completed: {engagement.swipeCounts.Completed}</li>
              <li>Not Completed: {engagement.swipeCounts['Not Completed']}</li>
              <li>Help: {engagement.swipeCounts.Help}</li>
            </ul>
            <h4 className="font-semibold mt-6 mb-2">Other Metrics</h4>
            <ul className="text-sm space-y-1">
              <li>Drop-Offs: {metrics.dropOffPoints}</li>
              <li>Help Requests Today: {metrics.helpRequestsToday}</li>
              <li>Help Messages Today: {metrics.helpMessagesToday}</li>
              <li>Help Rewards Today: {metrics.helpRewardsToday}</li>
              <li>Forgot Password Attempts: {metrics.forgotPasswordCount}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Today's Active Users</h4>
            <table className="table-auto w-full border text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Status</th><th className="p-2">Time</th></tr>
              </thead>
              <tbody>
                {engagement.dauUsers?.map((u, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.status}</td>
                    <td className="p-2">{new Date(u.completion_time).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ExpandableCard>

      {/* User List Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl h-4/5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">All Registered Users</h2>
              <button onClick={() => setShowUserModal(false)}>✕</button>
            </div>
            <table className="table-auto w-full border text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Action</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <button className="text-blue-600 underline" onClick={() => {
                        setSelectedUser(u);
                        fetchUserSummary(u.userid);
                      }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Individual User Insight Modal */}
      {selectedUser && userSummary && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">Summary for {selectedUser.username}</h3>
        <button onClick={() => setSelectedUser(null)}>✕</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">User Status</h4>
          <ul className="text-sm space-y-2">
            <li><strong>Active Today:</strong> {userSummary.isActiveToday ? 'Yes' : 'No'}</li>
            <li><strong>Current Streak:</strong> {userSummary.currentStreak} day(s)</li>
            <li><strong>Current Task ID:</strong> {userSummary.currentTask || 'None assigned'}</li>
            <li><strong>Gems:</strong> {userSummary.gems || 0}</li>
            <li><strong>Account Created:</strong>
              {userSummary.accountCreated
            ? new Date(userSummary.accountCreated).toLocaleDateString()
              : 'Unknown'}
              </li>
              <li><strong>Calorie Calc </strong> – new today: {nutrition?.firstTime || 0}</li>
              <li> edits today: {nutrition?.updates || 0}</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Task Statistics</h4>
          <ul className="text-sm space-y-2">
            <li><strong>Tasks Completed:</strong> {userSummary.stats?.tasksCompleted || 0}</li>
            <li><strong>Tasks Not Completed:</strong> {userSummary.stats?.tasksNotCompleted || 0}</li>
            <li><strong>Completion Rate:</strong> {
              userSummary.stats?.tasksCompleted + userSummary.stats?.tasksNotCompleted > 0 ? 
              ((userSummary.stats?.tasksCompleted / (userSummary.stats?.tasksCompleted + userSummary.stats?.tasksNotCompleted)) * 100).toFixed(1) + '%' : 
              'N/A'
            }</li>
            <li><strong>Current Streak:</strong> {userSummary.currentStreak} day(s)</li>
            <li><strong>Longest Streak:</strong> {userSummary.longestStreak}</li>
            <li><strong>Breaks:</strong> {userSummary.streakBreaks}</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Community Activity</h4>
          <ul className="text-sm space-y-2">
            <li><strong>Help Sent:</strong> {userSummary.stats?.helpSent || 0}</li>
            <li><strong>Help Received:</strong> {userSummary.stats?.helpReceived || 0}</li>
            <li><strong>Helpful Contributions:</strong> {userSummary.stats?.helpfulContributions || 0}</li>
            <li><strong>Friends Added:</strong> {userSummary.stats?.friendsAdded || 0}</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Drop-Offs</h4>
          {Array.isArray(userSummary.dropOffs) && userSummary.dropOffs.length > 0 ? (
            <div className="max-h-20 overflow-y-auto text-xs">
              <ul className="list-disc pl-4">
                {userSummary.dropOffs.map((task, idx) => (
                  <li key={idx}>Task #{task}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No drop-offs recorded</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          User ID: {selectedUser.userid || selectedUser.uid}
        </p>
      </div>
    </div>
  </div>
)}

      <p className="text-sm text-gray-500 mt-4">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
