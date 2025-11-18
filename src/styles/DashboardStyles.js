// DashboardStyles.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
  transition: background 0.3s;
`;

export const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: ${({ dark }) => (dark ? '#18181b' : '#fff')};
  border-right: 3px solid #3b82f6;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  transition: background 0.3s;
`;

export const Main = styled.main`
  margin-left: 240px;
  flex: 1;
  padding: 1.5rem;
  transition: margin-left 0.3s;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  img {
    transition: filter 0.3s;
    filter: ${({ dark }) => dark ? 'brightness(0.8)' : 'none'};
  }
`;

export const LogoText = styled.div`
  h1 {
    font-weight: 800;
    font-size: 1.125rem;
    color: ${({ dark }) => (dark ? '#f3f5f9' : '#111827')};
    transition: color 0.3s;
  }
  p {
    font-size: 0.75rem;
    color: ${({ dark }) => (dark ? '#9ca3af' : '#6b7280')};
    font-weight: 300;
    transition: color 0.3s;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${({ dark }) => (dark ? '#d1d5db' : '#374151')};

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    color: inherit;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;

    &:hover {
      color: ${({ dark }) => (dark ? '#f3f5f9' : '#111827')};
      background: ${({ dark }) => (dark ? '#27272a' : '#e5e7eb')};
    }

    &.active {
      background: ${({ dark }) => (dark ? '#3b82f6' : '#d1fae5')};
      color: ${({ dark }) => (dark ? '#fff' : '#047857')};
    }
  }
`;

export const SidebarFooter = styled.div`
  font-size: 0.5625rem;
  color: #9ca3af;
  font-weight: 300;
  line-height: 1.25;
`;

export const Topbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  background: white;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  width: 100%;
  max-width: 32rem;
`;

export const SearchInput = styled.input`
  flex: 1;
  font-size: 0.75rem;
  border: none;
  outline: none;
  color: #6b7280;
`;

export const TopIcons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const IconBtn = styled.button`
  background: ${({ bg }) => bg || '#dbeafe'};
  color: ${({ color }) => color || '#2563eb'};
  padding: 0.5rem;
  border-radius: 0.375rem;
  position: relative;
  border: none;

  &:hover {
    background: ${({ hover }) => hover || '#bfdbfe'};
  }

  span {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    background: ${({ badge }) => badge || '#3b82f6'};
    color: white;
    font-size: 0.625rem;
    font-weight: 600;
    border-radius: 9999px;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Profile = styled.div`
  background: white;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
`;

export const DashboardTitle = styled.div`
  margin-bottom: 1.5rem;

  h2 {
    font-weight: 700;
    color: #1f2937;
    font-size: 1.125rem;
  }

  p {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 300;
  }
`;

export const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

export const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  gap: 1rem;
  align-items: center;

  img {
    width: 3rem;
    height: 3rem;
  }

  .details {
    p {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 300;
    }

    h4 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .change {
      font-size: 0.625rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &.up {
        color: #10b981;
      }

      &.down {
        color: #ef4444;
      }
    }
  }
`;

export const PlaceholderBox = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  min-height: 12rem;

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 300;
  }
`;
// ======================= DESCRIPTION STYLES =======================

export const DescriptionCell = styled.td`
  white-space: normal;
  overflow: visible;
  word-break: break-word;
  color: #475569;
  line-height: 1.4;
`;

export const SeeMoreButton = styled.button`
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
  font-size: 0.85rem;

  &:hover {
    text-decoration: underline;
  }
`;

// ======================= MODAL STYLES =======================

export const DescriptionModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const DescriptionModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

export const DescriptionModalTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;


export const ModalButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #1d4ed8;
  }
`;
// ======================= TABLE STYLES =======================

export const TableWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  max-height: 500px;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;


export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 800px;
  font-size: 0.9rem;
  color: #334155;

  th,
  td {
    padding: 0.75rem 1rem;
    border-top: 1px solid #e2e8f0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
  }

  th {
    background-color: #3b82f6;
    color: white;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  tr:nth-child(even) {
    background-color: #f9fafb;
  }

  tr:hover {
    background-color: #f1f5f9;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 2in;
  }

  /* ✅ Allow multi-line text for description */
  th:nth-child(2),
  td:nth-child(2) {
    width: 3in;
    white-space: normal;
    overflow: visible;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 1in;
    text-align: center;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 2in;
    text-align: center;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem; /* space between buttons */
  flex-wrap: nowrap;
`;

export const EventCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
`;

// Base modal container for participants, attendance, and activities
export const ParticipantModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  overflow-y: auto;
`;
export const NotificationButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 4000;
  background: white;
  color: #111827;
  border: none;
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;

  &:hover {
    background: #f3f4f6;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #dc2626;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const NotificationEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 2.5rem 1rem;
  color: #64748b;
  text-align: center;

  & > div { font-size: 2rem; }
  & > p { margin: 0; font-weight: 600; color: #475569; }
  & > p + p { font-weight: 400; color: #94a3b8; font-size: 0.9rem; }
`;
export const NotificationTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.2px;
`;
export const NotificationItem = styled.button`
  text-align: left;
  width: 100%;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.03);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  box-shadow: 0 1px 0 rgba(2,6,23,0.02);

  &:hover {
    transform: translateX(6px);
    box-shadow: 0 8px 20px rgba(2,6,23,0.06);
  }
`;