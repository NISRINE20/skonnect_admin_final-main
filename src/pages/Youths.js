import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SidebarNav from '../components/Sidebar';
import { FaUser, FaMapMarkerAlt, FaPhone, FaGraduationCap, FaBriefcase, FaHeart, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { fetchWithFallback } from '../utils/fetchWithFallback';


const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
  transition: background 0.3s;
`;

const PageWrapper = styled.div`
  margin-left: 240px; // Match sidebar width
  flex: 1;
  padding: 2rem;
  background: ${({ dark }) => (dark ? '#18181b' : '#f3f5f9')};
  min-height: 100vh;
  transition: background 0.3s;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const SearchBar = styled.input`
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 350px;
  display: block;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Thead = styled.thead`
  background: #3b82f6;
  color: white;

  th {
    padding: 0.75rem;
    font-size: 0.875rem;
    text-align: left;
    font-weight: 600;
  }
`;

const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid #e5e7eb;

    &:hover {
      background: #f9fafb;
    }
  }

  td {
    padding: 0.75rem;
    font-size: 0.875rem;
    color: #374151;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

const Section = styled.div`
  margin-bottom: 1rem;
  
  h3 {
    color: #3b82f6;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const Info = styled.p`
  color: #374151;
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

const Badge = styled.span`
  background: ${props => props.color || '#3b82f6'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  &:hover {
    color: #1f2937;
  }
`;

const ViewButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  
  &:hover {
    background: #2563eb;
  }
`;

/* small spinner for buttons */
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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* ---------- ADD: Page loading overlay + spinner (match Dashboard style) ---------- */
const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  flex-direction: column;
`;

const Spinner = styled.div`
  border: 4px solid #e5e7eb;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 0.9s linear infinite;
  margin-bottom: 12px;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const LoadingText = styled.div`
  color: #374151;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 0;
`;

const LoadingSubtext = styled.div`
  color: #374151;
  font-size: 0.95rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #3b82f6;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  background: ${props => props.variant === 'accept' ? '#059669' : '#dc2626'};
  color: white;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.variant === 'accept' ? '#047857' : '#b91c1c'};
  }
`;

const AuthModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const AuthModalBox = styled.div`
  background: #fff;
  color: #0f172a;
  border-radius: 0.75rem;
  padding: 1.25rem;
  width: 360px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.12);
`;

const AuthInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
`;

const AuthActions = styled.div`
  display:flex;
  gap:0.5rem;
  justify-content:flex-end;
`;

/* ---------- Admin auth modal (require password before sensitive actions) ---------- */

