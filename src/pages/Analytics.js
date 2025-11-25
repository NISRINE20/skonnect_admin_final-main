import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaCommentAlt, FaGift, FaCog, FaSearch, FaDownload, FaEllipsisV, FaArrowUp, FaArrowDown, FaPaperPlane, FaRobot, FaSpinner } from 'react-icons/fa';
import {
  Container,
  Main,
  Topbar,
  SearchForm,
  SearchInput,
  TopIcons,
  IconBtn,
  Profile,
  DashboardTitle,
  Grid,
  Card,
  PlaceholderBox
} from '../styles//DashboardStyles';
import Sidebar from '../components/Sidebar';
import styled, { createGlobalStyle } from 'styled-components';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { BarElement } from 'chart.js';
import logo from '../sklogo.png';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import gsap from 'gsap'; // <-- Import GSAP
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// --- Chatbot Styles ---
const GlobalStyle = createGlobalStyle`
  body, #root {
    background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
    color: ${({ dark }) => (dark ? '#f3f5f9' : '#18181b')};
    transition: background 0.3s, color 0.3s;
  }

  /* spinner animation used for generating indicator */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spin {
    display: inline-block;
    vertical-align: middle;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
`;


const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function PieChartYouthPerMonth() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/youth_per_month.php')
      .then(res => res.json())
      .then(res => setData(res));
  }, []);

  const chartData = {
    labels: data.map(d => monthLabels[d.month - 1]),
    datasets: [{
      data: data.map(d => d.count),
      backgroundColor: [
        '#2563eb', '#6366f1', '#f59e42', '#10b981', '#f43f5e', '#eab308',
        '#14b8a6', '#a21caf', '#f472b6', '#64748b', '#22d3ee', '#f87171'
      ],
    }]
  };

  // PieChartYouthPerMonth return (add datalabels options)
  return (
    <div className="youth-chart" style={{ maxWidth: 220, margin: '0 auto' }}>
      <Pie
        data={chartData}
        options={{
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true },
            datalabels: {
              color: '#000000',
              formatter: (value) => value,
              font: { weight: '600', size: 11 },
              anchor: 'end',
              clamp: true
            }
          }
        }}
      />
    </div>
  );
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

