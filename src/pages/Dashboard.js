// src/pages/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import {
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
} from 'react-icons/fa';
import {
  Container,
  Main,
  Topbar,
  TopIcons,
  Profile,
  DashboardTitle,
  Grid,
  Card,
  DescriptionModalOverlay,
  DescriptionModalContent,
  DescriptionModalTitle,
  ModalButton,
  DescriptionCell,
  SeeMoreButton,
  TableWrapper,
  StyledTable,
  ActionButtons,
  EventCard,
  ParticipantModal,
  NotificationButton,
  NotificationBadge,
  NotificationEmpty,
  NotificationTitle,
  NotificationItem
} from '../styles/DashboardStyles';
import Sidebar from '../components/Sidebar';
import styled, { createGlobalStyle } from 'styled-components';
// ADDED: fallback fetch helper
import { fetchWithFallback } from '../utils/fetchWithFallback';

const GlobalStyle = createGlobalStyle`
  body, #root {
    background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
    color: ${({ dark }) => (dark ? '#f3f5f9' : '#18181b')};
    transition: background 0.3s, color 0.3s;
  }
`;

const EventList = styled.div`
  margin-top: 2rem;
`;


const EventInfo = styled.div`
  flex: 1;
`;

const IconText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  margin: 0.25rem 0;
  font-size: 0.875rem;
`;



const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.75rem;
  background: ${({ status }) => (status === 'upcoming' ? '#dcfce7' : '#fee2e2')};
  color: ${({ status }) => (status === 'upcoming' ? '#166534' : '#991b1b')};
`;

const Button = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { background: #1d4ed8; }
`;

const SearchBar = styled.input`
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 350px;
  display: block;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Thead = styled.thead`
  background: #3b82f6;
  color: white;

  th {
    padding: 0.75rem;
    font-size: 0.875rem;
    text-align: left;
    font-weight: 600;
  }
`;

const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
    }
  }

  td {
    padding: 0.75rem;
    font-size: 0.875rem;
    color: #374151;
  }
`;

// New: modal variant that appears above the activities modal
const TopModal = styled(ParticipantModal)`
  z-index: 3000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;



const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
`;

const ParticipantCard = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  margin-bottom: 0.75rem;
  border: 1px solid #e2e8f0;
`;

