

import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import TabBar from "./TabBar";
import logo from "../assets/logo1.png";
import "../css/FriendsPage.css";

const API_URL =  "https://api.gritfit.site/api";

export default function FriendsPage() {
  const { accessToken } = useAuth();

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);

  async function fetchFriends() {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await axios.get(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFriends(resp.data.friends || []);
    } catch (err) {
      setError("Could not load friends.");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeFriend(friendId) {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/removeFriend/${friendId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchFriends();
    } catch (err) {
      setError("Could not remove friend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPendingRequests() {
    setError(null);
    try {
      const resp = await axios.get(`${API_URL}/getFriendRequests`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPendingRequests(resp.data.requests || []);
    } catch (err) {
      setError("Could not load friend requests.");
    }
  }

  async function respondToRequest(requestId, accept) {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_URL}/respondFriendRequest`,
        { requestId, accept },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
      if (accept) fetchFriends();
    } catch (err) {
      setError("Could not respond to friend request. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const resp = await axios.get(
        `${API_URL}/searchUsers?query=${searchQuery}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSearchResults(resp.data.results || []);
    } catch (err) {
      setError("User search failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function sendFriendRequest(toUserId) {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_URL}/sendFriendRequest`,
        { toUserId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Friend request sent!");
    } catch (err) {
      setError("Could not send friend request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
<>
  <div className="friends-container">
    {error && <p className="error-text">{error}</p>}
    {isLoading && <p className="loading-text">Loading...</p>}

    {/* SEARCH SECTION */}
    <section className="search-section section-card">
      <h3>Find New Friends</h3>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn" disabled={isLoading}>
          Search
        </button>
      </form>

      <ul className="search-results">
        {searchResults.map((user) => (
          <li key={user.userid} className="search-result-item">
            {user.username} ({user.email})
            <button
              onClick={() => sendFriendRequest(user.userid)}
              disabled={isLoading || friends.length >= 3}
              className="send-request-btn"
            >
              Connect
            </button>
          </li>
        ))}
      </ul>
      <p className="limit-text">
        {friends.length < 3
          ? `You can add up to ${3 - friends.length} more friend(s).`
          : "Friend limit reached!"}
      </p>
    </section>

        {/* PENDING REQUESTS SECTION */}
        <section className="requests-section section-card">
      <h3>Pending Friend Requests</h3>
      {pendingRequests.length === 0 ? (
        <p className="empty-text">No pending requests.</p>
      ) : (
        pendingRequests.map((req) => (
          <div key={req.id} className="request-card">
            <p>
              <strong>From:</strong> {req.from_user.username} ({req.from_user.email})
            </p>
          <div class = "friends-btn">
            <button className="accept-btn" onClick={() => respondToRequest(req.id, true)}>
              Accept
            </button>
            <button className="reject-btn" onClick={() => respondToRequest(req.id, false)}>
              Reject
            </button>
          </div>
          </div>
        ))
      )}
    </section>

    {/* FRIENDS SECTION */}
    <section className="friends-section section-card">
      <h3>My Friends</h3>
      <ul className="friend-list">
        {friends.map((f) => (
          <li key={f.id} className="friend-item">
            {f.name} ({f.email})
            <button className="remove-btn" onClick={() => removeFriend(f.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  </div>

  <TabBar />
</>

  );
}