// Add this new component for AI Usage Line Chart
function AIUsageChart() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/ai_usage.php')
      .then(res => res.json())
      .then(res => {
        // Ensure we have monthly_data array, or use empty array as fallback
        setData(res.monthly_data || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching AI usage data:', err);
        setData([]);
        setIsLoading(false);
      });
  }, []);

  // Return loading state or error state if no data
  if (isLoading) {
    return (
      <LoadingOverlay>
        <Spinner />
        <LoadingText>Loading AI usage...</LoadingText>
        <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
      </LoadingOverlay>
    );
  }

  if (!data.length) {
    return (
      <LoadingOverlay>
        <LoadingText>No AI usage data available</LoadingText>
      </LoadingOverlay>
    );
  }

  const chartData = {
    labels: data.map(d => monthLabels[d.month - 1]),
    datasets: [{
      label: 'AI Interactions',
      data: data.map(d => d.count),
      borderColor: '#2563eb',
      backgroundColor: '#2563eb20',
      tension: 0.4,
      fill: true
    }]
  };

  // AIUsageChart options (add datalabels)
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly AI Usage' },
      datalabels: {
        color: '#0b1220',
        anchor: 'end',
        align: 'top',
        formatter: v => Number(v),
        font: { weight: '600', size: 10 }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  return (
    <div className="ai-chart" style={{ maxWidth: 520, margin: '0 auto' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// NEW: Bar chart component for engagements
function EngagementsBarChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('https://vynceianoani.helioho.st/skonnect-api/total_engagements.php')
      .then(res => res.json())
      .then(json => {
        if (!mounted) return;
        // If API returns monthly breakdown use it
        // Expecting shape: { monthly: [ { month: 1, count: 10 }, ... ] }
        if (json.monthly && Array.isArray(json.monthly) && json.monthly.length) {
          const months = json.monthly;
          const labels = months.map(m => monthLabels[(m.month || m.m) - 1] || String(m.month || m.m));
          const data = months.map(m => Number(m.count || 0));
          setChartData({
            labels,
            datasets: [{
              label: 'Engagements',
              data,
              backgroundColor: '#2563eb'
            }]
          });
        } else if (typeof json.last_30_days !== 'undefined' || typeof json.previous_30_days !== 'undefined') {
          // Fallback: show previous 30 vs last 30 days as a simple bar comparison
          const prev = Number(json.previous_30_days || 0);
          const last = Number(json.last_30_days || 0);
          setChartData({
            labels: ['Previous 30 days', 'Last 30 days'],
            datasets: [{
              label: 'Engagements (count)',
              data: [prev, last],
              backgroundColor: ['#f59e42', '#2563eb']
            }]
          });
        } else {
          setChartData(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching engagements:', err);
        if (mounted) {
          setChartData(null);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <LoadingOverlay>
        <Spinner />
        <LoadingText>Loading engagements...</LoadingText>
        <LoadingSubtext>Fetching engagements data</LoadingSubtext>
      </LoadingOverlay>
    );
  }
  if (!chartData) {
    return (
      <LoadingOverlay>
        <LoadingText>No engagement data available</LoadingText>
      </LoadingOverlay>
    );
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Total Engagements' },
      datalabels: {
        color: '#0b1220',
        anchor: 'end',
        align: 'end',
        formatter: v => Number(v),
        font: { weight: '600', size: 10 }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  return (
    <div className="engagement-chart" style={{ maxWidth: 520, margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

// NEW: Horizontal Bar chart for Events Per Month
function EventsPerMonthChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('https://vynceianoani.helioho.st/skonnect-api/main_events_per_month.php')
      .then(res => res.json())
      .then(json => {
        if (!mounted) return;
        // expecting { monthly: [ { year: 2025, month: 10, count: 5 }, ... ], total: N }
        if (json.monthly && Array.isArray(json.monthly)) {
          const labels = json.monthly.map(m => monthLabels[(m.month || 1) - 1] + ' ' + (m.year || ''));
          const data = json.monthly.map(m => Number(m.count || 0));
          setChartData({
            labels,
            datasets: [{
              label: 'Events',
              data,
              backgroundColor: '#10b981' // green to differ from other charts
            }]
          });
        } else {
          setChartData(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events per month:', err);
        if (mounted) {
          setChartData(null);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <LoadingOverlay>
        <Spinner />
        <LoadingText>Loading events data...</LoadingText>
        <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
      </LoadingOverlay>
    );
  }
  if (!chartData) {
    return (
      <LoadingOverlay>
        <LoadingText>No events data available</LoadingText>
      </LoadingOverlay>
    );
  }

  const options = {
    indexAxis: 'y', // horizontal bars (unique visual)
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Events Per Month' },
      datalabels: {
        color: '#0b1220',
        anchor: 'end',
        align: 'right',
        formatter: v => Number(v),
        font: { weight: '600', size: 10 }
      }
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
      y: { ticks: { autoSkip: false } }
    }
  };

  return (
    <div className="events-chart" style={{ maxWidth: 640, margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Add this new component after your other chart components
function SubEventsPerMonthChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('https://vynceianoani.helioho.st/skonnect-api/sub_events_per_month.php')
      .then(res => res.json())
      .then(json => {
        if (!mounted) return;
        if (json.monthly && Array.isArray(json.monthly)) {
          const labels = json.monthly.map(m => monthLabels[(m.month || 1) - 1] + ' ' + (m.year || ''));
          const data = json.monthly.map(m => Number(m.count || 0));
          setChartData({
            labels,
            datasets: [{
              label: 'Activities',
              data,
              backgroundColor: '#6366f1' // Different color to distinguish from main events
            }]
          });
        } else {
          setChartData(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities per month:', err);
        if (mounted) {
          setChartData(null);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <LoadingOverlay>
        <Spinner />
        <LoadingText>Loading activities...</LoadingText>
        <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
      </LoadingOverlay>
    );
  }
  if (!chartData) {
    return (
      <LoadingOverlay>
        <LoadingText>No activities data available</LoadingText>
      </LoadingOverlay>
    );
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Activities Per Month' },
      datalabels: {
        color: '#0b1220',
        anchor: 'end',
        align: 'right',
        formatter: v => Number(v),
        font: { weight: '600', size: 10 }
      }
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
      y: { ticks: { autoSkip: false } }
    }
  };

  return (
    <div className="activities-chart" style={{ maxWidth: 640, margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

const Analytics = () => {
  const [youthCount, setYouthCount] = useState(0);
  const [youthIncrease, setYouthIncrease] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [eventIncrease, setEventIncrease] = useState(0);
  const [aiUsage, setAiUsage] = useState(0);
  const [aiUsageIncrease, setAiUsageIncrease] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode in localStorage
    const saved = localStorage.getItem('skonnect_dark_mode');
    return saved === 'true';
  });

  // indicator for PDF generation / download
  const [isGenerating, setIsGenerating] = useState(false);

  // NEW: total engagements state
  const [engagementCount, setEngagementCount] = useState(0);
  const [engagementIncrease, setEngagementIncrease] = useState(0);

  // Add these state variables with the other useState declarations
  const [subEventsCount, setSubEventsCount] = useState(0);
  const [subEventIncrease, setSubEventIncrease] = useState(0);

  // Add inside Analytics component
  const [participantStats, setParticipantStats] = useState({
    total: 0,
    perEvent: {},
    monthlyTrend: []
  });
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    perEvent: {},
    attendanceRate: 0
  });

  // --- Chatbot State ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: false, text: "Hi! I'm Skonnect Bot. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false); // Loading state for bot response
  const chatBodyRef = useRef(null);

  // Load chat history from XAMPP database (only admin responses)
  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/chatbot_messages.php')
      .then(res => res.json())
      .then(data => {
        setChatMessages(
          data.length
            ? data.map(msg => ({
                user: msg.sender === 'user',
                text: msg.message
              }))
            : [{ user: false, text: "Hi! I'm Skonnect Bot. How can I help you today?" }]
        );
      })
      .catch(() => {
        setChatMessages([
          { user: false, text: "Hi! I'm Skonnect Bot. How can I help you today?" }
        ]);
      });
  }, []);

  // --- Chatbot Logic ---
  async function sendChatMessage(e) {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput;

    // Add user message to UI
    setChatMessages(msgs => [...msgs, { user: true, text: userMsg }]);
    setChatInput('');
    setLoading(true);

    // Save user message to DB
    fetch('https://vynceianoani.helioho.st/skonnect-api/chatbot_messages.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: 'user',
        message: userMsg
      })
    });

    // Show loading animation for bot response
    setChatMessages(msgs => [...msgs, { user: false, text: "__loading__" }]);

    try {
      // Get bot response from Railway chatbot API
      const response = await fetch('https://skonnect-ai-production-a5f1.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      const botMsg = data.response || "No response from chatbot.";

      // Remove loading animation and add bot response
      setChatMessages(msgs => {
        // Remove the last "__loading__" message
        const filtered = msgs.filter((msg, idx) => !(msg.text === "__loading__" && idx === msgs.length - 1));
        return [...filtered, { user: false, text: botMsg }];
      });

      // Save bot message to DB
      fetch('https://vynceianoani.helioho.st/skonnect-api/chatbot_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'bot',
          message: botMsg
        })
      });
    } catch (err) {
      setChatMessages(msgs => {
        const filtered = msgs.filter((msg, idx) => !(msg.text === "__loading__" && idx === msgs.length - 1));
        return [
          ...filtered,
          { user: false, text: "Sorry, I couldn't connect to the chatbot." }
        ];
      });
      fetch('https://vynceianoani.helioho.st/skonnect-api/chatbot_messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'bot',
          message: "Sorry, I couldn't connect to the chatbot."
        })
      });
    }
    setLoading(false);
  }

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/youth_count.php')
      .then(res => res.json())
      .then(data => {
        setYouthCount(data.count);
        setYouthIncrease(data.increase_percent);
      })
      .catch(err => {
        setYouthCount(0);
        setYouthIncrease(0);
      });
  }, []);

  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/main_event_count.php')
      .then(res => res.json())
      .then(data => {
        setEventCount(data.count);
        setEventIncrease(data.increase_percent);
      })
      .catch(err => {
        setEventCount(0);
        setEventIncrease(0);
      });
  }, []);

  // Add this useEffect after your other useEffect hooks to fetch AI usage data
  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/ai_usage.php')
      .then(res => res.json())
      .then(data => {
        setAiUsage(data.total);
        setAiUsageIncrease(data.percent_change);
      })
      .catch(err => {
        setAiUsage(0);
        setAiUsageIncrease(0);
      });
  }, []);

  // NEW: fetch total engagements
  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/total_engagements.php')
      .then(res => res.json())
      .then(data => {
        setEngagementCount(data.total || 0);
        setEngagementIncrease(typeof data.percent_change !== 'undefined' ? data.percent_change : 0);
      })
      .catch(err => {
        setEngagementCount(0);
        setEngagementIncrease(0);
      });
  }, []);

  // Add this useEffect to fetch sub-events stats
  useEffect(() => {
    fetch('https://vynceianoani.helioho.st/skonnect-api/sub_events_stats.php')
      .then(res => res.json())
      .then(data => {
        if (!data || !data.success) {
          setSubEventsCount(0);
          setSubEventIncrease(0);
          return;
        }
        // use total (all-time) for summary and current_month/last_month for percent logic
        setSubEventsCount(data.total ?? 0);

        // prefer explicit increase_percent returned by API
        if (typeof data.increase_percent !== 'undefined' && data.increase_percent !== null) {
          setSubEventIncrease(Number(data.increase_percent));
        } else if ((data.last_month ?? 0) === 0 && (data.current_month ?? 0) > 0) {
          // fallback if API didn't return percent but current>0 and last==0
          setSubEventIncrease(100);
        } else {
          setSubEventIncrease(0);
        }
      })
      .catch(err => {
        console.error('Error fetching sub-events stats:', err);
        setSubEventsCount(0);
        setSubEventIncrease(0);
      });
  }, []);
  
  // === Reviews state & data merge (from get_feedback.php + get_pictures.php) ===
  const [reviews, setReviews] = useState([]);
  const [avatarsByEmail, setAvatarsByEmail] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('https://vynceianoani.helioho.st/skonnect-api/get_feedback.php').then(r => r.json()).catch(() => []),
      fetch('https://vynceianoani.helioho.st/skonnect-api/get_pictures.php').then(r => r.json()).catch(() => [])
    ]).then(([fb, pics]) => {
      if (!mounted) return;
      // build avatar map by email (lowercase) - keep but do NOT expose names/emails in UI
      const map = {};
      (Array.isArray(pics) ? pics : []).forEach(p => {
        if (p.email) map[String(p.email).toLowerCase()] = p.image || null;
      });
      setAvatarsByEmail(map);

      // Normalize feedback but anonymize name/email/avatar for privacy
      const normalized = (Array.isArray(fb) ? fb : []).map(r => ({
        id: r.id,
        name: 'Anonymous User',                // forced anonymous name
        email: '',                              // strip email
        message: r.message || '',
        created_at: r.created_at || '',
        avatar: {logo}                       // generic avatar only
      }));

      setReviews(normalized);
      setReviewsLoading(false);
    }).catch(() => {
      if (mounted) {
        setReviews([]);
        setReviewsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('skonnect_dark_mode', darkMode);
  }, [darkMode]);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => setShowSettings(false);
    if (showSettings) {
      window.addEventListener('click', close);
      return () => window.removeEventListener('click', close);
    }
  }, [showSettings]);

  // GSAP scroll animation refs
  const cardRefs = useRef([]);
  const placeholderRefs = useRef([]);

  useEffect(() => {
    // Animate cards on scroll into view
    cardRefs.current.forEach((card, idx) => {
      if (card) {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: idx * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Animate placeholder sections
    placeholderRefs.current.forEach((box, idx) => {
      if (box) {
        gsap.fromTo(
          box,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: idx * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: box,
              start: 'top 95%',
              toggleActions: 'play none none'
            }
          }
        );
      }
    });
  }, []);



async function generateMonthlyReport() {
  // indicate generation started
  setIsGenerating(true);
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const currentDate = new Date();
    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Title Section
    doc.setFontSize(20);
    doc.text('Skonnect Analytics Report', pageWidth/2, 30, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Month: ${monthYear}`, pageWidth/2, 50, { align: 'center' });
    doc.text('Prepared by: Skonnect Admin', pageWidth/2, 65, { align: 'center' });
    doc.text(`Date Generated: ${currentDate.toLocaleDateString()}`, pageWidth/2, 80, { align: 'center' });

    // 1. Key Metrics
    doc.setFontSize(16);
    doc.text('1. Key Metrics (KPI Summary)', 20, 100);
    
    const metrics = [
      ['Metric', 'Value', '% Change vs Last Month'],
      ['Youth Registered', youthCount.toString(), `${youthIncrease >= 0 ? '+' : ''}${youthIncrease}%`],
      ['Total Engagements', engagementCount.toString(), `${engagementIncrease >= 0 ? '+' : ''}${engagementIncrease}%`],
      ['AI Interactions', aiUsage.toString(), `${aiUsageIncrease >= 0 ? '+' : ''}${aiUsageIncrease}%`],
      ['Main Events', eventCount.toString(), `${eventIncrease >= 0 ? '+' : ''}${eventIncrease}%`],
      ['Activities / Sub-Events', subEventsCount.toString(), `${subEventIncrease >= 0 ? '+' : ''}${subEventIncrease}%`]
    ];

    autoTable(doc, {
      startY: 110,
      head: [metrics[0]],
      body: metrics.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    // Charts Section
    const charts = [
      { title: '2. Youth Registration per Month', ref: '.youth-chart' },
      { title: '3. Engagements per Month', ref: '.engagement-chart' },
      { title: '4. AI Usage Trends', ref: '.ai-chart' },
      { title: '5. Total Events per Month', ref: '.events-chart' },
      { title: '6. Activities / Sub-Events', ref: '.activities-chart' }
    ];

    let currentY = doc.lastAutoTable ? (doc.lastAutoTable.finalY + 30) : 40;
    const pageHeight = doc.internal.pageSize.height;
    const pageMargin = 40;
    const maxImgWidth = pageWidth - pageMargin * 2;
    const maxImgHeight = 220; // cap image height

    for (const chart of charts) {
      // ensure title and image fit on page; we'll measure before drawing
      doc.setFontSize(16);

      const element = document.querySelector(chart.ref);
      if (!element) {
        // still reserve space for title even if element missing
        if (currentY + 24 > pageHeight - pageMargin) {
          doc.addPage();
          currentY = 40;
        }
        doc.text(chart.title, 20, currentY);
        currentY += 30;
        continue;
      }

      // render element to canvas
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');

        // compute image size preserving aspect ratio
        const imgW = canvas.width;
        const imgH = canvas.height;
        const ratio = Math.min(maxImgWidth / imgW, maxImgHeight / imgH);
        const drawW = imgW * ratio;
        const drawH = imgH * ratio;

        // if not enough space, add page
        if (currentY + 10 + drawH > pageHeight - pageMargin) {
          doc.addPage();
          currentY = 40;
        }

        // draw title and image
        doc.text(chart.title, 20, currentY);
        doc.addImage(imgData, 'PNG', pageMargin, currentY + 10, drawW, drawH);
        currentY += drawH + 30;

      } catch (err) {
        console.error('Error capturing chart for PDF:', chart.ref, err);
        // fallback: write title and continue
        if (currentY + 24 > pageHeight - pageMargin) {
          doc.addPage();
          currentY = 40;
        }
        doc.text(chart.title, 20, currentY);
        currentY += 30;
      }
    }
    
    // 7. Youth Reviews
    doc.addPage();
    doc.setFontSize(16);
    doc.text('7. Youth Reviews / Feedback', 20, 30);

    const reviewsData = reviews.slice(0, 5).map(review => [
      review.name,
      new Date(review.created_at).toLocaleDateString(),
      review.message.substring(0, 100) + '...'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Name', 'Date', 'Feedback (excerpt)']],
      body: reviewsData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });
    
    // 8. Insights & Recommendations
    doc.setFontSize(16);
    doc.text('8. Insights & Recommendations', 20, doc.lastAutoTable.finalY + 30);
    doc.setFontSize(12);

    // Generate dynamic insights
    const dynamicInsights = generateInsights({
      youthIncrease,
      engagementIncrease,
      aiUsageIncrease,
      eventIncrease,
      subEventIncrease,
      reviews
    });

    // Add insights with proper formatting and spacing
    let insightY = doc.lastAutoTable.finalY + 40;
    dynamicInsights.forEach((insight, index) => {
      // Split long insights into multiple lines if needed
      const lines = doc.splitTextToSize(insight, pageWidth - 40);
      lines.forEach(line => {
        doc.text(line, 20, insightY);
        insightY += 10;
      });

      // Add extra space between insights
      if (index < dynamicInsights.length - 1) {
        insightY += 5;
      }
    });

    // Save the PDF
    doc.save(`Skonnect-Analytics-Report-${monthYear.replace(' ', '-')}.pdf`);
  } catch (err) {
    console.error('Error generating PDF report:', err);
  } finally {
    // always reset generating indicator
    setIsGenerating(false);
  }
}

// Add this function before generateMonthlyReport
function generateInsights({
  youthIncrease,
  engagementIncrease,
  aiUsageIncrease,
  eventIncrease,
  subEventIncrease,
  reviews
}) {
  const insights = [];

  // Youth Registration Insights
  if (youthIncrease > 0) {
    insights.push(`- Youth registrations show positive growth with ${youthIncrease}% increase compared to last month.`);
  } else if (youthIncrease < 0) {
    insights.push(`- Youth registrations decreased by ${Math.abs(youthIncrease)}%. Consider implementing recruitment strategies.`);
  } else {
    insights.push(`- Youth registration rates remained stable. Consider new outreach initiatives.`);
  }

  // Engagement Insights
  if (engagementIncrease > 10) {
    insights.push(`- Excellent engagement growth of ${engagementIncrease}%. Current engagement strategies are highly effective.`);
  } else if (engagementIncrease > 0) {
    insights.push(`- Engagements show moderate growth at ${engagementIncrease}%. Continue current engagement activities.`);
  } else {
    insights.push('- Engagement levels need attention. Consider new interaction strategies.');
  }

  // AI Usage Insights
  if (aiUsageIncrease > 0) {
    insights.push(`- AI chatbot adoption increased by ${aiUsageIncrease}%. Users are embracing the technology.`);
  } else {
    insights.push('- AI usage could be improved. Consider promoting chatbot features more actively.');
  }

  // Events Insights
  insights.push(`- Event organization ${eventIncrease >= 0 ? 'increased' : 'decreased'} by ${Math.abs(eventIncrease)}%.`);
  insights.push(`- Activities/sub-events showed ${subEventIncrease >= 0 ? 'growth' : 'decline'} of ${Math.abs(subEventIncrease)}%.`);

  // Feedback-based Insights
  if (reviews && reviews.length > 0) {
    const recentReviews = reviews.slice(0, 5);
    const hasFeedbackAboutActivities = recentReviews.some(r => 
      r.message.toLowerCase().includes('activity') || 
      r.message.toLowerCase().includes('event')
    );

    if (hasFeedbackAboutActivities) {
      insights.push('- Recent feedback indicates interest in more diverse activities.');
    }
  }

  return insights;
}

// Modify the insights section in generateMonthlyReport
// Replace the hardcoded insights with:
const insights = generateInsights({
  youthIncrease,
  engagementIncrease,
  aiUsageIncrease,
  eventIncrease,
  subEventIncrease,
  reviews
});

  return (
    <>
      <GlobalStyle dark={darkMode} />
      <Container style={darkMode ? { background: '#18181b', color: '#f3f5f9' } : {}}>
        <Sidebar darkMode={darkMode} />
        <Main>
          {/* Topbar */}


          {/* Dashboard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <DashboardTitle>
              <h2>📊 Analytics Overview</h2>
            </DashboardTitle>
            <button
              onClick={generateMonthlyReport}
              disabled={isGenerating}
              aria-busy={isGenerating}
              title={isGenerating ? 'Generating report...' : 'Generate monthly report'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: isGenerating ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {isGenerating ? <FaSpinner className="spin" /> : <FaDownload />}
              {isGenerating ? 'Generating...' : 'Generate Monthly Report'}
              {isGenerating ? <ButtonSpinner /> : <FaDownload />}
              {isGenerating ? 'Generating...' : 'Generate Monthly Report'}
            </button>
          </div>

          {/* Placeholder Sections */}
          <Grid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <PlaceholderBox ref={el => placeholderRefs.current[0] = el}>
              <h3>📈 Youth Registered Per Month</h3>
              <PieChartYouthPerMonth />
            </PlaceholderBox>
            <PlaceholderBox ref={el => placeholderRefs.current[1] = el}>
              <h3>📉 Engagements Per Month</h3>
              <EngagementsBarChart />
            </PlaceholderBox>
          </Grid>

          <Grid style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <PlaceholderBox ref={el => placeholderRefs.current[2] = el}>
              <h3>🤖 AI Usage Trends</h3>
              <AIUsageChart />
            </PlaceholderBox>
            <PlaceholderBox ref={el => placeholderRefs.current[3] = el}>
              <h3>🗺️ Total Events Per Month</h3>
              <EventsPerMonthChart />
            </PlaceholderBox>
          </Grid>

          {/* NEW: Add SubEventsPerMonthChart to dashboard */}
          <Grid style={{ gridTemplateColumns: '1fr' }}>
            <PlaceholderBox ref={el => placeholderRefs.current[5] = el}>
              <h3>📊 Activities Per Month</h3>
              <SubEventsPerMonthChart />
            </PlaceholderBox>
          </Grid>

          <PlaceholderBox ref={el => placeholderRefs.current[5] = el}>
            <h3>📝 Youth Reviews</h3>
            {reviewsLoading ? (
              <LoadingOverlay>
                <Spinner />
                <LoadingText>Loading reviews...</LoadingText>
                <LoadingSubtext>Fetching recent feedback</LoadingSubtext>
              </LoadingOverlay>
            ) : (
               <>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                   {reviews.slice(0,4).map((r, i) => (
                     <div key={r.id || i} style={{
                       display: 'flex', gap: 12, alignItems: 'flex-start',
                       background: darkMode ? '#0b1220' : '#fff', padding: 12, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                     }}>
                       <img
                         src={logo}                                // always generic avatar
                         alt={'Anonymous User'}                         // never show real name
                         style={{ width: 48, height: 48, borderRadius: 9999, objectFit: 'cover', flexShrink: 0 }}
                         onError={(e) => { e.target.onerror = null; e.target.src = logo; }}
                       />
                       <div style={{ minWidth: 0 }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                           <strong style={{ fontSize: 14 }}>{'Anonymous'}</strong>
                           <span style={{ fontSize: 12, color: darkMode ? '#9aa4b2' : '#6b7280' }}>{r.created_at ? (new Date(r.created_at)).toLocaleDateString() : ''}</span>
                         </div>
                         <p style={{
                           margin: '6px 0 0', fontSize: 13, color: darkMode ? '#cbd5e1' : '#475569',
                           overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
                         }}>{r.message}</p>
                       </div>
                     </div>
                   ))}
                 </div>

                 {reviews.length === 0 && <p style={{ marginTop: 12 }}>No reviews yet.</p>}

                 {reviews.length > 4 && (
                   <div style={{ marginTop: 12, textAlign: 'right' }}>
                     <button
                       onClick={() => window.location.href = '/comments'}
                       style={{
                         background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px',
                         borderRadius: 8, cursor: 'pointer'
                       }}
                     >
                       View all ({reviews.length}) comments
                     </button>
                   </div>
                 )}
               </>
             )}
           </PlaceholderBox>
         </Main>
       </Container>
     </>
   );
 };

 export default Analytics;

/* ---------- Dashboard-style loading components (place right after GlobalStyle) ---------- */
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

const ButtonSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #2563eb;
  animation: spin 0.9s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
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