const YouthPage = () => {
  const [youths, setYouths] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  // per-button loading keys
  const [loadingKeys, setLoadingKeys] = useState(new Set());
  const [selectedYouth, setSelectedYouth] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('skonnect_dark_mode');
    return saved === 'true';
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [authOpen, setAuthOpen] = useState(false);
  const [authAction, setAuthAction] = useState(null); // 'view' | 'accept'
  const [authTarget, setAuthTarget] = useState(null); // youth object or id
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const startLoading = (key) => {
    setLoadingKeys(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const stopLoading = (key) => {
    setLoadingKeys(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const isLoadingKey = (key) => loadingKeys.has(key);

  const fetchYouths = async () => {
    try {
      const mainRes = await fetch("https://skonnect.atwebpages.com/youths.php");
      if (!mainRes.ok) throw new Error('Main server unreachable');
      const data = await mainRes.json();
      setYouths(data);
    } catch (err) {
      try {
        const fallbackRes = await fetch("https://vynceianoani.helioho.st/skonnect-api/youths.php");
        const data = await fallbackRes.json();
        setYouths(data);
      } catch (fallbackErr) {
        console.error("Error loading youth data", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYouths();
  }, []);

  const filteredYouths = youths.filter(youth => {
    const matchesSearch = Object.values(youth)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || youth.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredYouths.length / usersPerPage);
  const paginatedYouths = filteredYouths.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Reset to first page if filter/search changes and current page is out of range
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const requestAdminAuth = (action, target) => {
    setAuthAction(action);
    setAuthTarget(target);
    setAuthPassword("");
    setAuthError(null);
    setAuthOpen(true);

    // start the button loading spinner immediately for the clicked control
    const id = typeof target === 'object' ? target?.id : target;
    if (!id) return;
    if (action === 'view') startLoading(`view_${id}`);
    if (action === 'accept') startLoading(`status_${id}_accept`);
    if (action === 'reject') startLoading(`status_${id}_reject`);
  };

  const stopAuthButtonLoading = () => {
    const id = typeof authTarget === 'object' ? authTarget?.id : authTarget;
    if (!id) return;
    if (authAction === 'view') stopLoading(`view_${id}`);
    if (authAction === 'accept') stopLoading(`status_${id}_accept`);
    if (authAction === 'reject') stopLoading(`status_${id}_reject`);
  };

  const verifyAdminPassword = async (password) => {
    setAuthLoading(true);
    try {

      const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';


      const constantTimeCompare = (a, b) => {
        if (a.length !== b.length) return false;
        let result = 0;
        for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        return result === 0;
      };


      const ok = constantTimeCompare(password, ADMIN_PASSWORD);
      setAuthLoading(false);
      return ok;
    } catch (err) {
      setAuthLoading(false);
      console.error("Auth verify error", err);
      return false;
    }
  };

  const handleAuthConfirm = async () => {
    setAuthError(null);
    const ok = await verifyAdminPassword(authPassword);
    if (!ok) {
      setAuthError("Invalid admin password");
      // stop the button spinner so it doesn't stay stuck on bad password
      stopAuthButtonLoading();
      return;
    }

    // password valid -> perform action
    try {
      if (authAction === "view") {
        // show youth details (authTarget is the youth object)
        setSelectedYouth(authTarget);
        // stop the view button loading now that view succeeded
        stopAuthButtonLoading();
        setAuthOpen(false);
        return;
      }

      if (authAction === "accept" || authAction === "reject") {
        // authTarget is the youth id for status changes
        const newStatus = authAction === "accept" ? "accepted" : "rejected";
        await handleStatusChange(authTarget, newStatus);
        // handleStatusChange will stop its own loading key
        setAuthOpen(false);
        return;
      }
    } catch (err) {
      console.error("Auth action error", err);
      setAuthError("An error occurred while performing the action");
      stopAuthButtonLoading();
    }
  };

  const handleStatusChange = async (youthId, newStatus) => {
    const actionSuffix = newStatus === 'accepted' ? 'accept' : 'reject';
    const key = `status_${youthId}_${actionSuffix}`;
    startLoading(key);
    try {
      // If accepting, send the acceptance email first. Only update status when email send succeeds.
      if (newStatus === 'accepted') {
        const acceptedYouth = youths.find(y => y.id === youthId);

        if (!acceptedYouth || !acceptedYouth.email) {
          window.alert('Cannot accept: no email address available for this youth.');
          stopLoading(key);
          return;
        }

        try {
          // keep the original PHP endpoint for send_acceptance.php (no fallback)
          const emailResp = await fetch('https://vynceianoani.helioho.st/skonnect/send_acceptance.php', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ id: youthId, email: acceptedYouth.email, full_name: acceptedYouth.full_name })
           });
 
           if (!emailResp.ok) {
             console.error('Email endpoint returned non-OK status', emailResp.status);
             window.alert('Failed to send acceptance email. Status not changed.');
             stopLoading(key);
             return;
           }
 
           let emailJson = null;
           try { emailJson = await emailResp.json(); } catch (e) { /* ignore parse errors */ }
           if (emailJson && emailJson.success === false) {
             console.error('Email endpoint reported failure:', emailJson);
             window.alert('Failed to send acceptance email. Status not changed.');
             stopLoading(key);
             return;
           }
         } catch (emailErr) {
           console.error('Error sending acceptance email:', emailErr);
           window.alert('Error sending acceptance email. Status not changed.');
           stopLoading(key);
           return;
         }
      }

      // Proceed to update status on server via fallback helper
      const response = await fetchWithFallback('update_youth_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: youthId, status: newStatus })
      });

      if (response.ok) {
        // Try to parse JSON response (optional)
        try {
          const json = await response.json();
          if (json && json.success === false) {
            console.error('Server reported failure updating status', json);
            window.alert('Failed to update status on server.');
          } else {
            setYouths(prev => prev.map(y => (y.id === youthId ? { ...y, status: newStatus } : y)));
          }
        } catch {
          // If not JSON, optimistically update local state
          setYouths(prev => prev.map(y => (y.id === youthId ? { ...y, status: newStatus } : y)));
        }
      } else {
        console.error('Failed to update status on server:', response.status);
        window.alert('Failed to update status on server.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      window.alert('An error occurred while changing status.');
    } finally {
      stopLoading(key);
    }
  };

  return (
    <Layout dark={darkMode}>
      <SidebarNav darkMode={darkMode} />
      <PageWrapper dark={darkMode}>
        <Title>Youth Directory</Title>

        {/* ---------- SHOW full-page loading overlay when loading ---------- */}
        {loading && (
          <LoadingOverlay>
            <Spinner />
            <LoadingText>Loading Youth Directory...</LoadingText>
            <LoadingSubtext>Please wait while we fetch your data</LoadingSubtext>
          </LoadingOverlay>
        )}

        <FilterBar>
          <FilterButton 
            active={statusFilter === 'all'} 
            onClick={() => setStatusFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'pending'} 
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'accepted'} 
            onClick={() => setStatusFilter('accepted')}
          >
            Accepted
          </FilterButton>
          <FilterButton 
            active={statusFilter === 'rejected'} 
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </FilterButton>
        </FilterBar>

        <SearchBar
          type="text"
          placeholder="Search youths..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        
        {!loading && (
          <>
            <Table>
              <Thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </Thead>
              <Tbody>
                {paginatedYouths.map(youth => (
                  <tr key={youth.id}>
                    <td>{youth.full_name}</td>
                    <td>{youth.contact}</td>
                    <td>{youth.email}</td>
                    <td>{youth.complete_address}</td>
                    <td>
                      <Badge color={
                        youth.status === 'accepted' ? '#059669' :
                        youth.status === 'rejected' ? '#dc2626' :
                        '#3b82f6'
                      }>
                        {youth.status || 'pending'}
                      </Badge>
                    </td>
                    <td>
                      <ActionButtons>
                        <ViewButton
                          onClick={() => requestAdminAuth('view', youth)}
                          disabled={isLoadingKey(`view_${youth.id}`)}
                          aria-disabled={isLoadingKey(`view_${youth.id}`)}
                        >
                          {isLoadingKey(`view_${youth.id}`) && <ButtonSpinner />}
                          <FaEye /> View
                        </ViewButton>
                        {youth.status === 'pending' && (
                          <ActionButtonGroup>
                            <ActionButton 
                              variant="accept"
                              onClick={() => requestAdminAuth('accept', youth.id)}
                              title="Accept youth registration"
                              disabled={isLoadingKey(`status_${youth.id}_accept`)}
                              aria-label="Accept youth registration"
                            >
                              {isLoadingKey(`status_${youth.id}_accept`) && <ButtonSpinner />}
                              <FaCheck size={14} aria-hidden="true" />
                            </ActionButton>
                            <ActionButton 
                              variant="reject"
                              onClick={() => requestAdminAuth('reject', youth.id)}
                              title="Reject youth registration"
                              disabled={isLoadingKey(`status_${youth.id}_reject`)}
                              aria-label="Reject youth registration"
                            >
                              {isLoadingKey(`status_${youth.id}_reject`) && <ButtonSpinner />}
                              <FaTimes size={14} aria-hidden="true" />
                            </ActionButton>
                          </ActionButtonGroup>
                        )}
                        {youth.status === 'rejected' && (
                          <ActionButton 
                            variant="accept"
                            onClick={() => requestAdminAuth('accept', youth.id)}
                            title="Move to accepted"
                            disabled={isLoadingKey(`status_${youth.id}_accept`)}
                            aria-label="Move to accepted"
                          >
                            {isLoadingKey(`status_${youth.id}_accept`) && <ButtonSpinner />}
                            <FaCheck size={14} aria-hidden="true" />
                          </ActionButton>
                        )}
                        {youth.status === 'accepted' && (
                          <ActionButton 
                            variant="reject"
                            onClick={() => requestAdminAuth('reject', youth.id)}
                            title="Move to rejected"
                            disabled={isLoadingKey(`status_${youth.id}_reject`)}
                            aria-label="Move to rejected"
                          >
                            {isLoadingKey(`status_${youth.id}_reject`) && <ButtonSpinner />}
                            <FaTimes size={14} aria-hidden="true" />
                          </ActionButton>
                        )}
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </Tbody>
            </Table>
            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1.5rem 0' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  marginRight: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  background: currentPage === 1 ? '#f3f4f6' : '#fff',
                  color: '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ margin: '0 1rem', fontWeight: 500 }}>
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '0.5rem 1rem',
                  marginLeft: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  background: currentPage === totalPages || totalPages === 0 ? '#f3f4f6' : '#fff',
                  color: '#374151',
                  cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </>
        )}

        {selectedYouth && (
          <Modal onClick={() => setSelectedYouth(null)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={() => setSelectedYouth(null)}>×</CloseButton>
              
              <Section>
                <h3><FaUser /> Personal Information</h3>
                <Info><strong>Name:</strong> {selectedYouth.full_name}</Info>
                <Info><strong>Birthdate:</strong> {selectedYouth.birthdate}</Info>
                <Info><strong>Birthplace:</strong> {selectedYouth.place_of_birth}</Info>
                <Info><strong>Gender:</strong> {selectedYouth.gender}</Info>
                <Info><strong>Interests:</strong> {selectedYouth.interests}</Info>
                <Info><strong>Civil Status:</strong> {selectedYouth.civil_status}</Info>
                <Info><strong>Religion:</strong> {selectedYouth.religion}</Info>
                <Info><strong>Blood Type:</strong> {selectedYouth.blood_type}</Info>
              </Section>

              <Section>
                <h3><FaPhone /> Contact Information</h3>
                <Info><strong>Primary Contact:</strong> {selectedYouth.contact}</Info>
                <Info><strong>Alternative Contact:</strong> {selectedYouth.alt_contact}</Info>
                <Info><strong>Email:</strong> {selectedYouth.email}</Info>
                <Info><strong>Facebook:</strong> {selectedYouth.facebook_account}</Info>
              </Section>

              <Section>
                <h3><FaMapMarkerAlt /> Address</h3>
                <Info>{selectedYouth.complete_address}</Info>
              </Section>

              <Section>
                <h3><FaGraduationCap /> Education & Employment</h3>
                <Info><strong>Education:</strong> {selectedYouth.educational_attainment}</Info>
                <Info><strong>Employment:</strong> {selectedYouth.employment_status}</Info>
                {selectedYouth.other_employment && (
                  <Info><strong>Other Employment:</strong> {selectedYouth.other_employment}</Info>
                )}
              </Section>

              <Section>
                <h3><FaBriefcase /> Youth Information</h3>
                <Info><strong>Classification:</strong> {selectedYouth.youth_classification}</Info>
                <Info><strong>Voter Status:</strong> {selectedYouth.voter_status}</Info>
                <Info><strong>Organizations:</strong> {selectedYouth.youth_organizations}</Info>
                <Info>
                  <strong>Vaccination Status:</strong> 
                  <Badge color={parseInt(selectedYouth.is_vaccinated) === 1 ? '#059669' : '#dc2626'}>
                    {parseInt(selectedYouth.is_vaccinated) === 1 ? 'Vaccinated' : 'Not Vaccinated'}
                  </Badge>
                </Info>
              </Section>

              <Section>
                <h3><FaHeart /> Emergency Contact</h3>
                <Info><strong>Name:</strong> {selectedYouth.emergency_contact_person}</Info>
                <Info><strong>Relationship:</strong> {selectedYouth.emergency_relationship}</Info>
                <Info><strong>Contact:</strong> {selectedYouth.emergency_contact}</Info>
                <Info><strong>Address:</strong> {selectedYouth.emergency_address}</Info>
              </Section>
            </ModalContent>
          </Modal>
        )}

        {authOpen && (
          <AuthModalOverlay onClick={() => { stopAuthButtonLoading(); setAuthOpen(false); }}>
            <AuthModalBox onClick={e => e.stopPropagation()}>
              <h3 style={{ margin: 0, marginBottom: 8 }}>
                {authAction === "view" ? "Admin Password Required" : "Confirm Accept Account"}
              </h3>
              <div style={{ fontSize: 0.95, color: "#475569" }}>
                {authAction === "view" ? "Enter admin password to view youth details." : "Enter admin password to move this rejected account to accepted."}
              </div>
              <AuthInput
                type="password"  
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="Admin password"
                autoFocus
              />
              {authError && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{authError}</div>}
              <AuthActions>
                <button onClick={() => { stopAuthButtonLoading(); setAuthOpen(false); }} style={{ padding: "0.5rem 0.75rem", borderRadius: 6 }}>Cancel</button>
                <button
                  onClick={handleAuthConfirm}
                  disabled={authLoading || !authPassword}
                  style={{ background: "#2563eb", color: "#fff", padding: "0.5rem 0.75rem", borderRadius: 6, border: "none" }}
                >
                  {authLoading ? "Verifying..." : "Confirm"}
                </button>
              </AuthActions>
            </AuthModalBox>
          </AuthModalOverlay>
        )}
      </PageWrapper>
    </Layout>
  );
};

export default YouthPage;
