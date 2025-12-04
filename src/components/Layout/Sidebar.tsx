import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Shield,
  UserCheck,
  BarChart3,
  Settings,
  UserCog
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
  superAdminOnly?: boolean;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const SidebarContainer = styled.aside<{ isOpen?: boolean }>`
  width: 280px;
  background: ${theme.colors.surface};
  border-right: 1px solid ${theme.colors.border};
  height: calc(100vh - 80px);
  position: fixed;
  left: 0;
  top: 80px;
  overflow-y: auto;
  z-index: 50;
  transition: transform 0.3s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 100%;
    height: calc(100vh - 60px);
    top: 60px;
    z-index: 1000;
  }
`;

const SidebarOverlay = styled.div<{ isOpen?: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: block;
  }
`;

const Navigation = styled.nav`
  padding: ${theme.spacing.lg} 0;
`;

const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  color: ${props => props.active ? theme.colors.primary : theme.colors.text.secondary};
  background: ${props => props.active ? `${theme.colors.primary}10` : 'transparent'};
  border-right: ${props => props.active ? `3px solid ${theme.colors.primary}` : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.active ? theme.typography.weights.medium : theme.typography.weights.normal};

  &:hover {
    background: ${props => props.active ? `${theme.colors.primary}10` : theme.colors.background};
    color: ${theme.colors.primary};
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavText = styled.span`
  font-size: ${theme.typography.sizes.base};
`;

const NavSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.light};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.md};
`;

const navigationItems: NavSection[] = [
  {
    section: 'Principal',
    items: [
      { path: '/', icon: Home, label: 'Dashboard', exact: true },
      { path: '/patients', icon: Users, label: 'Pacientes' },
      { path: '/records', icon: FileText, label: 'Prontuários' },
      { path: '/appointments', icon: Calendar, label: 'Agenda' },
    ]
  },
  {
    section: 'Financeiro',
    items: [
      { path: '/payments', icon: DollarSign, label: 'Pagamentos' },
      { path: '/reports', icon: BarChart3, label: 'Relatórios' },
    ]
  },
  {
    section: 'Sistema',
    items: [
      { path: '/patient-portal', icon: UserCheck, label: 'Portal do Paciente' },
      { path: '/security', icon: Shield, label: 'Segurança' },
      { path: '/integrations', icon: Settings, label: 'Integrações' },
    ]
  },
  {
    section: 'Administração',
    items: [
      { path: '/user-management', icon: UserCog, label: 'Gerenciar Usuários', superAdminOnly: true },
    ]
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <Navigation>
          {navigationItems.map((section, sectionIndex) => {
            // Filtrar itens que são apenas para super admin
            const filteredItems: NavItem[] = section.items.filter((item: NavItem) => {
              if (item.superAdminOnly) {
                return isSuperAdmin();
              }
              return true;
            });

            // Não mostrar seção se não houver itens
            if (filteredItems.length === 0) {
              return null;
            }

            return (
              <NavSection key={sectionIndex}>
                <SectionTitle>{section.section}</SectionTitle>
                {filteredItems.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <NavItem
                      key={itemIndex}
                      active={isActive(item.path, item.exact)}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <NavIcon>
                        <Icon size={20} />
                      </NavIcon>
                      <NavText>{item.label}</NavText>
                    </NavItem>
                  );
                })}
              </NavSection>
            );
          })}
        </Navigation>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
