import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import { theme } from '../../styles/theme';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  margin-left: 280px;
  padding: ${theme.spacing.xl};
  min-height: calc(100vh - 80px);
  background: ${theme.colors.background};

  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-left: 0;
    padding: ${theme.spacing.md};
    min-height: calc(100vh - 60px);
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <MainContent>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
