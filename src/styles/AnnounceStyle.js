import styled from "styled-components";

// --- Main Layout Containers ---

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ dark }) => (dark ? "#18181b" : "#f3f5f9")};
  font-family: "Inter", sans-serif;
`;

/* Reduced overall content width/padding and made responsive */
export const ContentContainer = styled.div`
  flex: 1;
  background: ${({ dark }) => (dark ? "#18181b" : "#f3f5f9")};
  transition: background 0.3s;

  /* Reduced margins and padding to make the content more compact */
  margin: 1.25rem 1rem 1.5rem 16rem;
  padding: 1.25rem;
  max-width: calc(100% - 16rem);
  box-sizing: border-box;

  @media (max-width: 1200px) {
    margin-left: 14rem;
    padding: 1rem;
  }

  @media (max-width: 1024px) {
    margin: 1rem;
    padding: 0.85rem;
  }

  @media (max-width: 768px) {
    margin: 0.75rem;
    padding: 0.75rem;
  }
`;

// --- Headers and Forms ---

export const SectionHeader = styled.h2`
  font-size: 1.25rem; /* smaller */
  font-weight: 700;
  color: ${({ dark }) => (dark ? "#f1f5f9" : "#1e293b")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid ${({ dark }) => (dark ? "#3f3f46" : "#e2e8f0")};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

/* Slightly more compact form layout */
export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  align-items: flex-start;
`;

// --- Inputs ---

export const Input = styled.input`
  flex: 1;
  min-width: 160px;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  border: 1.25px solid #cbd5e1;
  background: #f9fafb;
  font-size: 0.95rem;
  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.08);
  }
`;

export const TextArea = styled.textarea`
  flex: 2;
  min-width: 200px;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  border: 1.25px solid #cbd5e1;
  background: #f9fafb;
  resize: vertical;
  min-height: 64px;
  font-size: 0.95rem;
  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.08);
  }
`;

export const Select = styled.select`
  flex: 1;
  min-width: 140px;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  border: 1.25px solid #cbd5e1;
  background: #f9fafb;
  font-size: 0.95rem;
  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.08);
  }
`;

// --- Buttons ---
export const Button = styled.button`
  background: ${({ variant }) =>
    variant === "delete"
      ? "#ef4444"
      : variant === "secondary"
      ? "#475569"
      : "#2563eb"};
  color: #fff;
  border: none;
  border-radius: 0.6rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  &:hover {
    background: ${({ variant }) =>
      variant === "delete"
        ? "#dc2626"
        : variant === "secondary"
        ? "#334155"
        : "#1e40af"};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// --- Cards ---
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px); /* fixed card width */
  justify-content: start;                          /* align cards to left */
  gap: 1rem;
  overflow-x: auto;                                /* allow horizontal scroll */
  padding-bottom: 1rem;
`;

export const Card = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.18s ease-in-out;

  width: 300px;          /* fixed width */
  height: 220px;         /* fixed height */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;    /* for See More button positioning */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;



export const CardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.4rem;
  font-size: 0.98rem;
`;

export const CardBody = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;  /* max 5 lines */
  -webkit-box-orient: vertical;
  white-space: normal;
  margin-bottom: 0.5rem;
  word-break: break-word;  /* prevent overflow of long words */
`;


export const CardDate = styled.span`
  font-size: 0.82rem;
  color: #64748b;
`;

// --- Highlights & Modal ---

export const HighlightsSection = styled.div`
  margin-top: 2rem;
`;

export const HighlightCard = styled.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 0.18s;
  width: 385px;      /* fixed width */
  flex: 0 0 auto;    /* prevent shrinking in scroll */

  &:hover {
    transform: translateY(-3px);
  }
`;


export const HighlightImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 120px;
  }
`;

export const HighlightContent = styled.div`
  padding: 0.85rem;
`;

export const HighlightTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.35rem;
`;

export const HighlightDesc = styled.p`
  font-size: 0.92rem;
  color: #475569;
`;

// Modal styles (slightly smaller)
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

// ...existing code...
export const ModalBox = styled.div`
  background: #fff;
  color: #1e293b;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  text-align: left;
  width: auto;              /* let width be determined by content */
  max-width: 92%;          /* cap width for very wide content/screen */
  min-width: 280px;        /* avoid being too small */
  box-sizing: border-box;
  max-height: 80vh;        /* prevent overflow beyond viewport */
  overflow-y: auto;        /* scroll only when content is too tall */
  display: inline-block;   /* size to content while remaining centerable */
  vertical-align: middle;
  word-break: break-word;   /* wrap long words */
  white-space: pre-wrap;    /* respect line breaks in text */
`;
// ...existing code...

export const ModalActions = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

export const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f1f5f9;
  border: 1.25px solid #cbd5e1;
  border-radius: 0.6rem;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #334155;
  transition: background 0.18s;
  &:hover {
    background: #e2e8f0;
  }
  input {
    display: none;
  }
`;

/* Announcement horizontal scroll: use responsive column sizing */
export const AnnouncementScroll = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 300px;  /* match Card width */
  gap: 0.75rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 1024px) {
    grid-auto-columns: 250px;
  }
  @media (max-width: 640px) {
    grid-auto-columns: 200px;
  }
`;

export const HighlightsScroll = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 8px;
  width: 100%;          /* full width */
  box-sizing: border-box;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

