// src/components/TabBar.js
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart2, Utensils, UsersRound, User } from "lucide-react";
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
        <span className="option-text" style={{fontSize: "0.65rem"}}>Home</span>
      </NavLink>

      {/* GFit Trends */}
      {/* <NavLink
        to="/gFitReport"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <BarChart2 className="icon" />
        <span>GFit Trends</span>
      </NavLink> */}

      {/* Top Picks */}
      <NavLink
        to="/nutrition"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <Utensils className="icon" />
        <span className="option-text" style={{fontSize: "0.65rem"}}>Top Picks</span>
      </NavLink>

            {/* NEW: Community */}
            <NavLink
        to="/community"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <UsersRound className="icon" />
        <span className="option-text" style={{fontSize: "0.65rem"}}>Community</span>
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/UserProfile"
        className={({ isActive }) =>
          `tabbar-menu-item ${isActive ? "selected" : ""}`
        }
      >
        <User className="icon" />
        <span className="option-text" style={{fontSize: "0.65rem"}}>Profile</span>
      </NavLink>
    </nav>
  );
}

export default TabBar;
