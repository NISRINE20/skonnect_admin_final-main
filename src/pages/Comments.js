import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaComments,
  FaUsers,
  FaCog,
  FaSearch,
} from "react-icons/fa";
import SidebarNav from "../components/Sidebar";
import {
  Layout,
  ContentWrapper,
  TopBar,
  SearchForm,
  SearchInput,
  ActionButtons,
  ActionButton,
  Heading,
  SubHeading,
  CommentsList,
  CommentCard,
  CommentHeader,
  /* Avatar removed */
  UserInfo,
  UserName,
  TimeStamp,
  CommentText,
  CommentActions,
  ActionLink,
} from "../styles/CommentsStyles";

// Comment card component - anonymous display (no name/email/profile)
const CommentCardComponent = ({
  time,
  text,
  ip,
  user_agent,
  rating,
  event_id,
  subevent_id,
  event_title,
  subevent_title,
  dark,
}) => (
  <CommentCard dark={dark}>
    <CommentHeader>
      <UserInfo style={{ marginLeft: 0 }}>
        <UserName dark={dark}>
          Anonymous
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            {subevent_title
              ? `${event_title || `Event #${event_id || "?"}`} — ${subevent_title}`
              : event_title
              ? `${event_title}`
              : (subevent_id ? `Sub-event #${subevent_id}` : event_id ? `Event #${event_id}` : "General")}
          </span>
        </UserName>
        <TimeStamp dark={dark}>
          {time}
          {/* keep IP/user agent if available, but do NOT display user email/name */}
          {ip ? ` • ${ip}` : ""} {user_agent ? ` • ${user_agent}` : ""}
          {typeof rating !== "undefined" && rating !== null && (
            <span style={{ marginLeft: 8, color: "#f59e0b", fontWeight: 700 }}>
              ★{rating}
            </span>
          )}
        </TimeStamp>
      </UserInfo>
    </CommentHeader>
    <CommentText dark={dark}>{text}</CommentText>
  </CommentCard>
);

const Comments = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("skonnect_dark_mode");
    return saved === "true";
  });

  // replaced static comments with fetched data
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let intervalId = null;
    const controller = new AbortController();

    // Fetch feedback only. Do NOT fetch names, emails or profile pictures.
    async function fetchFeedback() {
      const res = await fetch("https://vynceianoani.helioho.st/skonnect-api/get_feedback.php", { signal: controller.signal });
      if (!res.ok) throw new Error("Failed to load feedback");
      return await res.json();
    }

    async function start() {
      setLoading(true);
      try {
        // initial load
        const feedback = await fetchFeedback();
        const initial = feedback.map((f) => {
          return {
            id: f.id,
            avatar: "", // explicitly empty to preserve anonymity
            name: "Anonymous", // do not expose real names
            email: null, // do not expose emails
            time: f.created_at ? new Date(f.created_at).toLocaleString() : "Unknown",
            text: f.message || "",
            ip: f.ip || f.ip_address || null,
            user_agent: f.user_agent || null,
            created_at: f.created_at,
            rating: (typeof f.rating !== "undefined" && f.rating !== null) ? f.rating : null,
            event_id: f.event_id ? Number(f.event_id) : null,
            subevent_id: f.subevent_id ? Number(f.subevent_id) : null,
            event_title: f.event_title || null,
            subevent_title: f.subevent_title || null,
          };
        });

        if (mounted) {
          setComments(initial);
          setError(null);
          setLoading(false);
        }

        // poll for new comments every 8 seconds
        intervalId = setInterval(async () => {
          try {
            const updatedRaw = await fetchFeedback();
            if (!mounted) return;

            const updated = updatedRaw.map((f) => ({
              id: f.id,
              avatar: "",
              name: "Anonymous",
              email: null,
              time: f.created_at ? new Date(f.created_at).toLocaleString() : "Unknown",
              text: f.message || "",
              ip: f.ip || f.ip_address || null,
              user_agent: f.user_agent || null,
              created_at: f.created_at,
              rating: (typeof f.rating !== "undefined" && f.rating !== null) ? f.rating : null,
              event_id: f.event_id ? Number(f.event_id) : null,
              subevent_id: f.subevent_id ? Number(f.subevent_id) : null,
              event_title: f.event_title || null,
              subevent_title: f.subevent_title || null,
            }));

            const currentLatest = comments[0]?.id || comments[0]?.created_at || null;
            const updatedLatest = updated[0]?.id || updated[0]?.created_at || null;

            if (comments.length !== updated.length || String(currentLatest) !== String(updatedLatest)) {
              setComments(updated);
            }
          } catch (pollErr) {
            if (mounted && !error) setError(pollErr.message);
          }
        }, 8000);
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    start();

    return () => {
      mounted = false;
      controller.abort();
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout dark={darkMode}>
      <SidebarNav darkMode={darkMode} />

      <ContentWrapper dark={darkMode}>
        <Heading dark={darkMode}>Comments</Heading>
        <SubHeading dark={darkMode}>
          Manage and review user comments below (anonymous).
        </SubHeading>

        {loading && <div>Loading comments...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        <CommentsList>
          {comments.map((comment, index) => (
            <CommentCardComponent
              key={comment.id || index}
              {...comment}
              dark={darkMode}
            />
          ))}
        </CommentsList>
      </ContentWrapper>
    </Layout>
  );
};

export default Comments;