import React, { useRef, useEffect, useState } from 'react';
import { 
  FaSearch, FaUsers, FaGift, FaBullhorn, FaCalendar, 
  FaChartBar, FaComments, FaSignOutAlt, FaSpinner 
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoSection, LogoText, Nav } from '../styles/DashboardStyles';
import logo from '../sklogo.png';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';

// 🔄 Spinner animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: ${({ dark }) => (dark ? '#18181b' : '#fff')};
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 100;
  overflow-y: auto;
  transition: background 0.3s;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ loading }) => (loading ? '#9ca3af' : '#ef4444')};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 15px;
  font-weight: 500;
  cursor: ${({ loading }) => (loading ? 'not-allowed' : 'pointer')};
  transition: background 0.3s ease;

  &:hover {
    background: ${({ loading }) => (loading ? '#9ca3af' : '#dc2626')};
  }

  svg {
    font-size: 16px;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const SidebarNav = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const navLinksRef = useRef([]);
  const [loading, setLoading] = useState(false); // ✅ state for loading effect

  useEffect(() => {
    const key = 'skonnect_sidebar_animated';
    const already = sessionStorage.getItem(key);

    if (!already) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
      gsap.fromTo(
        navLinksRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, delay: 0.3, ease: 'power2.out' }
      );
      sessionStorage.setItem(key, '1');
    } else {
      gsap.set(sidebarRef.current, { x: 0, opacity: 1 });
      gsap.set(navLinksRef.current, { y: 0, opacity: 1 });
    }
  }, []);

  const handleLogout = () => {
    if (loading) return; // prevent double-clicks
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem('isLoggedIn');
      navigate('/', { replace: true });
    }, 1200); // simulate short loading effect
  };

  return (
    <Sidebar ref={sidebarRef} dark={darkMode}>
      <div>
        <LogoSection>
          <img src={logo} width="50" height="50" draggable={false} alt="Logo" />
          <LogoText>
            <h1>Skonnect</h1>
            <p>Admin Dashboard</p>
          </LogoText>
        </LogoSection>

        <Nav>
          {[
            { href: '/dashboard', icon: <FaSearch />, label: 'Dashboard' },
            { href: '/youths', icon: <FaUsers />, label: 'Youths' },
            { href: '/calendar', icon: <FaCalendar />, label: 'Calendar' },
            { href: '/announcements', icon: <FaBullhorn />, label: 'Announcements' },
            { href: '/event-recommender', icon: <FaChartBar />, label: 'Event Stats' },
            { href: '/events', icon: <FaGift />, label: 'Events' },
            { href: '/analytics', icon: <FaChartBar />, label: 'Analytics' },
            { href: '/comments', icon: <FaComments />, label: 'Comments' }
            
          ].map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              ref={(el) => (navLinksRef.current[idx] = el)}
              className={location.pathname === item.href ? 'active' : ''}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </Nav>
      </div>

      {/* ✅ Logout Button with spinner */}
      <LogoutButton onClick={handleLogout} disabled={loading} loading={loading}>
        {loading ? (
          <>
            <FaSpinner className="spinner" /> Logging out...
          </>
        ) : (
          <>
            <FaSignOutAlt /> Logout
          </>
        )}
      </LogoutButton>
    </Sidebar>
  );
};

export default SidebarNav;
