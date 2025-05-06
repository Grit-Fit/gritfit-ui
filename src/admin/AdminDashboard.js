// src/components/AdminDashboard.jsx
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import SwipeChart from "./SwipeChart";
import RatingChart from "./RatingChart";
import FeatureUsageCard from "../components/FeatureUsageCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ───────────────────────── helpers ───────────────────────── */
const Card = ({ title, value, onClick }) => (
  <div
    className={`bg-white rounded-xl shadow-md p-6 ${
      onClick ? "cursor-pointer hover:bg-gray-50" : ""
    }`}
    onClick={onClick}
  >
    <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
    <p className="text-3xl font-bold text-black">{value}</p>
  </div>
);

const ExpandableCard = ({ title, summary, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-md mb-6">
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-3xl font-bold mt-1">{summary}</p>
        </div>
        <div className="text-4xl font-bold">{open ? "−" : "+"}</div>
      </div>
      {open && <div className="p-6 border-t border-gray-200">{children}</div>}
    </div>
  );
};

/* ───────────────────────── dashboard ───────────────────────── */
export default function AdminDashboard() {
  const { accessToken } = useContext(AuthContext);

  /* auth */
  const [admin, setAdmin] = useState(
    localStorage.getItem("adminToken") === "true"
  );
  const [authErr, setAuthErr] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });

  /* high‑level stats */
  const [stats, setStats] = useState(null);       // /analytics
  const [engage, setEngage] = useState(null);     // /engagementStats
  const [metrics, setMetrics] = useState(null);   // /fullAnalytics

  /* nutrition (still global) */
  const [nutrition, setNutrition] = useState(null);

  /* app reviews (mvp_feedback) */
  const [appReviews, setAppReviews] = useState({ rows: [], counts: {} });
  const [ratingFilter, setRatingFilter] = useState("");

  /* component feedback (user_feedback) */
  const [compFb, setCompFb] = useState({ rows: [], countsByFeature: {} });

  /* tdee feedback (still mvp_feedback feature=TDEE_CALC) */
  const [tdeeFb, setTdeeFb] = useState([]);

  /* user modal */
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);

  const [selUser, setSelUser] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [userCompFb, setUserCompFb] = useState([]);

  /* ───── login handler ───── */
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      login.username === process.env.REACT_APP_ADMIN_USERNAME &&
      login.password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      localStorage.setItem("adminToken", "true");
      setAdmin(true);
      setAuthErr("");
    } else setAuthErr("Invalid credentials.");
  };

  /* ───── initial dashboard fetch ───── */
  useEffect(() => {
    if (!admin) return;
    (async () => {
      try {
        const [a, e, m, n] = await Promise.all([
          axios.get("/api/admin/analytics", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("/api/admin/engagementStats", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("/api/admin/fullAnalytics", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("/api/admin/nutritionStats", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        setStats(a.data);
        setEngage(e.data);
        setMetrics(m.data);
        setNutrition(n.data);
      } catch (err) {
        console.error(err);
        setAuthErr("Failed to load dashboard.");
        setAdmin(false);
        localStorage.removeItem("adminToken");
      }
    })();
  }, [admin, accessToken]);

  /* ───── app‑level reviews (mvp_feedback) ───── */
  useEffect(() => {
    if (!admin) return;
    (async () => {
      try {
        const url = ratingFilter
          ? `/api/admin/mvpFeedback?rating=${ratingFilter}`
          : "/api/admin/mvpFeedback";
        const r = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAppReviews(r.data); // { rows, counts }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [admin, ratingFilter, accessToken]);

  /* ───── component feedback (user_feedback) ───── */
  useEffect(() => {
    if (!admin) return;
    (async () => {
      try {
        const r = await axios.get("/api/admin/componentFeedback", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCompFb(r.data); // { rows, countsByFeature }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [admin, accessToken]);


  const avgTdee = tdeeFb.length
    ? (
        tdeeFb.reduce((s, f) => s + f.rating, 0) / tdeeFb.length
      ).toFixed(1)
    : "–";

  /* ───── Users list ───── */
  const fetchUsers = async () => {
    try {
      const r = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(r.data);
      setShowUserModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* ───── individual user summary + comp feedback ───── */
  const loadUserDetail = async (id) => {
    try {
      const [s, f] = await Promise.all([
        axios.get(`/api/admin/userSummary/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`/api/admin/componentFeedback?userId=${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setUserSummary(s.data);
      setUserCompFb(f.data.rows || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to load user");
    }
  };

  /* ───── derived helpers ───── */
  const usersFiltered = users.filter(
    (u) =>
      (u.username || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  /* group comp feedback rows by feature for card */
  const fbByFeature = useMemo(() => compFb.countsByFeature || {}, [compFb]);

  /* ───── UI: login gate ───── */
  if (!admin)
    return (
      <div className="p-10 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Login
          </button>
          {authErr && <p className="text-red-500">{authErr}</p>}
        </form>
      </div>
    );

  if (!stats || !engage || !metrics) return <div className="p-10">Loading…</div>;

  /* ───── UI proper ───── */
  return (
    <div className="p-6 bg-gradient-to-b from-sky-100 to-white min-h-screen">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            setAdmin(false);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card title="Total Users" value={stats.totalUsers} onClick={fetchUsers} />
        <Card title="Completed Tasks" value={stats.completedTasks} />
        <Card title="DAUs Today" value={engage.dau} />
      </div>

      {/* ↳ Engagement */}
      <ExpandableCard
        title="User Progress & Engagement"
        summary={`${engage.dau} active users today`}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <SwipeChart data={engage.swipeCounts} />
            <ul className="mt-4 text-sm space-y-1">
              <li>Completed: {engage.swipeCounts.Completed}</li>
              <li>Not Completed: {engage.swipeCounts["Not Completed"]}</li>
              <li>Help: {engage.swipeCounts.Help}</li>
            </ul>
            <h4 className="font-semibold mt-6 mb-2">Other Metrics</h4>
            <ul className="text-sm space-y-1">
              <li>Drop‑Offs: {metrics.dropOffPoints}</li>
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
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {engage.dauUsers?.map((u) => (
                  <tr key={u.userid} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.status}</td>
                    <td className="p-2">
                      {new Date(u.completion_time).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ExpandableCard>

      {/* ↳ App‑level reviews (mvp_feedback) */}
      <ExpandableCard
        title="App Reviews"
        summary={`${appReviews.rows.length} review${
          appReviews.rows.length !== 1 ? "s" : ""
        }`}
      >
        <div className="mb-4 flex items-center">
          <label className="mr-2 text-sm font-medium">Filter by rating:</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </div>

        <RatingChart counts={appReviews.counts} />

        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Comment</th>
                <th className="p-2">When</th>
              </tr>
            </thead>
            <tbody>
              {appReviews.rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.userprofile?.username || "—"}</td>
                  <td className="p-2">{r.rating} ★</td>
                  <td className="p-2">{r.comment || "—"}</td>
                  <td className="p-2">
                    {new Date(r.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ExpandableCard>

      {/* ↳ Component feedback (user_feedback) */}
      <ExpandableCard
        title="Component Feedback"
        summary={`${compFb.rows.length} feedback`}
      >
        {Object.keys(fbByFeature).length === 0 && (
          <p className="text-sm text-gray-500">No feedback yet.</p>
        )}
        {Object.entries(fbByFeature).map(([feature, list]) => (
          <div key={feature} className="mb-6">
            <h4 className="font-semibold mb-2">
              {feature} ({list.length})
            </h4>
            <div className="overflow-x-auto max-w-5xl mx-auto px-2">
  <table className="min-w-full text-sm divide-y divide-gray-200">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-6 py-3 text-left font-semibold">User</th>
        <th className="px-6 py-3 text-center font-semibold">★</th>
        <th className="px-6 py-3 text-left font-semibold">Comment</th>
        <th className="px-6 py-3 text-left font-semibold">When</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {list.map((f, idx) => (
        <tr
          key={f.id}
          className="hover:bg-gray-50 transition rounded-md"
        >
          <td className="px-6 py-3 text-gray-800">{f.userprofile?.username || "—"}</td>
          <td className="px-6 py-3 text-center text-gray-800">{f.rating}</td>
          <td className="px-6 py-3 text-gray-800 break-words">{f.comment || "—"}</td>
          <td className="px-6 py-3 text-gray-800 whitespace-nowrap">
            {new Date(f.submitted_at).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


          </div>
        ))}
      </ExpandableCard>

      {/* feature usage card */}
      <FeatureUsageCard accessToken={accessToken} />

      {/* ───── users list modal ───── */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl h-4/5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">All Registered Users</h2>
              <input
                type="text"
                placeholder="Search…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 w-full sm:w-72 focus:ring-sky-500"
              />
              <button onClick={() => setShowUserModal(false)}>✕</button>
            </div>
            <table className="table-auto w-full border text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersFiltered.map((u) => (
                  <tr
                    key={u.userid}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={() => {
                          setSelUser(u);
                          loadUserDetail(u.userid);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {usersFiltered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-gray-500">
                      No matches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───── user summary modal ───── */}
      {selUser && userSummary && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl h-4/5 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">
                Summary for {selUser.username}
              </h3>
              <button
                onClick={() => {
                  setSelUser(null);
                  setUserSummary(null);
                  setUserCompFb([]);
                }}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">User Status</h4>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Active Today:</strong>{" "}
                    {userSummary.isActiveToday ? "Yes" : "No"}
                  </li>
                  <li>
                    <strong>Current Streak:</strong>{" "}
                    {userSummary.currentStreak} day(s)
                  </li>
                  <li>
                    <strong>Current Task:</strong>{" "}
                    {userSummary.currentTask || "None"}
                  </li>
                  <li>
                    <strong>Gems:</strong> {userSummary.gems || 0}
                  </li>
                  <li>
                    <strong>Joined:</strong>{" "}
                    {new Date(
                      userSummary.accountCreated
                    ).toLocaleDateString()}
                  </li>
                </ul>
              </div>

              {/* task stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Task Statistics</h4>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Completed:</strong>{" "}
                    {userSummary.stats?.tasksCompleted || 0}
                  </li>
                  <li>
                    <strong>Not Completed:</strong>{" "}
                    {userSummary.stats?.tasksNotCompleted || 0}
                  </li>
                  <li>
                    <strong>Completion Rate:</strong>{" "}
                    {userSummary.stats?.tasksCompleted +
                      userSummary.stats?.tasksNotCompleted >
                    0
                      ? (
                          (userSummary.stats.tasksCompleted /
                            (userSummary.stats.tasksCompleted +
                              userSummary.stats.tasksNotCompleted)) *
                          100
                        ).toFixed(1) + "%"
                      : "N/A"}
                  </li>
                  <li>
                    <strong>Longest Streak:</strong>{" "}
                    {userSummary.longestStreak}
                  </li>
                  <li>
                    <strong>Breaks:</strong> {userSummary.streakBreaks}
                  </li>
                </ul>
              </div>

              {/* community */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Community</h4>
                <ul className="text-sm space-y-2">
                  <li>
                    <strong>Help Sent:</strong>{" "}
                    {userSummary.stats?.helpSent || 0}
                  </li>
                  <li>
                    <strong>Help Received:</strong>{" "}
                    {userSummary.stats?.helpReceived || 0}
                  </li>
                  <li>
                    <strong>Helpful Contributions:</strong>{" "}
                    {userSummary.stats?.helpfulContributions || 0}
                  </li>
                  <li>
                    <strong>Friends Added:</strong>{" "}
                    {userSummary.stats?.friendsAdded || 0}
                  </li>
                </ul>
              </div>

              {/* drop‑offs */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Drop‑Offs</h4>
                {Array.isArray(userSummary.dropOffs) &&
                userSummary.dropOffs.length ? (
                  <ul className="list-disc pl-4 text-xs max-h-20 overflow-y-auto">
                    {userSummary.dropOffs.map((t) => (
                      <li key={t}>Task #{t}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">None</p>
                )}
              </div>

              {/* component feedback */}
              <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                <h4 className="font-semibold mb-2">Component Feedback</h4>
                {userCompFb.length ? (
                  <ul className="text-xs list-disc pl-4 space-y-1 max-h-32 overflow-y-auto">
                    {userCompFb.map((f) => (
                      <li key={f.id}>
                        <strong>{f.feature}</strong>: {f.rating}★ —{" "}
                        {f.comment || "—"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No feedback</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(stats.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
