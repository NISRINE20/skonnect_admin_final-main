import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaBell,
  FaComments,
  FaUsers,
  FaCog,
  FaSearch,
} from "react-icons/fa";
import SidebarNav from "../components/Sidebar";
import { fetchWithFallback } from '../utils/fetchWithFallback';
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
  const [eventsMap, setEventsMap] = useState({}); // id -> title
  const [sortOption, setSortOption] = useState("newest"); // newest | oldest | rating_desc | rating_asc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch main events to resolve event_id -> event title
  useEffect(() => {
    let mounted = true;
    async function fetchEvents() {
      try {
        const res = await fetchWithFallback('get_main_events.php');
        if (!res || !res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        let list = Array.isArray(data) ? data : (Array.isArray(data.main_events) ? data.main_events : (Array.isArray(data.events) ? data.events : (Array.isArray(data.data) ? data.data : [])));
        const map = {};
        list.forEach(ev => { if (ev && (ev.id || ev.event_id)) map[ev.id || ev.event_id] = ev.title || ev.name || `Event #${ev.id || ev.event_id}`; });
        if (mounted) setEventsMap(map);
      } catch (err) {
        console.warn("Could not fetch events for comments mapping:", err);
      }
    }
    fetchEvents();
    return () => { mounted = false; };
  }, []);

  // derive sorted & display-ready comments
  const displayedComments = React.useMemo(() => {
    const copy = comments.slice();
    // sort
    copy.sort((a, b) => {
      if (sortOption === "newest") {
        return (new Date(b.created_at || b.time)).getTime() - (new Date(a.created_at || a.time)).getTime();
      }
      if (sortOption === "oldest") {
        return (new Date(a.created_at || a.time)).getTime() - (new Date(b.created_at || b.time)).getTime();
      }
      if (sortOption === "rating_desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortOption === "rating_asc") {
        return (a.rating || 0) - (b.rating || 0);
      }
      return 0;
    });
    // ensure event_title exists for display
    return copy.map(c => ({
      ...c,
      event_title: c.event_title || eventsMap[c.event_id] || (c.event_id ? `Event #${c.event_id}` : "General")
    }));
  }, [comments, eventsMap, sortOption]);

  useEffect(() => {
    let mounted = true;
    let intervalId = null;
    const controller = new AbortController();

    // Fetch feedback only. Do NOT fetch names, emails or profile pictures.
    async function fetchFeedback() {
      const res = await fetchWithFallback('get_feedback.php', { signal: controller.signal }).catch(() => null);
      if (!res || !res.ok) throw new Error("Failed to load feedback");
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
          <Heading dark={darkMode} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaComments style={{ color: '#2563eb', fontSize: 20 }} />
          Comments
         </Heading>
        <SubHeading dark={darkMode}>
          Manage and Review User Comments
        </SubHeading>

        {/* Sorting control */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <label style={{ color: darkMode ? "#e5e7eb" : "#374151", fontWeight: 600 }}>Sort:</label>
          <select value={sortOption} onChange={e => setSortOption(e.target.value)} style={{ padding: "6px 10px", borderRadius: 6 }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating_desc">Top Rated</option>
            <option value="rating_asc">Lowest Rated</option>
          </select>
          <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 13 }}>
            Showing {displayedComments.length} comment{displayedComments.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Loading comments...</LoadingText>
            <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
          </LoadingOverlay>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}

        <CommentsList>
          {displayedComments.map((comment, index) => (
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

/* ---------- Dashboard-style loading components ---------- */
const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  flex-direction: column;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.12);
  border-top-color: #fff;
  animation: spin 0.9s linear infinite;
  box-shadow: 0 6px 18px rgba(2,6,23,0.12);
  margin-bottom: 12px;

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 12px;
`;

const LoadingSubtext = styled.div`
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
`;