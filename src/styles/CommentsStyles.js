import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f4f6')};
  transition: background 0.3s;
`;

export const ContentWrapper = styled.main`
  margin-left: 240px;
  flex: 1;
  padding: 1.5rem;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f4f6')};
  transition: background 0.3s;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  border: 1px solid ${({ dark }) => (dark ? '#374151' : '#cbd5e1')};
  border-radius: 0.375rem;
  background: ${({ dark }) => (dark ? '#27272a' : '#fff')};
  padding: 0.375rem 0.75rem;
  width: 18rem;
  transition: all 0.3s;
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  font-size: 0.875rem;
  color: ${({ dark }) => (dark ? '#f3f5f9' : '#475569')};
  background: transparent;
  border: none;
  outline: none;
  
  &::placeholder {
    color: ${({ dark }) => (dark ? '#6b7280' : '#94a3b8')};
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  background: ${({ dark }) => (dark ? '#27272a' : '#fff')};
  color: ${({ dark }) => (dark ? '#f3f5f9' : '#475569')};
  transition: all 0.2s;

  &:hover {
    background: ${({ dark }) => (dark ? '#374151' : '#f8fafc')};
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Heading = styled.h2`
  font-weight: bold;
  font-size: 1.125rem;
  color: ${({ dark }) => (dark ? '#f3f5f9' : '#0f172a')};
  margin-bottom: 0.25rem;
`;

export const SubHeading = styled.p`
  font-size: 0.75rem;
  color: ${({ dark }) => (dark ? '#9ca3af' : '#64748b')};
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const CommentCard = styled.div`
  background: ${({ dark }) => (dark ? '#27272a' : '#fff')};
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid ${({ dark }) => (dark ? '#374151' : '#e5e7eb')};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ dark }) => (dark ? '#f3f5f9' : '#0f172a')};
`;

export const TimeStamp = styled.span`
  font-size: 0.75rem;
  color: ${({ dark }) => (dark ? '#9ca3af' : '#94a3b8')};
`;

export const CommentText = styled.p`
  font-size: 0.875rem;
  color: ${({ dark }) => (dark ? '#d1d5db' : '#334155')};
`;

export const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
`;

export const ActionLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ dark }) => (dark ? '#9ca3af' : '#64748b')};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ dark }) => (dark ? '#f3f5f9' : '#0f172a')};
  }
`;

export const ChatbotButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    background: #1d4ed8;
  }
`;