/* ---------- Pagination styled components ---------- */
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ArrowButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  &:hover:not(:disabled) { background: #1d4ed8; }
  &:disabled { background: #9ca3af; cursor: not-allowed; }
`;

const PageIndicator = styled.span`
  font-size: 0.95rem;
  color: #374151;
  font-weight: 600;
`;

/* ---------- Event filter styled components ---------- */
const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  transition: all 0.2s;
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }
`;

/* ---------- Notification Modal styled components ---------- */
const NotificationModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 3500;
  padding: 3.5rem 1rem 1rem;
  backdrop-filter: blur(4px);
`;

const NotificationModalBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 460px;
  max-height: 72vh;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(2,6,23,0.12);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(15,23,42,0.04);
`;

/* Header: more distinct, cleaner close button (removed the close button — notification icon now toggles open/close) */
const NotificationHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(15,23,42,0.04);
  background: linear-gradient(90deg, rgba(59,130,246,0.06), rgba(37,99,235,0.04));
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-start; /* changed from space-between since we removed the close button */
  position: sticky;
  top: 0;
  z-index: 2;
`;

/* Title uses slightly larger weight for hierarchy */

/* Scrollable list with more breathing room */
const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: rgba(15,23,42,0.02); border-radius: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.06); border-radius: 6px; }
`;

const NotificationItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

/* Main name style (slightly larger / bolder) */
const NotificationItemUser = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
`;

/* Modern, subtle badge replacing bulky 'New' tag */
const NotificationNewPill = styled.span`
  background: rgba(245,158,11,0.10);
  color: #b45309;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  letter-spacing: 0.2px;
`;

/* Body: more readable font sizing and color contrast */
const NotificationItemBody = styled.p`
  margin: 0;
  font-size: 0.92rem;
  color: #1f2937;
  line-height: 1.35;
  max-height: 3.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* Timestamp / secondary info: smaller and muted */
const NotificationItemTime = styled.span`
  display: block;
  font-size: 0.78rem;
  color: #6b7280;
  margin-top: 4px;
`;

/* Footer with prominent action, sticky and roomy */
const NotificationFooter = styled.div`
  padding: 14px;
  border-top: 1px solid rgba(15,23,42,0.04);
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.98));
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  position: sticky;
  bottom: 0;
  z-index: 3;
`;

/* Reuse Button but make it more prominent when used in footer */
const FooterCTA = styled(Button)`
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  border-radius: 10px;
  background: linear-gradient(90deg,#2563eb,#1d4ed8);
  box-shadow: 0 8px 26px rgba(37,99,235,0.18);

  &:hover { transform: translateY(-1px); }
`;

/* ---------- MISSING: Loading & Empty state styled components ---------- */
const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  padding: 1rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.12);
  border-top-color: #fff;
  animation: spin 0.9s linear infinite;
  box-shadow: 0 6px 18px rgba(2,6,23,0.12);

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* small spinner for buttons */
const ButtonSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
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


const LeaderboardContainer = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const LeaderboardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const LeaderboardThead = styled.thead`
  background: #f3f4f6;
  
  th {
    padding: 0.75rem;
    font-size: 0.875rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
  }
`;

const LeaderboardTbody = styled.tbody`
  tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background 0.2s;
    
    &:hover {
      background: #f9fafb;
    }
    
    &:nth-child(1) {
      background: rgba(251, 191, 36, 0.05);
    }
    
    &:nth-child(2) {
      background: rgba(192, 192, 192, 0.05);
    }
    
    &:nth-child(3) {
      background: rgba(205, 127, 50, 0.05);
    }
  }
  
  td {
    padding: 0.75rem;
    font-size: 0.875rem;
    color: #374151;
  }
`;

const RankBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: 700;
  color: white;
  background: ${props => {
    if (props.rank === 1) return '#fbbf24';
    if (props.rank === 2) return '#d1d5db';
    if (props.rank === 3) return '#d97706';
    return '#3b82f6';
  }};
`;

const PointsBadge = styled.span`
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const Dashboard = () => {
  const [youthCount, setYouthCount] = useState(0);
  const [youthIncrease, setYouthIncrease] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [eventIncrease, setEventIncrease] = useState(0);
  const [aiUsage, setAiUsage] = useState(0);
  const [aiUsageIncrease, setAiUsageIncrease] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem('skonnect_dark_mode');
    return saved === 'true';
  });
  const [engagementCount, setEngagementCount] = useState(0);
  const [engagementIncrease, setEngagementIncrease] = useState(0);
  const [events, setEvents] = useState([]); // Ensure this is initialized as an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [participantsModal, setParticipantsModal] = useState(false);
  const [selectedEventParticipants, setSelectedEventParticipants] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [selectedEventAttendance, setSelectedEventAttendance] = useState([]);
  const [selectedAttendanceTitle, setSelectedAttendanceTitle] = useState('');
  const [subEventsModal, setSubEventsModal] = useState(false);
  const [selectedEventSubEvents, setSelectedEventSubEvents] = useState([]);
  const [selectedSubEventsTitle, setSelectedSubEventsTitle] = useState('');
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedDescriptionTitle, setSelectedDescriptionTitle] = useState(''); /* ---------- NEW: Notification modal states ---------- */
  const [notificationModal, setNotificationModal] = useState(false);      // Toggle notification modal visibility
  const [comments, setComments] = useState([]);                            // Array of all comments from API
  const [commentsInitialLoaded, setCommentsInitialLoaded] = useState(false);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [unreadComments, setUnreadComments] = useState(0);
  const [readCommentIds, setReadCommentIds] = useState(new Set());
  const [newUsers, setNewUsers] = useState([]);
  const [readUserIds, setReadUserIds] = useState(new Set());
  const [unreadUsers, setUnreadUsers] = useState(0);
  const [usersInitialLoaded, setUsersInitialLoaded] = useState(false);
