import React, { useEffect, useState } from 'react';
import SidebarNav from '../components/Sidebar';
import { FaTrash } from 'react-icons/fa';
import {
  Layout,
  Container,
  Title,
  FormPanel,
  Form,
  InputGroup,
  Input,
  Select,
  Checkbox,
  TextArea,
  Button,
  DangerButton,
  FieldGroup,
} from '../styles/EventsStyles';
import styled from 'styled-components';
import { fetchWithFallback } from '../utils/fetchWithFallback';

/* ---------------- Message Modal ---------------- */
const MessageModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 41, 59, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const MessageModalBox = styled.div`
  background: #fff;
  color: #18181b;
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  box-shadow: 0 6px 32px rgba(99,102,241,0.15);
  text-align: center;
  min-width: 320px;
  font-weight: 600;
  border: 2px solid ${({ type }) => (type === 'error' ? '#f43f5e' : '#2563eb')};
`;

const MessageModalButton = styled.button`
  margin-top: 1.5rem;
  background: ${({ type }) => (type === 'error' ? '#f43f5e' : '#2563eb')};
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(99,102,241,0.15);
  transition: background 0.2s;
  &:hover { background: ${({ type }) => (type === 'error' ? '#dc2626' : '#1e40af')}; }
`;

const MessageText = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${({ type }) => (type === 'error' ? '#b91c1c' : '#1e3a8a')};
  font-weight: 600;
