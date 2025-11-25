import React, { useState, useEffect } from "react";
import SidebarNav from "../components/Sidebar";
import { Container, Main } from "../styles/DashboardStyles";
import {
  CalendarContainer,
  TopBar,
  SearchForm,
  SearchInput,
  SearchButton,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalForm,
  ModalInput,
  ModalButton,
} from "../styles/CalendarStyles";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from 'date-fns';

// Styled components
const CalendarEventContent = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  gap: 0.5rem;

  .event-content {
    flex: 1;
    min-width: 0;
  }

  .event-title {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .event-time,
  .event-location {
    font-size: 0.75rem;
    color: #666;
  }
`;

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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* added loading text/subtext to match Dashboard style */
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

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  z-index: 50;
  margin-top: 0.25rem;
`;

const SearchResultItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover { background-color: #f3f4f6; }
  
  .title { font-weight: 600; }
  .date { font-size: 0.875rem; color: #6b7280; }
`;

const SearchSection = styled.div` position: relative; width: 100%; `;
const TypeLabel = styled.div`
  font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase;
  padding: 0.25rem 1rem;
`;

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({ title: "", date: "", time: "" });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [calendarRef, setCalendarRef] = useState(null);

  // Fetch events from sub_events
const fetchEvents = async () => {
  setLoading(true);
  try {
    const res = await fetch("https://vynceianoani.helioho.st/skonnect-api/sub_events_calendar.php");
    if (!res.ok) throw new Error("Server unreachable");

    const data = await res.json();
    console.log("Fetched Events from API:", data);

    // Use API data directly since it already has `start`, `allDay`, and `extendedProps`
    setEvents(data);

  } catch (err) {
    console.error("Error loading events", err);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => { fetchEvents(); }, []);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      location: clickInfo.event.extendedProps.location
    });
    setShowModal(true);
  };

  const handleSearch = (searchValue) => {
    const term = searchValue.toLowerCase();
    if (!term) return setSearchResults([]);

    const directMatches = events.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.extendedProps.location.toLowerCase().includes(term)
    );

    setSearchResults(directMatches.map(event => ({ ...event, isRecommended: false })));
  };

  const EventDetailsModal = () => (
    <ModalContent onClick={(e) => e.stopPropagation()}>
      <ModalHeader>Event Details</ModalHeader>
      {selectedEvent && (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
          <p className="mb-2"><strong>Date:</strong> {format(new Date(selectedEvent.start), 'MMMM d, yyyy')}</p>
          {!selectedEvent.allDay && <p className="mb-2"><strong>Time:</strong> {format(new Date(selectedEvent.start), 'h:mm a')}</p>}
          <p className="mb-2"><strong>Location:</strong> {selectedEvent.location}</p>
          <div className="flex justify-end">
            <ModalButton onClick={() => setShowModal(false)}>Close</ModalButton>
          </div>
        </div>
      )}
    </ModalContent>
  );

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventData.title || !eventData.date) return alert("Please enter a title and date.");

    let startDateTime = eventData.date;
    if (eventData.time) startDateTime += "T" + eventData.time;

    setEvents([...events, { title: eventData.title, start: startDateTime, allDay: !eventData.time }]);
    setShowModal(false);
    setEventData({ title: "", date: "", time: "" });
  };

  return (
    <Container>
      <SidebarNav />
      <Main>
        <CalendarContainer>
          <TopBar>
            <SearchSection>
              <SearchForm onSubmit={(e) => e.preventDefault()}>
                <SearchInput
                  type="search"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <SearchButton type="button"><FaSearch /></SearchButton>
              </SearchForm>

              {searchResults.length > 0 && searchTerm && (
                <SearchResults>
                  {searchResults.map(event => (
                    <SearchResultItem
                      key={event.id}
                      onClick={() => {
                        if (calendarRef) {
                          const calendarApi = calendarRef.getApi();
                          calendarApi.gotoDate(event.start);
                          calendarApi.changeView('listWeek');
                          setSearchResults([]);
                          setSearchTerm('');
                        }
                      }}
                    >
                      <div className="title">{event.title}</div>
                      <div className="date">{format(new Date(event.start), 'MMMM d, yyyy')}</div>
                    </SearchResultItem>
                  ))}
                </SearchResults>
              )}
            </SearchSection>
          </TopBar>

          <h2 className="font-bold text-lg mb-1">Calendar of Activities</h2>
          <div style={{ position: 'relative' }}>
            {loading && (
              <LoadingOverlay>
                <Spinner />
                <LoadingText>Loading Calendar...</LoadingText>
                <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
              </LoadingOverlay>
            )}

            <FullCalendar
              ref={(el) => setCalendarRef(el)}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              events={events}
              eventClick={handleEventClick}
              eventContent={(arg) => (
                <CalendarEventContent>
                  <div className="event-content">
                    <div className="event-title">{arg.event.title}</div>
                    {!arg.event.allDay && <div className="event-time">{format(arg.event.start, 'h:mm a')}</div>}
                    {arg.event.extendedProps.location && <div className="event-location">{arg.event.extendedProps.location}</div>}
                  </div>
                </CalendarEventContent>
              )}
              height="auto"
            />
          </div>

          {showModal && (
            <ModalBackdrop onClick={() => setShowModal(false)}>
              <EventDetailsModal />
            </ModalBackdrop>
          )}
        </CalendarContainer>
      </Main>
    </Container>
  );
};

export default Calendar;
