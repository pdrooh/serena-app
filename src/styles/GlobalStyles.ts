import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.sizes.base};
    font-weight: ${theme.typography.weights.normal};
    line-height: 1.6;
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.weights.semibold};
    line-height: 1.2;
    margin-bottom: ${theme.spacing.md};
  }

  h1 {
    font-size: ${theme.typography.sizes['3xl']};
  }

  h2 {
    font-size: ${theme.typography.sizes['2xl']};
  }

  h3 {
    font-size: ${theme.typography.sizes.xl};
  }

  h4 {
    font-size: ${theme.typography.sizes.lg};
  }

  p {
    margin-bottom: ${theme.spacing.md};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${theme.colors.accent};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Mobile Responsive Styles */
  @media (max-width: ${theme.breakpoints.mobile}) {
    body {
      font-size: ${theme.typography.sizes.sm};
    }

    h1 {
      font-size: ${theme.typography.sizes['2xl']};
    }

    h2 {
      font-size: ${theme.typography.sizes.xl};
    }

    h3 {
      font-size: ${theme.typography.sizes.lg};
    }

    .container {
      padding: 0 ${theme.spacing.sm};
    }
  }

  /* Tablet Responsive Styles */
  @media (max-width: ${theme.breakpoints.tablet}) {
    .container {
      max-width: 100%;
      padding: 0 ${theme.spacing.md};
    }
  }
`;
