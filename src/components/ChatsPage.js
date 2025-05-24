
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TabBar from "./TabBar";
import { UsersRound } from "lucide-react";
import "../css/ChatsPage.css"; 
import logo from "../assets/logo1.png";

export default function ChatsPage() {
  const { accessToken, user } = useAuth();
  const [friendGroups, setFriendGroups] = useState([]);
  const [error, setError] = useState(null);
  const [expandedFriendId, setExpandedFriendId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySessions();
    // eslint-disable-next-line
  }, []);

  async function fetchMySessions() {
    setError(null);
    try {
      const resp = await axios.get("/api/myHelpSessions", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allSessions = resp.data.sessions || [];
      console.log("Fetched sessions:", allSessions);

      // Group sessions by friendId.
      const grouped = {};
      allSessions.forEach((sess) => {
        const friendId = sess.user_a === user.id ? sess.user_b : sess.user_a;
        const friendName =
          sess.user_a === user.id
            ? sess.user_b_profile?.username
            : sess.user_a_profile?.username;

        if (!grouped[friendId]) {
          grouped[friendId] = {
            friendId,
            friendName,
            sessions: [],
          };
        }
        grouped[friendId].sessions.push(sess);
      });

      const groupsArray = Object.values(grouped);
      setFriendGroups(groupsArray);
    } catch (err) {
      setError("Could not load sessions. " + err.message);
    }
  }

  // When opening a chat, first mark its messages as read.
  async function openChat(sessionId) {
    try {
      // Call an API endpoint to mark messages as read for this session.
      // (Implement /api/markChatAsRead on your backend to update messages as read)
      await axios.post(
        "/api/markChatAsRead",
        { sessionId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      console.error("Error marking chat as read:", err);
      // Even if marking as read fails, navigate to the chat.
    }
    navigate(`/chat/${sessionId}`);
  }

  function toggleFriend(friendId) {
    setExpandedFriendId((prev) => (prev === friendId ? null : friendId));
  }

  function getAvatarColorClass(friendId) {
    const colors = ["color-1", "color-2", "color-3", "color-4", "color-5"];
    let hash = 0;
    for (let i = 0; i < friendId.length; i++) {
      hash = friendId.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  function openAssistant() {
    navigate("/assistant");
  }

    function openNews() {
    navigate("/news");
  }

  return (
    <>
      <div className="chats-container">
        {error && <p className="error-text">{error}</p>}

        {/* Permanent GFit Assist row */}
        <div className="friend-group-card">
          <div className="friend-group-header" onClick={openAssistant}>
            <div className="friend-avatar" style={{ background: "white" }}>
              <img
                src={logo}
                alt="Logo"
                className="logo-gritPhases-task"
              />
            </div>
            GFit Assist
          </div>
        </div>

          <div className="friend-group-card">
            <div className="friend-group-header" onClick={openNews}>
            <div className="friend-avatar" style={{ background: "white" }}>
              <img
                src={logo}
                alt="Logo"
                className="logo-gritPhases-task"
              />
            </div>
              GFit News
            </div>
          </div>

        {friendGroups.map((group) => {
          const avatarColorClass = getAvatarColorClass(group.friendId || "");
          return (
            <div key={group.friendId} className="friend-group-card">
              <div
                className="friend-group-header"
                onClick={() => toggleFriend(group.friendId)}
                style={{ position: "relative" }}
              >
                <div className={`friend-avatar ${avatarColorClass}`}>
                  <UsersRound />
                </div>
                {group.friendName}
                {/* Friend-level unread dot: if any session in this group is unread */}
                {group.sessions.some(sess => {
                  const lastMsg = sess.last_message;
                  return lastMsg && lastMsg.sender_id !== user.id && lastMsg.is_read === false;
                }) && (
                  <span className="friend-unread-badge"></span>
                )}
              </div>

              {expandedFriendId === group.friendId && (
                <div className="friend-group-sessions">
                  {group.sessions.map((sess) => {
                    // Compute the last message (using last_message field; if missing, fallback to messages array)
                    const lastMsg = sess.last_message || (sess.messages && sess.messages[sess.messages.length - 1]);
                    // Unread if last message exists, and it was sent by friend and is not read.
                    const isUnread = lastMsg && lastMsg.sender_id !== user.id && lastMsg.is_read === false;
                    
                    const label = (sess.user_a === user.id)
                      ? "You asked for help"
                      : `${group.friendName} asked you for help`;
                    const taskDesc = sess.taskdetails?.taskdesc || "(No task desc)";
                    return (
                      <div
                        key={sess.id}
                        className="session-card"
                        onClick={() => openChat(sess.id)}
                      >
                        <div className="session-card-content">
                          <p className="session-label">{label}</p>
                          <p className="session-taskdesc">
                            <strong>Task:</strong> {taskDesc}
                          </p>
                        </div>
                        {isUnread && (
                          <span className="session-unread-badge"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TabBar />
    </>
  );
}
