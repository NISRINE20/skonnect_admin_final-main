// src/components/Topbar.js
import React from 'react';
import styled from 'styled-components';

const TopbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  max-width: 32rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  font-size: 0.75rem;
  color: #9ca3af;
  border: none;
  outline: none;
`;

const IconButton = styled.button`
  background: ${({ color }) => color || '#c7d2fe'};
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: ${({ textColor }) => textColor || '#2563eb'};
  position: relative;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ hover }) => hover || '#bfdbfe'};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: ${({ bg }) => bg || '#3b82f6'};
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
`;

function Topbar() {
  return (
    <TopbarWrapper>
      <SearchForm role="search">
        <SearchInput type="search" placeholder="Search here" aria-label="Search here" />
        <button type="submit" style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>
          <i className="fas fa-search" />
        </button>
      </SearchForm>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <IconButton><i className="fas fa-bell" /><Badge>21</Badge></IconButton>
        <IconButton><i className="fas fa-comment-alt" /><Badge>53</Badge></IconButton>
        <IconButton><i className="fas fa-gift" /><Badge>15</Badge></IconButton>
        <IconButton color="#fecaca" textColor="#dc2626" hover="#fca5a5">
          <i className="fas fa-cog" />
          <Badge bg="#dc2626">18</Badge>
        </IconButton>

        <Profile>
          <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>Hello, Admin</span>
          <img
            src="https://storage.googleapis.com/a1aa/image/08ad2863-a8aa-478a-1d80-1614995153a2.jpg"
            alt="Admin Avatar"
            width="32"
            height="32"
            style={{ borderRadius: '9999px', objectFit: 'cover' }}
          />
        </Profile>
      </div>
    </TopbarWrapper>
  );
}

export default Topbar;
