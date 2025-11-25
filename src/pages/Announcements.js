import React, { useState, useEffect } from "react";
import {
  PageContainer,
  ContentContainer,
  SectionHeader,
  Form,
  Input,
  TextArea,
  Select,
  Button,
  CardGrid,
  Card,
  CardTitle,
  CardBody,
  CardDate,
  HighlightsSection,
  HighlightCard,
  HighlightImage,
  HighlightContent,
  HighlightTitle,
  HighlightDesc,
  ModalOverlay,
  ModalBox,
  ModalActions,
  UploadLabel,
  AnnouncementScroll,
  HighlightsScroll,
} from "./../styles/AnnounceStyle";
import styled from "styled-components";

import SidebarNav from "../components/Sidebar";
import { FaBullhorn, FaStar, FaTrash, FaImage, FaEdit } from "react-icons/fa";

/* --- Revised loading overlay styles to match Dashboard --- */
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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
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

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDesc, setHighlightDesc] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [highlightImage, setHighlightImage] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // New state for image preview
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [highlightLoading, setHighlightLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  /* --- NEW: loading / busy states --- */
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const response = await fetch(
        "https://vynceianoani.helioho.st/skonnect-api/announcements.php"
      );
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    try {
      const response = await fetch(
        "https://vynceianoani.helioho.st/skonnect-api/announcements.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message, type: category }),
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchAnnouncements();
        setTitle("");
        setCategory("General");
        setMessage("");
      } else {
        console.error("Failed to post announcement:", data.error);
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    setLoadingHighlights(true);
    try {
      const response = await fetch(
        "https://vynceianoani.helioho.st/skonnect-api/highlights.php"
      );
      const data = await response.json();
      setHighlights(data);
    } catch (error) {
      console.error("Failed to fetch highlights:", error);
    } finally {
      setLoadingHighlights(false);
    }
  };

  // Update the postHighlight function to match API expectations
  const postHighlight = async (e) => {
    e.preventDefault();
    if (!highlightTitle.trim() || !highlightDesc.trim() || !highlightText.trim() || highlightLoading) return;
    if (!highlightImage && !editingHighlight) {
      alert('Please select an image');
      return;
    }

    setHighlightLoading(true);
    try {
      const endpoint = editingHighlight
        ? 'https://vynceianoani.helioho.st/skonnect-api/edit_highlight.php'
        : 'https://vynceianoani.helioho.st/skonnect-api/highlights.php';
      const method = editingHighlight ? 'PUT' : 'POST';

      // Match the API's expected payload structure
      const body = {
        title: highlightTitle,
        description: highlightDesc,
        articleText: highlightText, // Changed from article_text to articleText
        image: highlightImage,
        ...(editingHighlight && { id: editingHighlight.id })
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        // Fetch fresh data after successful post
        const data = await fetch('https://vynceianoani.helioho.st/skonnect-api/highlights.php').then(r => r.json());
        setHighlights(data);
        resetHighlightForm();
      } else {
        alert(result.error || 'Failed to save highlight');
      }
    } catch (err) {
      console.error('Highlight post error:', err);
      alert('Failed to save highlight');
    } finally {
      setHighlightLoading(false);
    }
  };
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Removed size limiter (previous 5MB check)
    // Still validate common image MIME types
    if (!file.type.match('image/(jpeg|png|gif|bmp|webp)')) {
      alert('Supported image types: JPEG, PNG, GIF, BMP, WEBP');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
        setHighlightImage(reader.result);
        setImagePreview(reader.result);
      } else {
        alert('Invalid image');
      }
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const resetHighlightForm = () => {
    setHighlightTitle('');
    setHighlightDesc('');
    setHighlightText('');
    setHighlightImage('');
    setImagePreview('');
    setEditingHighlight(null);
  };

  const handleEditHighlight = (h) => {
    setEditingHighlight(h);
    setHighlightTitle(h.title || '');
    setHighlightDesc(h.description || '');
    setHighlightText(h.article_text || '');
    setHighlightImage(h.image || '');
    setImagePreview(h.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id, type = "announcement") => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);
    if (itemToDelete.type === "announcement") {
      try {
        const res = await fetch('https://vynceianoani.helioho.st/skonnect-api/delete_announcement.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemToDelete.id }),
        });

        const result = await res.json();

        if (result.success) {
          setAnnouncements(prev => prev.filter(a => a.id !== itemToDelete.id));
        } else {
          alert(result.error || 'Failed to delete announcement');
        }
      } catch (err) {
        console.error('Delete announcement error:', err);
        alert('Failed to delete announcement');
      } finally {
        setDeletingId(null);
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    } else if (itemToDelete.type === "highlight") {
      // use same modal confirmation flow for highlights
      try {
        const res = await fetch('https://vynceianoani.helioho.st/skonnect-api/delete_highlight.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemToDelete.id })
        });
        const result = await res.json();
        if (result.success) {
          setHighlights(prev => prev.filter(h => h.id !== itemToDelete.id));
        } else {
          alert(result.error || 'Failed to delete highlight');
        }
      } catch (err) {
        console.error('Delete highlight err:', err);
        alert('Failed to delete highlight');
      } finally {
        setDeletingId(null);
        setShowDeleteModal(false);
        setItemToDelete(null);
      }
    }
  };


  const handleDeleteHighlight = (id) => {
    // open the shared delete confirmation modal for highlights
    setItemToDelete({ id, type: 'highlight' });
    setShowDeleteModal(true);
  };


  // Clean up the preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);



  return (
    <PageContainer>
      {/* --- Busy overlay shown for initial load / posting / deleting / highlight actions --- */}
      {(loadingAnnouncements || loadingHighlights || postingAnnouncement || highlightLoading || deletingId) && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>
            {deletingId ? "Deleting..." : postingAnnouncement ? "Posting..." : highlightLoading ? "Saving highlight..." : "Loading data..."}
          </LoadingText>
          <LoadingSubtext>
            Please wait while we fetch your data
          </LoadingSubtext>
        </LoadingOverlay>
      )}

      <SidebarNav />
      <ContentContainer>
        {/* Announcements Section */}
        <SectionHeader>
          <FaBullhorn style={{ color: "#2563eb", marginRight: "8px" }} />
          Announcements
        </SectionHeader>

        <Form onSubmit={async (e) => {
          e.preventDefault();
          // prevent double submits
          if (postingAnnouncement) return;
          if (!title || !message) return;
          setPostingAnnouncement(true);
          try {
            const response = await fetch("https://vynceianoani.helioho.st/skonnect-api/announcements.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, message, type: category }),
            });

            const data = await response.json();
            if (data.success) {
              await fetchAnnouncements();
              setTitle("");
              setCategory("General");
              setMessage("");
            } else {
              console.error("Failed to post announcement:", data.error);
            }
          } catch (error) {
            console.error("Error posting announcement:", error);
          } finally {
            setPostingAnnouncement(false);
          }
        }}>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Event">Event</option>
            <option value="Alert">Alert</option>
            <option value="Reminder">Reminder</option>
          </Select>
          <TextArea
            placeholder="Type announcement message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" disabled={postingAnnouncement}>{postingAnnouncement ? 'Posting...' : 'Post'}</Button>
        </Form>

        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          <AnnouncementScroll>
            {announcements.map((a) => (
              <Card key={a.id}>
                <CardTitle>
                  {a.title}
                  <FaTrash
                    style={{
                      cursor: "pointer",
                      color: "#ef4444",
                      position: "absolute", // detach from flex
                      top: "15px",           // distance from top of card
                      right: "15px",         // distance from right of card
                      fontSize: "1.1rem",
                    }}
                    onClick={() => handleDelete(a.id, "announcement")}
                  />

                </CardTitle>

                <CardDate>
                  {a.type} • {new Date(a.created_at).toLocaleDateString()}
                </CardDate>
                <CardBody>{a.message}</CardBody>
                {a.message.length > 150 && ( // show See More only if text is long
                  <Button
                    variant="secondary"
                    style={{ fontSize: '0.85rem', padding: '0.3rem 0.6rem', marginTop: 'auto' }}
                    onClick={() => {
                      setModalContent(a);
                      setShowModal(true);
                    }}
                  >
                    See More
                  </Button>
                )}
              </Card>
            ))}
          </AnnouncementScroll>
        )}


        {showModal && modalContent && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <CardTitle>{modalContent.title}</CardTitle>
              <CardBody
                style={{
                  whiteSpace: 'pre-wrap',   // preserve line breaks
                  wordWrap: 'break-word',   // break long words
                  overflow: 'visible',
                }}
              >
                {modalContent.message}
              </CardBody>
              <CardDate>
                {modalContent.type} • {new Date(modalContent.created_at).toLocaleDateString()}
              </CardDate>
              <ModalActions>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        )}


        {/* Highlights Section */}
        <HighlightsSection>
          <SectionHeader>
            <FaStar style={{ color: "#facc15", marginRight: "8px" }} />
            Highlights
          </SectionHeader>

          <Form onSubmit={postHighlight}>
            <Input
              placeholder="Highlight Title"
              value={highlightTitle}
              onChange={(e) => setHighlightTitle(e.target.value)}
            />
            <Input
              placeholder="Short description"
              value={highlightDesc}
              onChange={(e) => setHighlightDesc(e.target.value)}
            />
            <UploadLabel htmlFor="highlightImage">
              <FaImage /> Upload Image
              <input
                id="highlightImage"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageSelect}
              />
            </UploadLabel>
            {imagePreview && (
              <div style={{
                marginTop: "10px",
                marginBottom: "10px",
                maxWidth: "200px"
              }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "4px"
                  }}
                />
              </div>
            )}
            <TextArea
              placeholder="Full article text..."
              value={highlightText}
              onChange={(e) => setHighlightText(e.target.value)}
            />
            <Button type="submit" disabled={highlightLoading}>
              {editingHighlight ? 'Update' : 'Add'} Highlight
            </Button>
          </Form>

          {highlights.length === 0 ? (
            <p>No highlights yet.</p>
          ) : (
            <HighlightsScroll style={{ padding: "0 4px" }}>
              {highlights.map((h) => (
                <HighlightCard key={h.id}>
                  {h.image && <HighlightImage src={h.image} alt="Highlight" />}
                  <HighlightContent>
                    <HighlightTitle>{h.title}</HighlightTitle>
                    <HighlightDesc>{h.description}</HighlightDesc>
                    <CardDate>{new Date(h.created_at).toLocaleDateString()}</CardDate>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '0.75rem' }}>
                      <FaTrash
                        style={{ cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem' }}
                        onClick={() => handleDeleteHighlight(h.id)}
                      />
                      <FaEdit
                        style={{ cursor: 'pointer', color: '#3b82f6', fontSize: '1.1rem' }}
                        onClick={() => handleEditHighlight(h)}
                      />
                    </div>
                  </HighlightContent>
                </HighlightCard>
              ))}
            </HighlightsScroll>

          )}
        </HighlightsSection>
      </ContentContainer>

      {showDeleteModal && (
        <ModalOverlay>
          <ModalBox>
            <p>Are you sure you want to delete this item?</p>
            <ModalActions>
              <Button variant="delete" onClick={confirmDelete} disabled={!!deletingId}>
                <FaTrash style={{ marginRight: "6px" }} />
                {deletingId ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={!!deletingId}
              >
                Cancel
              </Button>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
