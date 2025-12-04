import React from 'react';
import styled from 'styled-components';
import { Settings, LogOut, Menu, X } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../Notifications/NotificationCenter';

const HeaderContainer = styled.header`
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.lg};
`;

const LogoText = styled.h1`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.sm};
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.weights.medium};
  font-size: ${theme.typography.sizes.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 28px;
    height: 28px;
    font-size: ${theme.typography.sizes.xs};
  }
`;

const UserName = styled.span`
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.primary};
    color: white;
    border-color: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: flex;
  }
`;

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { state, logout } = useAuth();
  const userName = state.user?.name || "Usuário";

  return (
    <HeaderContainer>
      <Logo>
        <MobileMenuButton onClick={onToggleSidebar} title="Menu">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </MobileMenuButton>
        <LogoIcon>S</LogoIcon>
        <LogoText>Serena</LogoText>
      </Logo>

      <HeaderActions>
        <NotificationCenter />

        <ActionButton title="Configurações">
          <Settings size={20} />
        </ActionButton>

        <UserInfo>
          <UserAvatar>
            {userName.split(' ').map(n => n[0]).join('')}
          </UserAvatar>
          <UserName>{userName}</UserName>
        </UserInfo>

        <ActionButton title="Sair" onClick={logout}>
          <LogOut size={20} />
        </ActionButton>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
