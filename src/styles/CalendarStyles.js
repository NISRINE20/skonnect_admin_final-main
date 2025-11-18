import styled from "styled-components";

export const CalendarContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f3f6fd;
  font-size: 13px;
  color: #4b5563;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  padding: 0.25rem 0.75rem;
  width: 18rem;
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  font-size: 0.875rem;
  color: #6b7280;
  border: none;
  outline: none;
`;

export const SearchButton = styled.button`
  color: #9ca3af;
  &:hover {
    color: #4b5563;
  }
`;

export const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const NotificationButton = styled.button`
  position: relative;
  background: ${(props) => (props.red ? "#fecaca" : "#bfdbfe")};
  color: ${(props) => (props.red ? "#b91c1c" : "#1d4ed8")};
  padding: 0.5rem;
  border-radius: 0.375rem;
  &:hover {
    background: ${(props) => (props.red ? "#fca5a5" : "#93c5fd")};
  }

  span {
    position: absolute;
    top: -4px;
    right: -4px;
    font-size: 10px;
    font-weight: 600;
    background: #1d4ed8;
    color: white;
    border-radius: 9999px;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border: 1px solid #d1d5db;

  img {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    object-fit: cover;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const ModalContent = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  width: 20rem;
  max-width: 100%;
  padding: 1.5rem;
`;

export const ModalHeader = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;

  label {
    font-weight: 600;
    font-size: 0.75rem;
  }
`;

export const ModalInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

export const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) => (props.cancel ? "#d1d5db" : "#2563eb")};
  color: ${(props) => (props.cancel ? "#374151" : "white")};
  &:hover {
    background: ${(props) => (props.cancel ? "#9ca3af" : "#1d4ed8")};
  }
`;