`;

/* --- Loading / Spinner components (match Dashboard style) --- */
const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
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
  border: 4px solid rgba(255,255,255,0.12);
  border-top-color: #fff;
  animation: spin 0.9s linear infinite;
  box-shadow: 0 6px 18px rgba(2,6,23,0.12);
  margin-bottom: 12px;

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const InlineSpinner = styled.div`
  border: 3px solid #f1f5f9;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.9s linear infinite;
  margin-left: 8px;
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 12px;
`;

const LoadingSubtext = styled.div`
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
`;

/* small inline button spinner (reuse across pages) */
const ButtonSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
 
/* ---------------- API Helper ---------------- */

/* ---------------- Component ---------------- */
const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [message, setMessage] = useState(null);

  // NEW: loading states
  const [loadingEvents, setLoadingEvents] = useState(true);          // for dropdown fetch
  const [creatingMainEvent, setCreatingMainEvent] = useState(false); // for creating main event
  const [savingSubEventsLoading, setSavingSubEventsLoading] = useState(false); // for saving sub-events

  // Main Event Form
  const [mainForm, setMainForm] = useState({ title: '', description: '' });

  // Sub Event Form
  const [subEventInput, setSubEventInput] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: null,
    status: 'upcoming',
    points: '',
    event_type: 'General',
    custom_event_type: '', // <-- new: holds the "Other" custom type text
    customFields: []
  });
  const [subEvents, setSubEvents] = useState([]);
  const [subFieldInput, setSubFieldInput] = useState({ label: '', type: 'text', required: true });

  useEffect(() => { fetchEvents(); }, []);
 
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetchWithFallback('get_upcoming_main_events.php');
      if (!res || !res.ok) throw new Error('Events server unreachable');
      const data = await res.json();
      console.log('✅ Fetched main events:', data);

      // Normalize response to an array to avoid "events.map is not a function"
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.main_events)) {
        list = data.main_events;
      } else if (Array.isArray(data.events)) {
        list = data.events;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      } else {
        console.warn('fetchEvents: unexpected payload shape, defaulting to []');
        list = [];
      }

      setEvents(list);
    } catch (err) {
      console.error('❌ Failed to fetch events', err);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  /* ---------------- MAIN EVENT ---------------- */
  const handleCreateMainEvent = async (e) => {
    e.preventDefault();
    if (!mainForm.title || !mainForm.description) return;

    setCreatingMainEvent(true);
    try {
      const res = await fetchWithFallback('create_main_event.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mainForm)
      });
      if (!res || !res.ok) throw new Error('Create main event failed');
      const result = await res.json();
      if (result.success && result.event_id) {
        setSelectedEventId(result.event_id);
        setMainForm({ title: '', description: '' });
        await fetchEvents();
        setMessage({ type: 'success', text: 'Main event created successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create event.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error creating main event.' });
    } finally {
      setCreatingMainEvent(false);
    }
  };

  /* ---------------- SUB EVENT ---------------- */
  const handleAddSubField = () => {
    if (!subFieldInput.label) return;
    setSubEventInput(prev => ({
      ...prev,
      customFields: [...prev.customFields, { ...subFieldInput, field_order: prev.customFields.length }]
    }));
    setSubFieldInput({ label: '', type: 'text', required: true });
  };

  const handleRemoveSubField = (i) => {
    setSubEventInput(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, idx) => idx !== i)
    }));
  };

  const handleAddSubEvent = () => {
    if (!subEventInput.title) return;
    // if user selected "Other" prefer the custom_event_type value when available
    const eventType = subEventInput.event_type === 'Other'
      ? (subEventInput.custom_event_type || 'Other')
      : subEventInput.event_type;

    setSubEvents(prev => [...prev, { ...subEventInput, event_type: eventType }]);
    setSubEventInput({
      title: '', description: '', date: '', time: '', location: '', image: null,
      status: 'upcoming', points: '', event_type: 'General', customFields: []
    , custom_event_type: '' // clear custom type after adding
    });
  };

  const removeSubEvent = (i) => setSubEvents(prev => prev.filter((_, idx) => idx !== i));

  const handleSaveSubEvents = async () => {
    if (!selectedEventId) {
      setMessage({ type: 'error', text: 'Please create or select a main event first.' });
      return;
    } 
   
    setSavingSubEventsLoading(true);
    try {
      const subForm = new FormData();
      subForm.append('event_id', selectedEventId);

      // include the currently-filled subEventInput directly when saving (no Add button)
      const finalSubEvents = [...subEvents];
      if (subEventInput.title) {
        // normalize event_type: prefer custom_event_type when "Other" selected
        const eventType = subEventInput.event_type === 'Other'
          ? (subEventInput.custom_event_type || 'Other')
          : subEventInput.event_type;
        finalSubEvents.push({ ...subEventInput, event_type: eventType });
      }

      const subeventsData = finalSubEvents.map(sub => ({
        title: sub.title,
        description: sub.description,
        date: sub.date,
        time: sub.time,
        location: sub.location,
        status: sub.status,
        points: sub.points,
        event_type: sub.event_type
      }));
      subForm.append('subevents', JSON.stringify(subeventsData));
      finalSubEvents.forEach((sub, idx) => {
        if (sub.image instanceof File) subForm.append(`image_${idx}`, sub.image);
      });

      const subRes = await fetchWithFallback('create_sub_event.php', { method: 'POST', body: subForm });
      if (!subRes || !subRes.ok) throw new Error('Sub-event save failed');
      const subResult = await subRes.json();
      console.log('[SubEvent Save Result]', subResult);

      if (subResult && subResult.success) {
        // Custom fields
        if (Array.isArray(subResult.subevent_ids) && subResult.subevent_ids.length > 0) {
          for (let i = 0; i < finalSubEvents.length; i++) {
            const subEvent = finalSubEvents[i];
            const subeventId = subResult.subevent_ids[i];
            for (const field of subEvent.customFields) {
              // fire-and-forget acceptable here, but check response optionally
              const fieldRes = await fetchWithFallback('insert_subevent_field.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  subevent_id: subeventId,
                  label: field.label,
                  type: field.type,
                  required: field.required ? 1 : 0,
                  field_order: field.field_order
                })
              });
              if (fieldRes && !fieldRes.ok) {
                console.warn('Failed inserting custom field for subevent', subeventId);
              }
            }
          }
        }
        setSubEvents([]);
        // clear the current input as well after save
        setSubEventInput({
          title: '', description: '', date: '', time: '', location: '', image: null,
          status: 'upcoming', points: '', event_type: 'General', customFields: []
        });
        setMessage({ type: 'success', text: 'Sub-events saved successfully!' });
      } else {
        setMessage({ type: 'error', text: subResult.message || 'Failed to save sub-events.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving sub-events.' });
    } finally {
      setSavingSubEventsLoading(false);
    }
  };

  // --- Prevent selecting past dates/times ---
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const [minDate, setMinDate] = useState(getTodayDate());
  const [minTime, setMinTime] = useState(getCurrentTime());

  // keep minDate/minTime updated (minTime updates every minute)
  useEffect(() => {
    const id = setInterval(() => {
      setMinDate(getTodayDate());
      setMinTime(getCurrentTime());
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  /* ---------------- JSX ---------------- */
  return (
    <Layout>
      <SidebarNav />
      <Container>
        <Title>📅 Create Events and Activities</Title>

        {/* show global overlay while creating / saving */}
        {(creatingMainEvent || savingSubEventsLoading) && (
          <LoadingOverlay>
            <Spinner />
            <div style={{ fontWeight: 700, color: '#374151' }}>
              {creatingMainEvent ? 'Creating main event...' : 'Saving sub-events...'}
            </div>
          </LoadingOverlay>
        )}

        {/* ---------------- MAIN EVENT FORM ---------------- */}
        <FormPanel>
          <h3 style={{ color: '#2563eb' }}>Main Event</h3>
          <Form onSubmit={handleCreateMainEvent}>
            <InputGroup>
              <Input placeholder="Main Event Title" value={mainForm.title}
                onChange={e => setMainForm({ ...mainForm, title: e.target.value })} required />
            </InputGroup>
            <InputGroup style={{ flexBasis: '100%' }}>
              <TextArea rows="3" placeholder="Description" value={mainForm.description}
                onChange={e => setMainForm({ ...mainForm, description: e.target.value })} required />
            </InputGroup>
            <Button type="submit" disabled={creatingMainEvent}>
              {creatingMainEvent && <ButtonSpinner />}
              {creatingMainEvent ? 'Saving...' : '💾 Save Main Event'}
            </Button>
          </Form>

        </FormPanel>

        {/* ---------------- SUB EVENT FORM ---------------- */}
        <FormPanel>
          <h3 style={{ color: '#16a34a' }}>Sub-events</h3>
          {/* Select Existing Event */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select value={selectedEventId || ''} onChange={e => setSelectedEventId(e.target.value)} disabled={loadingEvents}>
              <option value="">Select Existing Event</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </Select>
            {loadingEvents && <InlineSpinner aria-hidden="true" title="Loading events" />}
          </div>
          <FieldGroup style={{ flexWrap: 'wrap' }}>
            <Input placeholder="Sub-event Title" value={subEventInput.title}
              onChange={e => setSubEventInput({ ...subEventInput, title: e.target.value })} />
            <Input placeholder="Description" value={subEventInput.description}
              onChange={e => setSubEventInput({ ...subEventInput, description: e.target.value })} />
            {/* date input: disallow past dates */}
            <Input
              type="date"
              value={subEventInput.date}
              min={minDate}
              onChange={e => {
                const newDate = e.target.value;
                setSubEventInput(prev => {
                  const updated = { ...prev, date: newDate };
                  // if choosing today ensure time is not in the past
                  if (newDate === minDate && prev.time && prev.time < minTime) {
                    updated.time = minTime;
                  }
                  return updated;
                });
              }}
            />
            {/* time input: if date === today, enforce min time */}
            <Input
              type="time"
              value={subEventInput.time}
              min={subEventInput.date === minDate ? minTime : undefined}
              onChange={e => {
                const t = e.target.value;
                if (subEventInput.date === minDate && t && t < minTime) {
                  // prevent selecting past time for today
                  setSubEventInput(prev => ({ ...prev, time: minTime }));
                } else {
                  setSubEventInput(prev => ({ ...prev, time: t }));
                }
              }}
            />
            <Input placeholder="Location" value={subEventInput.location}
              onChange={e => setSubEventInput({ ...subEventInput, location: e.target.value })} />
            <Select value={subEventInput.status} onChange={e => setSubEventInput({ ...subEventInput, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="done">Done</option>
            </Select>
            <Select value={subEventInput.event_type}
              onChange={e => setSubEventInput({ ...subEventInput, event_type: e.target.value })}>
              <option value="General">General</option>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
              <option value="Training">Training</option>
              <option value="Outreach">Outreach</option>
              <option value="Sports">Sports</option>
              <option value="Esports">Esports</option>
              <option value="Other">Other</option>
            </Select>

           {/* When "Other" is chosen show an input for the custom event type */}
           {subEventInput.event_type === 'Other' && (
             <Input
               placeholder="Specify event type"
               value={subEventInput.custom_event_type}
               onChange={e => setSubEventInput(prev => ({ ...prev, custom_event_type: e.target.value }))}
             />
           )}
            <Input type="number" placeholder="Points" value={subEventInput.points}
              onChange={e => setSubEventInput({ ...subEventInput, points: e.target.value })} />
            <Input type="file" accept="image/*"
              onChange={e => setSubEventInput({ ...subEventInput, image: e.target.files[0] })} />
          </FieldGroup>

          {/* Custom Fields */}
          <h4 style={{ color: '#475569', marginTop: '1rem' }}>Sub-event Custom Fields</h4>
          <FieldGroup>
            <Input placeholder="Field Label" value={subFieldInput.label}
              onChange={e => setSubFieldInput({ ...subFieldInput, label: e.target.value })} />
            <Select value={subFieldInput.type} onChange={e => setSubFieldInput({ ...subFieldInput, type: e.target.value })}>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </Select>

            {/* Removed the frontend "Required" checkbox — fields are required by default */}
            <Button type="button" onClick={handleAddSubField}>Add Field</Button>
          </FieldGroup>

          {subEventInput.customFields.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {subEventInput.customFields.map((f, i) => (
                <FieldGroup key={i}>
                  <span>{f.label} ({f.type}) {f.required ? '*' : ''}</span>
                  <DangerButton type="button" onClick={() => handleRemoveSubField(i)}><FaTrash /></DangerButton>
                </FieldGroup>
              ))}
            </div>
          )}

          {subEvents.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {subEvents.map((s, i) => (
                <FieldGroup key={i}>
                  <span>{s.title} — {s.date || '—'} — Points: {s.points || 0}</span>
                  <DangerButton type="button" onClick={() => removeSubEvent(i)}><FaTrash /></DangerButton>
                </FieldGroup>
              ))}
            </div>
          )}

          <Button type="button" onClick={handleSaveSubEvents} disabled={savingSubEventsLoading}>
            {savingSubEventsLoading && <ButtonSpinner />}
            {savingSubEventsLoading ? 'Saving...' : '💾 Save Sub-events'}
          </Button>
        </FormPanel>

        {/* Message Modal */}
        {message && (
           <MessageModalOverlay>
            <MessageModalBox type={message.type}>
              <MessageText type={message.type}>{message.text}</MessageText>
              <MessageModalButton
                type={message.type}
                onClick={() => setMessage(null)}
              >
                OK
              </MessageModalButton>
            </MessageModalBox>
          </MessageModalOverlay>
        )}
      </Container>
    </Layout>
  );
};

export default Events;
