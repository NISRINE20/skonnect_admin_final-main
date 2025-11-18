// src/styles/LoginStyles.js
import styled from "styled-components";

export const LoginContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background-color: #f3f4f6;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const BrandPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  background: linear-gradient(to bottom right, #1e3a8a, #3b82f6);
  text-align: center;

  img {
    height: 20rem;
    width: 20rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-top: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: #bfdbfe;
    margin-top: 0.5rem;
  }

  .icon-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: #93c5fd;
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const FormSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f9fafb;
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 26rem;
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  text-align: center;

img {
    height: 5rem;
    width: 5rem;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
  }

  p {
    font-size: 0.9rem;
    color: #6b7280;
  }

  form {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #111827;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
  }

  button {
    background: #2563eb;
    color: white;
    font-weight: 500;
    border: none;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: #1d4ed8;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .status {
    margin-top: 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    &.error {
      color: #dc2626;
    }
    &.success {
      color: #16a34a;
    }
  }
`;
