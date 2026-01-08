import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AttendanceChart from "../components/AttendanceBar";
import SidebarNav from "../components/Sidebar";
import { Container, Main } from "../styles/DashboardStyles";
import { fetchWithFallback } from '../utils/fetchWithFallback';

const Wrapper = styled.div`
  padding: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
`;

const Th = styled.th`
  padding: 12px;
  background: #1e293b;
  color: white;
`;

const Td = styled.td`
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
`;

const Growth = styled.span`
  color: ${({ value }) => (value >= 0 ? "#16a34a" : "#dc2626")};
  font-weight: 600;
`;

/* Modal for showing event response analytics */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  width: 90%;
  max-width: 720px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(2,6,23,0.3);
`;

const ModalHeader = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const ModalTitle = styled.h3`
  margin:0; font-size:1rem; font-weight:700; color:#111827;
`;

const ModalBody = styled.div`
  padding: 16px;
  max-height: 60vh;
  overflow: auto;
`;

const ResponseTable = styled.table`
  width:100%; border-collapse:collapse;
  th, td { padding: 8px; border-bottom: 1px solid #e6e6e6; text-align:left; }
  th { background:#fafafa; font-weight:600; }
`;

/* new: lightweight chart styles used in modal */
const FieldSection = styled.div`
  margin-bottom: 16px;
`;
const FieldHeader = styled.div`
  font-weight:700;
  margin-bottom: 8px;
  display:flex;
  align-items:center;
  justify-content:space-between;
`;
const ChartRow = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:8px;
`;
const BarOuter = styled.div`
  flex:1;
  height:18px;
  background:#f1f5f9;
  border-radius:6px;
  overflow:hidden;
`;
const BarInner = styled.div`
  height:100%;
  background: ${props => props.color || '#2563eb'};
  width: ${props => props.width || '0%'};
  transition: width .4s ease;
`;
const BarLabel = styled.div`
  white-space:nowrap;
  min-width: 110px;
  font-size:0.9rem;
`;
const SmallStat = styled.div`
  font-size:0.9rem;
  min-width:70px;
  text-align:right;
`;

export default function EventAnalytics() {
  const [data, setData] = useState([]);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [responses, setResponses] = useState([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Format value coming from the API (counts or averages)
  const formatValue = (r) => {
    if (!r || typeof r.value === 'undefined' || r.value === null) return '';
    // Age is returned as an average (decimal) by the API
    if ((r.field_name || '').toLowerCase() === 'age') {
      const n = parseFloat(r.value);
      return Number.isFinite(n) ? n.toFixed(1) : r.value;
    }
    // Other fields are counts (integers)
    const n = parseInt(r.value, 10);
    return Number.isFinite(n) ? n : r.value;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithFallback('event_attendance_analytics.php');
        if (!res || !res.ok) throw new Error('Failed to load analytics');
        const json = await res.json();
        // Ensure we have an array of events
        const items = Array.isArray(json) ? json : (json.data || []);
        // If an event is named exactly "KK GENERAL ASSEMBLY 2025", create a separate 2024 column with 400 attendance
        // Also add 2024 attendance (150) for "YEAR END GATHERING OF THE SK BUHANGIN PROPER"
        const processed = items.map(ev => {
          const title = (ev.title || '').toString().trim().toUpperCase();
          if (title === 'KK GENERAL ASSEMBLY 2025') {
            return { ...ev, year_2024: 400 };
          }
          if (title === 'YEAR END GATHERING OF THE SK BUHANGIN PROPER') {
            return { ...ev, year_2024: 150 };
          }
          return ev;
        });
        setData(processed);
      } catch (err) {
        console.error('Error loading event analytics:', err);
        setData([]);
      }
    })();
  }, []);

  const handleShowResponses = async (eventItem) => {
    const id = eventItem.subevent_id ?? eventItem.id ?? eventItem.event_id;
    const title = eventItem.title ?? eventItem.name ?? 'Event';
    setSelectedEvent({ id, title });
    setResponseModalOpen(true);
    setResponsesLoading(true);
    try {
      const res = await fetchWithFallback(`event_response_analytics.php?event_id=${encodeURIComponent(id)}`);
      if (!res || !res.ok) throw new Error('Failed to load responses');
      const json = await res.json();
      setResponses(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error('Failed to load event responses:', err);
      setResponses([]);
    } finally {
      setResponsesLoading(false);
    }
  };

  const closeResponsesModal = () => {
    setResponseModalOpen(false);
    setResponses([]);
    setSelectedEvent(null);
  };

  // helpers to render charts
  const normalizeGender = (s = '') => {
    const v = (s || '').toString().trim().toLowerCase();
    const male = ['m', 'male', 'man', 'boy'];
    const female = ['f', 'female', 'woman', 'girl'];
    if (male.includes(v)) return 'Male';
    if (female.includes(v)) return 'Female';
    return 'Other';
  };

  const groupedResponses = (arr) => {
    const groups = {};
    for (const r of arr) {
      const field = r.field_name || 'Unknown';
      let resp = r.response ?? '';
      let val = Number(r.value ?? r.total ?? 0);

      // Make sure numeric parsing is robust
      val = Number.isFinite(val) ? val : (parseInt(r.value || r.total || 0, 10) || 0);

      if (!groups[field]) groups[field] = {};
      // special-case Gender: collapse variants into Male / Female / Other
      if (field.toLowerCase() === 'gender') {
        const key = normalizeGender(resp);
        groups[field][key] = (groups[field][key] || 0) + val;
      } else if (field.toLowerCase() === 'age') {
        // age comes back as a single row labelled 'Average' with numeric 'value'
        groups[field]['Average'] = val;
      } else {
        groups[field][resp || ''] = (groups[field][resp || ''] || 0) + val;
      }
    }
    return groups;
  };

  return (
    <Container>
      <SidebarNav />
      <Main>
        <Wrapper>
          <h2>Event Attendance Analytics</h2>

          <Table>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th>2024</Th>
                <Th>Last Year</Th>
                <Th>Current Year</Th>
                <Th>Growth</Th>
              </tr>
            </thead>
            <tbody>
              {data.map(event => {
                const growth =
                  event.last_year === 0
                    ? 100
                    : (((event.current_year - event.last_year) / event.last_year) * 100).toFixed(1);

                return (
                  <tr
                    key={event.subevent_id}
                    onClick={() => handleShowResponses(event)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Td>{event.title}</Td>
                    <Td>{event.year_2024 ?? '—'}</Td>
                    <Td>{event.last_year}</Td>
                    <Td>{event.current_year}</Td>
                    <Td>
                      <Growth value={growth}>
                        {growth}%
                      </Growth>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <AttendanceChart data={data} />

          {/* Responses modal */}
          {responseModalOpen && (
            <ModalOverlay onClick={closeResponsesModal}>
              <ModalBox onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>Responses — {selectedEvent?.title}</ModalTitle>
                  <div>
                    <button onClick={closeResponsesModal} style={{ background:'transparent', border:'none', fontSize:16, cursor:'pointer' }} aria-label="Close">✕</button>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {responsesLoading ? (
                    <div style={{ textAlign:'center', padding:'2rem' }}>Loading responses...</div>
                  ) : responses.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'2rem' }}>No responses found for this event.</div>
                  ) : (
                    (() => {
                      const groups = groupedResponses(responses);
                      return Object.keys(groups).map((field) => {
                        const items = groups[field];
                        // Age: display single average
                        if (field.toLowerCase() === 'age') {
                          const avg = items['Average'] ?? '';
                          return (
                            <FieldSection key={field}>
                              <FieldHeader>
                                <div>{field}</div>
                                <div style={{ fontWeight:700 }}>{avg ? `${parseFloat(avg).toFixed(1)} yrs` : '—'}</div>
                              </FieldHeader>
                            </FieldSection>
                          );
                        }

                        // Gender: show Male / Female / Other bar
                        if (field.toLowerCase() === 'gender') {
                          const male = items['Male'] || 0;
                          const female = items['Female'] || 0;
                          const other = Object.keys(items).reduce((acc, k) => {
                            if (k !== 'Male' && k !== 'Female') acc += items[k] || 0;
                            return acc;
                          }, 0);
                          const total = male + female + other || 1;
                          const makePercent = v => `${Math.round((v / total) * 100)}%`;
                          return (
                            <FieldSection key={field}>
                              <FieldHeader><div>{field}</div><SmallStat>{male + female + other} responses</SmallStat></FieldHeader>
                              <ChartRow>
                                <BarLabel>Male</BarLabel>
                                <BarOuter><BarInner color="#2563eb" width={makePercent(male)} /></BarOuter>
                                <SmallStat>{male}</SmallStat>
                              </ChartRow>
                              <ChartRow>
                                <BarLabel>Female</BarLabel>
                                <BarOuter><BarInner color="#fb7185" width={makePercent(female)} /></BarOuter>
                                <SmallStat>{female}</SmallStat>
                              </ChartRow>
                              <ChartRow>
                                <BarLabel>Other</BarLabel>
                                <BarOuter><BarInner color="#94a3b8" width={makePercent(other)} /></BarOuter>
                                <SmallStat>{other}</SmallStat>
                              </ChartRow>
                            </FieldSection>
                          );
                        }

                        // Other fields: show bars for each response (sorted by value)
                        const entries = Object.entries(items).sort((a,b)=>b[1]-a[1]);
                        const max = entries[0]?.[1] || 1;
                        return (
                          <FieldSection key={field}>
                            <FieldHeader><div>{field}</div><SmallStat>{entries.reduce((s, e) => s + e[1], 0)} responses</SmallStat></FieldHeader>
                            {entries.map(([resp, val], idx) => (
                              <ChartRow key={resp + idx}>
                                <BarLabel>{resp || '(blank)'}</BarLabel>
                                <BarOuter><BarInner width={`${Math.round((val / max) * 100)}%`} /></BarOuter>
                                <SmallStat>{val}</SmallStat>
                              </ChartRow>
                            ))}
                          </FieldSection>
                        );
                      });
                    })()
                  )}
                </ModalBody>
              </ModalBox>
            </ModalOverlay>
          )}

        </Wrapper>
      </Main>
    </Container>
  );
}
