// src/components/TabBar.js
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart2, Utensils, User } from "lucide-react";
import "../css/TabBar.css";

function TabBar() {
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
        <span>Home</span>
      </NavLink>

      {/* GFit Trends */}
      <NavLink
        to="/gFitReport"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <BarChart2 className="icon" />
        <span>GFit Trends</span>
      </NavLink>

      {/* Top Picks */}
      <NavLink
        to="/nutrition"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <Utensils className="icon" />
        <span>Top Picks</span>
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/UserProfile"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <User className="icon" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}

export default TabBar;
