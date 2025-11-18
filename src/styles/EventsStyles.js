// EventsStyles.js
import styled from "styled-components";

// 🎨 --- COLOR PALETTE (based on AnnounceStyle.js) ---
const BLUE = "#2563eb"; // primary action color
const BLUE_DARK = "#1e40af"; // hover
const LIGHT_BG = "#f3f5f9"; // page background
const WHITE = "#ffffff"; // panel background
const BORDER = "#e2e8f0"; // light border
const TEXT_DARK = "#1e293b";
const TEXT_LIGHT = "#f1f5f9";

// === 🧩 LAYOUT ===
export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ dark }) => (dark ? "#18181b" : LIGHT_BG)};
  font-family: "Inter", sans-serif;
  transition: background 0.3s;
`;

export const Container = styled.div`
  flex: 1;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
  transition: background 0.3s;

  margin: 2rem 2rem 2rem 16rem;
  padding: 2rem;

  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 2.5rem;

  @media (max-width: 1024px) {
    margin: 1.5rem 1rem;
    padding: 1.5rem;
    grid-template-columns: 1fr;
  }
`;

// === 📦 CONTENT CONTAINER ===
export const ContentContainer = styled.div`
  background: ${({ dark }) => (dark ? "#27272a" : WHITE)};
  border: 1px solid ${({ dark }) => (dark ? "#3f3f46" : BORDER)};
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  transition: background 0.3s, border-color 0.3s;
  color: ${({ dark }) => (dark ? TEXT_LIGHT : TEXT_DARK)};
  line-height: 1.6;
  font-size: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;


// === 🏷️ TITLES ===
export const Title = styled.h2`
  grid-column: span 2;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ dark }) => (dark ? TEXT_LIGHT : TEXT_DARK)};
  border-bottom: 2px solid ${({ dark }) => (dark ? "#3f3f46" : BORDER)};
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
`;

// === 🧾 FORM PANEL ===
export const FormPanel = styled.div`
  position: sticky;
  top: 2rem;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ dark }) => (dark ? "#3f3f46" : BORDER)};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: fit-content;
  transition: background 0.3s, border-color 0.3s;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ dark }) => (dark ? "#d1d5db" : "#334155")};
`;

// === 🧠 INPUTS ===
export const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid #cbd5e1;
  background: #f9fafb;
  font-size: 1rem;
  &:focus {
    border-color: ${BLUE};
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
`;

export const Select = styled.select`
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid #cbd5e1;
  background: #f9fafb;
  font-size: 1rem;
  &:focus {
    border-color: ${BLUE};
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
`;

export const Checkbox = styled.input`
  margin-right: 0.5rem;
  accent-color: ${BLUE};
`;

export const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border-radius: 0.75rem;
  border: 1.5px solid #cbd5e1;
  background: #f9fafb;
  resize: vertical;
  min-height: 80px;
  font-size: 1rem;
  &:focus {
    border-color: ${BLUE};
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
`;

// === 🔘 BUTTONS ===
export const Button = styled.button`
  background: ${({ variant }) =>
    variant === "delete"
      ? "#ef4444"
      : variant === "secondary"
      ? "#475569"
      : BLUE};
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s;
  font-weight: 500;
  align-self: flex-start;

  &:hover {
    background: ${({ variant }) =>
      variant === "delete"
        ? "#dc2626"
        : variant === "secondary"
        ? "#334155"
        : BLUE_DARK};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled(Button)`
  background: #ef4444;
  &:hover {
    background: #dc2626;
  }
`;

// === 🧩 FIELD GROUP ===
export const FieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const FieldChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: #e0e7ff;
  color: #3730a3;
  font-size: 0.9rem;
  font-weight: 600;
`;

// === 🗓️ EVENT LIST PANEL ===
export const EventPanel = styled.div`
  background: ${({ dark }) => (dark ? "#27272a" : WHITE)};
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ dark }) => (dark ? "#3f3f46" : BORDER)};
  transition: background 0.3s;
`;

// === 📅 EVENT CARD ===
export const EventCard = styled.div`
  background: ${({ dark }) => (dark ? "#18181b" : "#ffffff")};
  border: 1px solid ${({ dark }) => (dark ? "#3f3f46" : "#e2e8f0")};
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.25s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
  }
`;

export const EventTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ dark }) => (dark ? "#f3f4f6" : "#1e293b")};
`;

export const EventInfo = styled.p`
  color: ${({ dark }) => (dark ? "#d1d5db" : "#475569")};
  font-size: 0.95rem;
  margin-top: 0.3rem;
`;

export const EventDate = styled.span`
  display: inline-block;
  background: #dbeafe;
  color: ${BLUE_DARK};
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

// === ⚙️ EVENT CARD ACTIONS ===
export const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const EditButton = styled(Button)`
  background: ${BLUE};
  &:hover {
    background: ${BLUE_DARK};
  }
`;

export const DeleteButton = styled(DangerButton)`
  background: #ef4444;
  &:hover {
    background: #dc2626;
  }
`;

// === 💬 MODAL STYLES ===
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 41, 59, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

export const ModalContent = styled.div`
  background: ${({ dark }) => (dark ? "#27272a" : WHITE)};
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ dark }) => (dark ? "#3f3f46" : BORDER)};
`;

export const ModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ dark }) => (dark ? "#f3f4f6" : "#1e293b")};
  margin-bottom: 1rem;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;
