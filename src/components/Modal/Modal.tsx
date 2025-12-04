import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { theme } from '../../styles/theme';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    align-items: flex-start;
    padding-top: ${theme.spacing.lg};
  }
`;

const ModalContent = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.xl};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  ${props => {
    switch (props.size) {
      case 'small':
        return `width: 400px; max-width: 90vw;`;
      case 'large':
        return `width: 800px; max-width: 90vw;`;
      default:
        return `width: 600px; max-width: 90vw;`;
    }
  }}

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100% !important;
    max-width: 100% !important;
    max-height: 95vh;
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.lg};
  }
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.status.error};
    color: white;
    border-color: ${theme.colors.status.error};
  }
`;

const ModalBody = styled.div`
  padding: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.lg};
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  footer
}) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent size={size} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {children}
        </ModalBody>

        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