const [leaderboard, setLeaderboard] = useState([]);
const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  // per-button loading keys stored in a Set
  const [loadingKeys, setLoadingKeys] = useState(new Set());
  // helpers to manage per-button loading state
  const startLoading = (key) => {
    setLoadingKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const stopLoading = (key) => {
    setLoadingKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const isLoadingKey = (key) => loadingKeys.has(key);
  // Persist removed comments so they stay removed across refreshes
  const [removedCommentIds, setRemovedCommentIds] = useState(() => {
    try {
      const raw = localStorage.getItem('skonnect_removed_comments');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  // ref to keep previous raw count between intervals without causing re-renders
  const prevRawCountRef = useRef(0);
  const prevUserCountRef = useRef(0);
  // NEW: Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadedDataCount, setLoadedDataCount] = useState(0);

  // ===== helper to truncate by characters (define inside component, before return) =====
  const truncateDescription = (text, limit = 100) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };


  // Pagination states (you already had this, keeping 6 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  // NEW: status filter default to 'upcoming'
  const [statusFilter, setStatusFilter] = useState('upcoming');

  useEffect(() => {
    setIsLoading(true);
    setLoadedDataCount(0);
    
    Promise.all([
      fetchWithFallback('youth_count.php')
        .then(res => res.json())
        .then(data => {
          setYouthCount(data.count);
          setYouthIncrease(data.increase_percent);
          setLoadedDataCount(prev => prev + 1);
        })
        .catch(err => {
          setYouthCount(0);
          setYouthIncrease(0);
          setLoadedDataCount(prev => prev + 1);
        }),
      
      fetchWithFallback('main_event_count.php')
        .then(res => res.json())
        .then(data => {
          setEventCount(data.count);
          setEventIncrease(data.increase_percent);
          setLoadedDataCount(prev => prev + 1);
        })
        .catch(err => {
          setEventCount(0);
          setEventIncrease(0);
          setLoadedDataCount(prev => prev + 1);
        }),
      
      fetchWithFallback('ai_usage.php')
        .then(res => res.json())
        .then(data => {
          setAiUsage(data.total);
          setAiUsageIncrease(data.percent_change);
          setLoadedDataCount(prev => prev + 1);
        })
        .catch(err => {
          setAiUsage(0);
          setAiUsageIncrease(0);
          setLoadedDataCount(prev => prev + 1);
        }),
      
      fetchWithFallback('total_engagements.php')
        .then(res => res.json())
        .then(data => {
          setEngagementCount(data.total || 0);
          setEngagementIncrease(typeof data.percent_change !== 'undefined' ? data.percent_change : 0);
          setLoadedDataCount(prev => prev + 1);
        })
        .catch(err => {
          setEngagementCount(0);
          setEngagementIncrease(0);
          setLoadedDataCount(prev => prev + 1);
        }),
      
      fetchWithFallback('fetch_main_events.php')
        .then(async res => {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.status === 'success' && Array.isArray(data.main_events)) {
              setEvents(data.main_events);
            } else {
              console.error("Fetched data is not valid:", data);
              setEvents([]);
            }
          } catch {
            console.error("Invalid JSON from API:", text);
            setEvents([]);
          }
          setLoadedDataCount(prev => prev + 1);
        })
        .catch(err => {
          console.error("Failed to fetch events", err);
          setEvents([]);
          setLoadedDataCount(prev => prev + 1);
        })
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true);
      const res = await fetchWithFallback('get_youth_users.php', { cache: 'no-store' });
      if (!res.ok) throw new Error('Users fetch failed');
      const users = await res.json();

      // Normalize response
      let usersList = [];
      if (Array.isArray(users)) usersList = users;
      else if (Array.isArray(users.users)) usersList = users.users;
      else if (Array.isArray(users.youth_users)) usersList = users.youth_users;
      else if (Array.isArray(users.data)) usersList = users.data;

      // Fetch points for each user
      const usersWithPoints = await Promise.all(
        usersList.map(async (user) => {
          try {
            const pointsRes = await fetchWithFallback('fetch_total_points.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `user_id=${user.id}`
            });
            const pointsData = await pointsRes.json();
            return {
              ...user,
              points: pointsData.total_points || 0
            };
          } catch (err) {
            console.error(`Failed to fetch points for user ${user.id}:`, err);
            return { ...user, points: 0 };
          }
        })
      );

      // Sort by points descending and take top 10
      const sorted = usersWithPoints
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);

      setLeaderboard(sorted);
      setLeaderboardLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboard([]);
      setLeaderboardLoading(false);
    }
  };

  fetchLeaderboard();
  // Refresh leaderboard every 30 seconds
  const intervalId = setInterval(fetchLeaderboard, 30000);

  return () => clearInterval(intervalId);
}, []);

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    async function fetchCommentsCount() {
      try {
        // Replace polling fetch for comments
        const res = await fetchWithFallback('get_feedback.php', { cache: 'no-store' });
        if (!res.ok) throw new Error('Comments fetch failed');
        const data = await res.json();

        // Normalize response shape to get an array of comments
        let commentsList = [];
        if (Array.isArray(data)) commentsList = data;
        else if (Array.isArray(data.comments)) commentsList = data.comments;
        else if (Array.isArray(data.feedback)) commentsList = data.feedback;
        else if (Array.isArray(data.data)) commentsList = data.data;
        else {
          // find first array value if present
          for (const k of Object.keys(data || {})) {
            if (Array.isArray(data[k])) { commentsList = data[k]; break; }
          }
        }

        // Debug log first fetch shape (remove if not needed)
        if (prevRawCountRef.current === 0) console.debug('comments API response (normalized):', commentsList);

        // Read removed IDs from localStorage each fetch to stay in sync
        let removedFromStorage = [];
        try {
          removedFromStorage = JSON.parse(localStorage.getItem('skonnect_removed_comments') || '[]');
        } catch (e) {
          removedFromStorage = [];
        }
        const removedSet = new Set(removedFromStorage);

        if (!mounted) return;

        const rawCount = commentsList.length;
        // visible comments exclude locally removed IDs
        const visibleComments = commentsList.filter(c => c && !removedSet.has(c.id));
        // update displayed comments
        setComments(visibleComments);

        // first-time initialization
        if (!commentsInitialLoaded) {
          prevRawCountRef.current = rawCount;
          setCommentsTotal(rawCount);
          setCommentsInitialLoaded(true);
          // unread is zero on first load (we treat existing as already seen)
          setUnreadComments(0);
          return;
        }

        // detect newly added raw comments (server-side)
        if (rawCount > prevRawCountRef.current) {
          const added = rawCount - prevRawCountRef.current;
          // increment unread badge by the number of new raw entries (they will be filtered if removed locally)
          setUnreadComments(prev => prev + added);
        }

        prevRawCountRef.current = rawCount;
        setCommentsTotal(rawCount);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }

    // perform initial fetch and start polling
    fetchCommentsCount();
    intervalId = setInterval(fetchCommentsCount, 8000);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
    // include readCommentIds in deps only to get fresh value when user marks reads
  }, [readCommentIds]);

  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    async function fetchNewUsers() {
      try {
        const res = await fetchWithFallback('get_youth_users.php', { cache: 'no-store' });
        if (!res.ok) throw new Error('Users fetch failed');
        const data = await res.json();

        // Normalize response shape
        let usersList = [];
        if (Array.isArray(data)) usersList = data;
        else if (Array.isArray(data.users)) usersList = data.users;
        else if (Array.isArray(data.youth_users)) usersList = data.youth_users;
        else if (Array.isArray(data.data)) usersList = data.data;
        else {
          for (const k of Object.keys(data || {})) {
            if (Array.isArray(data[k])) { usersList = data[k]; break; }
          }
        }

        if (!mounted) return;

        const rawCount = usersList.length;

        // first-time initialization
        if (!usersInitialLoaded) {
          prevUserCountRef.current = rawCount;
          setUsersInitialLoaded(true);
          setUnreadUsers(0);
          setNewUsers([]);
          return;
        }

        // detect newly added users
        if (rawCount > prevUserCountRef.current) {
          const added = rawCount - prevUserCountRef.current;
          // Get the latest added users (assuming they're ordered by date)
          const recentUsers = usersList.slice(0, added);
          setNewUsers(recentUsers);
          setUnreadUsers(prev => prev + added);
        }

        prevUserCountRef.current = rawCount;
      } catch (err) {
        console.error('Error fetching new users:', err);
      }
    }

    // perform initial fetch and start polling
    fetchNewUsers();
    intervalId = setInterval(fetchNewUsers, 15000); // Poll every 15 seconds

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [usersInitialLoaded]);

  useEffect(() => {
    localStorage.setItem('skonnect_dark_mode', darkMode);
  }, [darkMode]);

  // Filter events based on search + status
  const filteredEvents = events.filter(ev => {
    const matchesText = (ev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const evStatus = (ev.status || 'upcoming'); // fallback if DB missing
    const matchesStatus = statusFilter === 'all' ? true : (evStatus === statusFilter);
    return matchesText && matchesStatus;
  });

  // Reset page when filter/search/events change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, events.length, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  // participants, attendance, sub-events functions
  const handleSeeParticipants = async (subEvent) => {
    try {
      const key = `participants_${subEvent.id}`;
      startLoading(key);
      const response = await fetchWithFallback(`fetch_event_responses.php?sub_event_id=${subEvent.id}`);
      const data = await response.json();
      setSelectedEventParticipants(data.participants || []);
      setSelectedEventTitle(subEvent.title);
      setParticipantsModal(true);
      stopLoading(key);
    } catch (err) {
      stopLoading(`participants_${subEvent.id}`);
      console.error('Failed to fetch participants:', err);
    }
  };

  const handleShowAttendance = async (subEvent) => {
    try {
      const id = subEvent?.id ?? 0;
      if (!id) return;

      const key = `attendance_${id}`;
      startLoading(key);
      const res = await fetchWithFallback(`fetch_attendance.php?subevent_id=${id}`);
      const data = await res.json();

      if (!data || !data.success) {
        console.error('Failed to fetch attendance', data);
        setSelectedEventAttendance([]);
      } else {
        // Normalize timestamps for display
        const attendance = (data.attendance || []).map(a => ({
          ...a,
          timestamp: a.timestamp ? new Date(a.timestamp).toLocaleString() : null,
          created_at: a.created_at ? new Date(a.created_at).toLocaleString() : null
        }));
        setSelectedEventAttendance(attendance);
      }

      setSelectedAttendanceTitle(subEvent.title || '');
      setAttendanceModal(true);
      stopLoading(key);
    } catch (err) {
      stopLoading(`attendance_${subEvent?.id ?? 0}`);
      console.error('Failed to fetch attendance:', err);
      setSelectedEventAttendance([]);
      setSelectedAttendanceTitle(subEvent?.title || '');
      setAttendanceModal(true);
    }
  };
  const maskName = (name) => {
  if (!name || name.length === 0) return '***';
  if (name.length <= 2) return '*'.repeat(name.length);
  // Show first letter and last letter, mask the rest
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

  // NEW: mark main event as done
  const handleMarkEventDone = async (eventItem) => {
    try {
      const key = `done_${eventItem.id}`;
      startLoading(key);
      const res = await fetchWithFallback('update_main_event_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventItem.id, status: 'done' })
      });
      const data = await res.json();
      if (data && data.success) {
        // update local events state so UI reflects change immediately
        setEvents(prev => prev.map(ev => ev.id === eventItem.id ? { ...ev, status: 'done' } : ev));
      } else {
        console.error('Failed to update event status', data);
      }
      stopLoading(key);
    } catch (err) {
      stopLoading(`done_${eventItem.id}`);
      console.error('Error updating event status:', err);
    }
  };

  const handleViewActivities = async (event) => {
    try {
      const key = `view_${event.id}`;
      startLoading(key);
      const response = await fetchWithFallback(`get_sub_events.php?event_id=${event.id}`);
      const data = await response.json();
      setSelectedEventSubEvents(data.subevents || []);
      setSelectedSubEventsTitle(event.title);
      setSubEventsModal(true);
      stopLoading(key);
    } catch (err) {
      stopLoading(`view_${event.id}`);
      console.error('Failed to fetch sub-events:', err);
    }
  };

  /* ---------- NEW: Handle opening notification modal ---------- */
  const handleToggleNotificationModal = () => {
    setNotificationModal(prev => {
      const next = !prev;
      if (next) {
        // Clear unread badges
        setUnreadComments(0);
        setUnreadUsers(0);
        // Mark all currently loaded comments & users as read
        setReadCommentIds(prevSet => {
          const newSet = new Set(prevSet);
          comments.forEach(c => newSet.add(c.id));
          return newSet;
        });
        setReadUserIds(prevSet => {
          const newSet = new Set(prevSet);
          newUsers.forEach(u => newSet.add(u.id));
          return newSet;
        });
      }
      return next;
    });
  };
  
  /* ---------- NEW: Handle clicking on a notification item ---------- */
  const handleNotificationClick = (commentId) => {
    // Mark the clicked comment as read
    setReadCommentIds(prev => new Set([...prev, commentId]));

    // Persist removal locally so comment stays removed after refresh
    setRemovedCommentIds(prevSet => {
      const newSet = new Set(prevSet);
      newSet.add(commentId);
      try {
        localStorage.setItem('skonnect_removed_comments', JSON.stringify(Array.from(newSet)));
      } catch (e) { /* ignore storage errors */ }
      return newSet;
    });

    // Remove it from the currently-rendered comments immediately
    setComments(prev => prev.filter(c => c.id !== commentId));

    // Close modal and navigate
    setNotificationModal(false);
    window.location.href = '/comments';
  };

  const handleUserNotificationClick = (userId) => {
    // Mark the clicked user as read
    setReadUserIds(prev => new Set([...prev, userId]));
    // Remove from new users list
    setNewUsers(prev => prev.filter(u => u.id !== userId));
    // Close modal and navigate to users page
    setNotificationModal(false);
    window.location.href = '/youths';
  };

  // Get list of unread comments for badge display
  const unreadCommentsData = comments.filter(c => !readCommentIds.has(c.id));
  const unreadUsersData = newUsers.filter(u => !readUserIds.has(u.id));
  const totalUnread = unreadComments + unreadUsers;

  return (
    <>
      <GlobalStyle dark={darkMode} />
      
      {/* Loading Animation */}
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>Loading Dashboard...</LoadingText>
          <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
        </LoadingOverlay>
      )}

      <Container style={darkMode ? { background: '#18181b', color: '#f3f5f9' } : {}}>

        {/* ---------- IMPROVED: Notification Modal (opens when bell icon clicked) ---------- */}
        {notificationModal && (
          <NotificationModalOverlay onClick={() => setNotificationModal(false)}>
            <NotificationModalBox onClick={e => e.stopPropagation()}>
              {/* Modal header with title (close button removed) */}
               <NotificationHeader>
                <NotificationTitle>
                 🔔 Notifications
                </NotificationTitle>
              </NotificationHeader>

              {/* Scrollable list of notifications */}
              <NotificationList>
                {comments.length === 0 && newUsers.length === 0 ? (
                  // Empty state message
                  <NotificationEmpty>
                    <div style={{ fontSize: '2.5rem' }}>📭</div>
                    <p>No notifications yet.</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      When users leave feedback or new members join, it will appear here.
                    </p>
                  </NotificationEmpty>
                ) : (
                  <>
                    {/* New Users Section */}
                    {newUsers.length > 0 && (
                      <>
                        <div style={{ padding: '12px 0', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          👤 New Members
                        </div>
                        {newUsers.map(user => {
                          const isNew = !readUserIds.has(user.id);
                          return (
                            <NotificationItem
                              key={`user_${user.id}`}
                              isNew={isNew}
                              onClick={() => handleUserNotificationClick(user.id)}
                              aria-label={`New user: ${user.first_name} ${user.last_name}`}
                            >
                              <NotificationItemTitle>
                                <NotificationItemUser>
                                  {user.first_name} {user.last_name}
                                </NotificationItemUser>
                                {isNew && <NotificationNewPill aria-hidden="true">new</NotificationNewPill>}
                              </NotificationItemTitle>
                              <NotificationItemBody>
                                📧 {user.email}
                              </NotificationItemBody>
                              <NotificationItemTime>
                                📱 {user.contact || 'No contact'}
                              </NotificationItemTime>
                            </NotificationItem>
                          );
                        })}
                      </>
                    )}

                    {/* Comments Section */}
                    {comments.length > 0 && (
                      <>
                        <div style={{ padding: '12px 0', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          💬 Comments
                        </div>
                        {comments.map(comment => {
                          const isNew = !readCommentIds.has(comment.id);
                          const commentTime = comment.created_at 
                            ? new Date(comment.created_at).toLocaleString() 
                            : 'Unknown time';

                          return (
                            <NotificationItem
                              key={comment.id}
                              isNew={isNew}
                              onClick={() => handleNotificationClick(comment.id)}
                              aria-label={`Open comment from ${comment.name || 'Anonymous'}`}
                            >
                              <NotificationItemTitle>
                                <NotificationItemUser>
                                  {'Anonymous'}
                                </NotificationItemUser>

                                {isNew && <NotificationNewPill aria-hidden="true">new</NotificationNewPill>}
                              </NotificationItemTitle>

                              <NotificationItemBody>
                                {comment.message 
                                  ? comment.message.length > 160 ? comment.message.substring(0, 160) + '…' : comment.message
                                  : '📝 No message content'
                                }
                              </NotificationItemBody>

                              <NotificationItemTime>⏰ {commentTime}</NotificationItemTime>
                            </NotificationItem>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </NotificationList>

              {/* Footer with call-to-action */}
              {(comments.length > 0 || newUsers.length > 0) && (
                <NotificationFooter>
                  <FooterCTA 
                    onClick={() => {
                      setNotificationModal(false);
                      window.location.href = '/comments';
                    }}
                  >
                    View All Notifications →
                  </FooterCTA>
                </NotificationFooter>
              )}
            </NotificationModalBox>
          </NotificationModalOverlay>
        )}

        <Sidebar darkMode={darkMode} />
        <Main>

        <Topbar>
          <DashboardTitle>
            <h2>Dashboard</h2>
            <p>Hi, Admin. Welcome back to SKonnect Admin!</p>
          </DashboardTitle>

          {/* ---------- IMPROVED: Notification Bell Button (top-right corner) ---------- */}
               <NotificationButton
          aria-label="Notifications"
          onClick={handleToggleNotificationModal}
          style={{ position: 'relative' }}
          title={totalUnread > 0 ? `${totalUnread} new notification(s)` : 'No new notifications'}
        >
          <FaBell />
          {totalUnread > 0 && (
            <NotificationBadge>{totalUnread > 99 ? '99+' : totalUnread}</NotificationBadge>
          )}
        </NotificationButton>

        </Topbar>
        
          <Grid>
            {[
              {
                img: "https://cdn-icons-png.flaticon.com/512/3790/3790347.png",
                value: youthCount,
                label: "Total Youths",
                change: youthIncrease,
                iconUp: <FaArrowUp />,
                iconDown: <FaArrowDown />
              },
              {
                img: "https://static.vecteezy.com/system/resources/previews/016/314/814/original/transparent-event-schedule-icon-free-png.png",
                value: eventCount,
                label: "Total Events",
                change: eventIncrease,
                iconUp: <FaArrowUp />,
                iconDown: <FaArrowDown />
              },
              {
                img: "https://static.vecteezy.com/system/resources/previews/025/729/534/original/esports-fan-engagement-icon-in-illustration-vector.jpg",
                value: engagementCount,
                label: "Total Engagements",
                change: engagementIncrease,
                iconUp: <FaArrowUp />,
                iconDown: <FaArrowDown />
              },
              {
                img: "https://static.vecteezy.com/system/resources/previews/029/453/197/original/ai-and-human-interaction-icon-vector.jpg",
                value: aiUsage,
                label: "AI Interactions",
                change: aiUsageIncrease,
                iconUp: <FaArrowUp />,
                iconDown: <FaArrowDown />
              }
            ].map((card) => (
              <Card key={card.label}>
                <img src={card.img} draggable={false} />
                <div className="details">
                  <h4>{card.value}</h4>
                  <p>{card.label}</p>
                  <div className={`change ${card.change >= 0 ? 'up' : 'down'}`}>
                    {card.change >= 0 ? card.iconUp : card.iconDown}
                    {Math.abs(card.change)}% (30 days)
                  </div>
                </div>
              </Card>
            ))}
          </Grid>

          {/* NEW: Leaderboard Section */}
          <LeaderboardContainer>
            <LeaderboardTitle>
              🏆 Top Performers
            </LeaderboardTitle>
            
            {leaderboardLoading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
                Loading leaderboard...
              </p>
            ) : leaderboard.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
                No users with points yet.
              </p>
            ) : (
              <LeaderboardTable>
                <LeaderboardThead>
                  <tr>
                    <th style={{ width: '10%' }}>Rank</th>
                    <th style={{ width: '40%' }}>Name</th>
                    <th style={{ width: '30%' }}>Email</th>
                    <th style={{ width: '20%', textAlign: 'right' }}>Points</th>
                  </tr>
                </LeaderboardThead>
             <LeaderboardTbody>
  {leaderboard.map((user, idx) => (
    <tr key={user.id}>
      <td>
        <RankBadge rank={idx + 1}>
          {idx + 1}
        </RankBadge>
      </td>
      <td>
        <strong>
          {maskName(user.first_name)} {maskName(user.last_name)}
        </strong>
      </td>
      <td>{maskName(user.email)}</td>
      <td style={{ textAlign: 'right' }}>
        <PointsBadge>{user.points}</PointsBadge>
      </td>
    </tr>
  ))}
</LeaderboardTbody>
              </LeaderboardTable>
            )}
          </LeaderboardContainer>

          {/* Add Events List */}
          <EventList>
            <h3 style={{ color: '#1f2937', fontWeight: '700', marginBottom: '1rem' }}>
              📋 Events
            </h3>

            {/* Filter bar: default is "upcoming" */}
            <FilterBar>
              <FilterButton active={statusFilter === 'upcoming'} onClick={() => setStatusFilter('upcoming')}>
                Upcoming
              </FilterButton>
              <FilterButton active={statusFilter === 'done'} onClick={() => setStatusFilter('done')}>
                Done
              </FilterButton>
              <FilterButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                All
              </FilterButton>
            </FilterBar>

            <SearchBar
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredEvents.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
                {searchTerm ? 'No events found matching your search.' : 'No events found.'}
              </p>
            ) : (
              <>
                <TableWrapper>
                <StyledTable>
                  <Thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {currentEvents.map((ev) => (
                      <tr key={ev.id}>
                        <td>{ev.title}</td>
                        <DescriptionCell>
                          {ev.description && ev.description.length > 100 ? (
                            <>
                              {truncateDescription(ev.description, 100)}{' '}
                              <SeeMoreButton
                                onClick={() => {
                                  setSelectedDescription(ev.description);
                                  setSelectedDescriptionTitle(ev.title);
                                  setDescriptionModal(true);
                                }}
                              >
                                See more...
                              </SeeMoreButton>
                            </>
                          ) : (
                            ev.description
                          )}
                        </DescriptionCell>
                        <td>
                          {(ev.status || 'upcoming') === 'upcoming' ? (
                            <StatusBadge status="upcoming">Upcoming</StatusBadge>
                          ) : (
                            <StatusBadge status="done">Done</StatusBadge>
                          )}
                        </td>
                        <td>
                          <ActionButtons>
                            <Button
                              onClick={() => handleViewActivities(ev)}
                              style={{
                                background: '#3b82f6',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {isLoadingKey(`view_${ev.id}`) && <ButtonSpinner />}
                              🎯 View Activities
                            </Button>

                            { (ev.status || 'upcoming') !== 'done' && (
                              <Button
                                onClick={() => handleMarkEventDone(ev)}
                                style={{
                                  background: '#10b981',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {isLoadingKey(`done_${ev.id}`) && <ButtonSpinner />}
                                ✅ Done Event
                              </Button>
                            )}
                          </ActionButtons>
                        </td>
                      </tr>
                    ))}
                  </Tbody>
                </StyledTable>
              </TableWrapper>


                {/* Pagination controls */}
                <PaginationContainer>
                  <ArrowButton onClick={handlePrevPage} disabled={currentPage === 1}>
                    <FaChevronLeft /> Prev
                  </ArrowButton>

                  <PageIndicator>
                    Page {currentPage} of {totalPages}
                  </PageIndicator>

                  <ArrowButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next <FaChevronRight />
                  </ArrowButton>
                </PaginationContainer>
              </>
            )}
          </EventList>

          {/* Participants Modal */}
          {participantsModal && (
            <TopModal onClick={() => setParticipantsModal(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>👥 Participants - {selectedEventTitle}</ModalTitle>
                {selectedEventParticipants.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>No participants found.</p>
                ) : (
                  selectedEventParticipants.map((p, idx) => (
                    <ParticipantCard key={idx}>
                      <p style={{ marginBottom: 8, color: '#2563eb', fontWeight: 600 }}>
                        <span style={{ color: '#334155' }}><strong>Email:</strong></span> {p.email}
                      </p>
                      {Object.entries(p.responses || {}).map(([label, value]) => (
                        <p key={label} style={{ margin: 0, color: '#334155' }}>
                          <strong>{label}:</strong> {value}
                        </p>
                      ))}
                    </ParticipantCard>
                  ))
               )}
                <Button onClick={() => setParticipantsModal(false)} style={{ marginTop: '1.5rem', width: '100%' }}>
                  Close
                </Button>
              </ModalContent>
            </TopModal>
          )}

          {/* Attendance Modal */}
          {attendanceModal && (
            <TopModal onClick={() => setAttendanceModal(false)}>
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>📝 Attendance - {selectedAttendanceTitle}</ModalTitle>
                {selectedEventAttendance.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>No attendance found.</p>
                ) : (
                  selectedEventAttendance.map((a, idx) => (
                    <ParticipantCard key={idx}>
                      <p style={{ marginBottom: 8, color: '#2563eb', fontWeight: 600 }}>
                        <span style={{ color: '#334155' }}><strong>Name:</strong></span> {a.full_name}
                      </p>
                      <p style={{ margin: 0, color: '#334155' }}>
                        <strong>User ID:</strong> {a.user_id}
                      </p>
                      <p style={{ margin: 0, color: '#334155' }}>
                        <strong>Date:</strong> {a.timestamp}
                      </p>
                    </ParticipantCard>
                  ))
                )}
                <Button onClick={() => setAttendanceModal(false)} style={{ marginTop: '1.5rem', width: '100%' }}>
                  Close
                </Button>
              </ModalContent>
            </TopModal>
          )}

          {/* Sub-events Modal */}
          {subEventsModal && (
            <ParticipantModal onClick={() => setSubEventsModal(false)}>
              <ModalContent onClick={e => e.stopPropagation()} style={{ width: '95%', maxWidth: '800px' }}>
                <ModalTitle>🎯 Activities - {selectedSubEventsTitle}</ModalTitle>
                {selectedEventSubEvents.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', margin: '2rem 0' }}>No activities found.</p>
                ) : (
                  selectedEventSubEvents.map((sub, idx) => (
                    <ParticipantCard key={idx} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2563eb', marginBottom: '0.5rem' }}>
                          {sub.title}
                          <StatusBadge status={sub.status}>
                            {sub.status === 'upcoming' ? 'Upcoming' : 'Done'}
                          </StatusBadge>
                        </h4>
                        <p style={{ color: '#475569', marginBottom: '0.75rem' }}>{sub.description}</p>
                        <IconText><FaCalendarAlt /> {sub.date}</IconText>
                        <IconText><FaClock /> {sub.time}</IconText>
                        <IconText><FaMapMarkerAlt /> {sub.location}</IconText>
                        <IconText>
                          <strong style={{ color: '#2563eb' }}>Type:</strong> {sub.event_type}
                        </IconText>
                        <IconText>
                          <strong style={{ color: '#2563eb' }}>Points:</strong> {sub.points}
                        </IconText>

                        {/* Participant & attendance buttons */}
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <Button onClick={() => handleSeeParticipants(sub)}>
                            {isLoadingKey(`participants_${sub.id}`) && <ButtonSpinner />}
                            <FaUsers /> See Participants
                          </Button>
                          <Button onClick={() => handleShowAttendance(sub)}>
                            {isLoadingKey(`attendance_${sub.id}`) && <ButtonSpinner />}
                            📝 Show Attendance
                          </Button>
                        </div>
                      </div>
                    </ParticipantCard>

                  ))
                )}
                <Button onClick={() => setSubEventsModal(false)} style={{ marginTop: '1.5rem', width: '100%' }}>
                  Close
                </Button>
              </ModalContent>
            </ParticipantModal>
          )}
          {descriptionModal && (
          <DescriptionModalOverlay onClick={() => setDescriptionModal(false)}>
            <DescriptionModalContent onClick={(e) => e.stopPropagation()}>
              <DescriptionModalTitle>
                📝 Description - {selectedDescriptionTitle}
              </DescriptionModalTitle>
              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {selectedDescription}
              </p>
              <ModalButton
                onClick={() => setDescriptionModal(false)}
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                Close
              </ModalButton>
            </DescriptionModalContent>
          </DescriptionModalOverlay>
        )}
        </Main>
      </Container>
    </>
  );
};

export default Dashboard;
