// src/components/TabBar.js
import React , { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart2, Utensils, UsersRound, User } from "lucide-react";
import "../css/TabBar.css";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";

const API_URL =  "https://api.gritfit.site/api";

function TabBar() {
  const { accessToken } = useAuth();

 
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    async function getFriendRequests() {
      try {
        const resp = await axios.get(`${API_URL}/getFriendRequests`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const pending = resp.data.requests || [];
        setHasPendingRequests(pending.length > 0);
      } catch (err) {
        console.error("Error fetching friend requests in TabBar:", err);
        setHasPendingRequests(false);
      }
    }
    getFriendRequests();
  }, [accessToken]);

  return (
    <nav className="tabbar-footer">
      {/* HOME */}
      <NavLink
        to="/cardView"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <Home className="icon" />
        <span className="option-text" style={{ fontSize: "0.65rem" }}>Home</span>
      </NavLink>

      {/* Top Picks */}
      <NavLink
        to="/nutrition"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <Utensils className="icon" />
        <span className="option-text" style={{ fontSize: "0.65rem" }}>Top Picks</span>
      </NavLink>

      {/* Community link */}
      <NavLink
        to="/community"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
        style={{ position: "relative" }}
      >
        <UsersRound className="icon" />
        <span className="option-text" style={{ fontSize: "0.65rem" }}>
          Community
        </span>
        {hasPendingRequests && (
          <span className="community-unread-badge"></span>
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/UserProfile"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <User className="icon" />
        <span className="option-text" style={{ fontSize: "0.65rem" }}>Profile</span>
      </NavLink>
    </nav>
  );
}

export default TabBar;
