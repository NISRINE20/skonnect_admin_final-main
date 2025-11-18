import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1rem;
  overflow-y: auto;
  background: #f1f5f9;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  width: 280px;

  input {
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 0.85rem;
    color: #475569;
  }

  button {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
  }
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  button {
    position: relative;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
  }

  .blue {
    background: #bfdbfe;
    color: #1d4ed8;
    &:hover {
      background: #93c5fd;
    }
  }

  .red {
    background: #fecaca;
    color: #b91c1c;
    &:hover {
      background: #fca5a5;
    }
  }

  span {
    position: absolute;
    top: -4px;
    right: -4px;
    font-size: 0.65rem;
    font-weight: 600;
    background: #1d4ed8;
    color: white;
    border-radius: 9999px;
    padding: 0 0.3rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-size: 0.9rem;
    color: #475569;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  p {
    font-size: 0.75rem;
    color: #64748b;
  }
`;

export const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

export const ChangeText = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &.up {
    color: #16a34a;
  }

  &.down {
    color: #dc2626;
  }
`;

export const ReviewCard = styled(Card)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BotButton = styled.button`
  background: #2563eb;
  color: white;
  border-radius: 50%;
  padding: 0.8rem;
  cursor: pointer;
  border: none;
`;