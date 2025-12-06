import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SidebarNav from "../components/Sidebar";
import { FaTrash } from "react-icons/fa";

// ==============================
// Styled Components
// ==============================
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ dark }) => (dark ? "#18181b" : "#f3f5f9")};
`;

const Container = styled.div`
  margin-left: 240px;
  flex: 1;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: ${({ dark }) => (dark ? "#f3f5f9" : "#1f2937")};
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const DangerButton = styled(Button)`
  background: #ef4444;
  &:hover:not(:disabled) {
    background: #dc2626;
  }
`;

const ButtonContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const MetadataContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${({ dark }) => (dark ? "#1f2937" : "#f0f4f8")};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  align-items: center;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ dark }) => (dark ? "#cbd5e1" : "#6b7280")};
  }

  strong {
    color: ${({ dark }) => (dark ? "#f3f5f9" : "#1f2937")};
    font-weight: 600;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
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
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: #fff;
  animation: spin 0.9s linear infinite;
  margin-bottom: 12px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
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
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 12px;
`;

const LoadingSubtext = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
`;

const ErrorText = styled.p`
  color: #dc2626;
  background: #fee2e2;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #dc2626;
`;

const SuccessText = styled.p`
  color: #059669;
  background: #ecfdf5;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #059669;
`;

const RecommendationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const RecommendationCard = styled.div`
  background: ${({ dark }) => (dark ? "#1f2937" : "white")};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ recommended }) => (recommended ? "#10b981" : "#ef4444")};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const EventName = styled.h3`
  color: ${({ dark }) => (dark ? "#f3f5f9" : "#1f2937")};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Label = styled.span`
  color: ${({ dark }) => (dark ? "#9ca3af" : "#6b7280")};
  font-weight: 500;
`;

const Value = styled.span`
  color: ${({ dark }) => (dark ? "#f3f5f9" : "#1f2937")};
  font-weight: 600;
`;

const ConfidenceBadge = styled.span`
  display: inline-block;
  background: ${(props) => {
    if (props.confidence >= 0.8) return "#10b981";
    if (props.confidence >= 0.6) return "#f59e0b";
    return "#ef4444";
  }};
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const RecommendedTag = styled.span`
  display: inline-block;
  background: ${(p) => (p.recommended ? "#16a34a" : "#6b7280")};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

// ==============================
// Main Component
// ==============================
function EventRecommendations() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cached, setCached] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [darkMode] = useState(() => localStorage.getItem("skonnect_dark_mode") === "true");

  // always get current month
  const [month] = useState(new Date().toLocaleString("default", { month: "long" }));

  // ==============================
  // Fetch Recommendations
  // ==============================
  const fetchRecommendations = async (ignoreCache = false) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const url = ignoreCache
        ? "https://mdj3530-skonnect-recommender.hf.space/events/merged?ignore_cache=true"
        : "https://mdj3530-skonnect-recommender.hf.space/events/merged";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const realEvents = Array.isArray(data.real_events) ? data.real_events : [];
      const aiEvents = Array.isArray(data.ai_events) ? data.ai_events : [];

      // normalize real events
      const normReal = realEvents.map((e) => ({
        event: e.title ?? e.event ?? "Unnamed Event",
        description: e.description ?? "",
        predicted_participants: Number(e.average_rating ?? 0) * 100,
        probability: e.average_rating ? e.average_rating / 5 : 0.3,
        recommended: e.recommendation === "Recommended",
      }));

      // normalize AI events
      const normAI = aiEvents.map((e) => ({
        event: e.event,
        description: e.description,
        predicted_participants: e.predicted_participants,
        probability: e.probability,
        recommended: e.predicted_participants >= 500,
      }));

      const merged = [...normReal, ...normAI].sort((a, b) => b.probability - a.probability);

      setEvents(merged);
      setCached(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch recommendations");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Clear Cache
  // ==============================
  const clearCache = async () => {
    try {
      setClearingCache(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("https://mdj3530-skonnect-recommender.hf.space/clear_cache", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to clear cache");

      const data = await res.json();
      setSuccess(data.message || "Cache cleared successfully!");
      setCached(false);

      setTimeout(() => fetchRecommendations(true), 500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to clear cache");
    } finally {
      setClearingCache(false);
    }
  };

  // ==============================
  // Effects
  // ==============================
  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ==============================
  // Render
  // ==============================
  return (
    <Layout dark={darkMode}>
      <SidebarNav darkMode={darkMode} />
      <Container>
        <Title dark={darkMode}>📊 Monthly AI Event Recommendations</Title>

        <ButtonContainer>
          <Button onClick={() => fetchRecommendations(true)} disabled={loading}>
            {loading && <ButtonSpinner />}
            {loading ? "Loading..." : "Generate New Recommendations"}
          </Button>
          <DangerButton onClick={clearCache} disabled={clearingCache || !cached}>
            {clearingCache && <ButtonSpinner />}
            <FaTrash />
            {clearingCache ? "Clearing..." : "Clear Cache"}
          </DangerButton>
        </ButtonContainer>

        <MetadataContainer dark={darkMode}>
          <span>
            Month: <strong>{month}</strong>
          </span>
          <span>
            {cached ? (
              <>
                <ButtonSpinner />
                <strong>Cached Data</strong>
              </>
            ) : (
              <strong>Live Generation</strong>
            )}
          </span>
        </MetadataContainer>

        {success && <SuccessText>{success}</SuccessText>}
        {loading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Loading recommendations...</LoadingText>
            <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
          </LoadingOverlay>
        )}
        {error && <ErrorText>Error: {error}</ErrorText>}

        {!loading && !error && events.length === 0 && (
          <EmptyState>No recommendations available at this time.</EmptyState>
        )}

        {!loading && !error && events.length > 0 && (
          <RecommendationGrid>
            {events.map((e, i) => (
              <RecommendationCard key={i} dark={darkMode} recommended={e.recommended}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <EventName dark={darkMode}>{e.event}</EventName>
                  <RecommendedTag recommended={e.recommended}>
                    {e.recommended ? "✓ Recommended" : "✗ Not Recommended"}
                  </RecommendedTag>
                </div>

                <InfoRow>
                  <Label dark={darkMode}>Predicted Participants:</Label>
                  <Value dark={darkMode}>{e.predicted_participants || 0}</Value>
                </InfoRow>

                <InfoRow>
                  <Label dark={darkMode}>Confidence:</Label>
                  <ConfidenceBadge confidence={e.probability || 0}>
                    {((e.probability || 0) * 100).toFixed(1)}%
                  </ConfidenceBadge>
                </InfoRow>

                {e.description && (
                  <InfoRow style={{ flexDirection: "column", alignItems: "flex-start", marginTop: 12 }}>
                    <Label dark={darkMode}>Description:</Label>
                    <Value dark={darkMode} style={{ fontSize: 0.875 + "rem", marginTop: 4, lineHeight: 1.4 }}>
                      {e.description}
                    </Value>
                  </InfoRow>
                )}
              </RecommendationCard>
            ))}
          </RecommendationGrid>
        )}
      </Container>
    </Layout>
  );
}

export default EventRecommendations;
