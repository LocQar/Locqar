import React, { createContext, useContext, useState } from 'react';

// ============ THEMES ============
export const themes = {
  dark: {
    name: 'dark',
    bg: {
      primary: '#100E0C',
      secondary: '#191613',
      tertiary: '#221E1B',
      card: '#1E1A17',
      hover: '#2A2521',
      input: '#221E1B'
    },
    border: {
      primary: 'rgba(255,255,255,0.08)',
      secondary: 'rgba(255,255,255,0.14)',
      focus: 'rgba(255,255,255,0.60)'
    },
    text: {
      primary: '#F0EBE5',
      secondary: '#C4BDB8', // Brightened from #A89F99 for better contrast
      muted: '#6E6560'
    },
    accent: {
      primary: '#F0EBE5',
      secondary: '#C4BDB8',
      light: 'rgba(240,235,229,0.08)',
      border: 'rgba(240,235,229,0.20)',
      contrast: '#100E0C'
    },
    font: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#C4BDB8',
      muted: '#6E6560'
    },
    status: {
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA'
    },
    chart: {
      green: '#34D399',
      blue: '#60A5FA',
      amber: '#FBBF24',
      coral: '#F87171',
      violet: '#A78BFA',
      teal: '#2DD4BF',
      stone: '#9CA3AF',
      series: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#2DD4BF', '#9CA3AF']
    }
  },
  light: {
    name: 'light',
    bg: {
      primary: '#F0F2F5',
      secondary: '#FFFFFF',
      tertiary: '#E8EAF0',
      card: '#FFFFFF',
      hover: '#E4E6ED',
      input: '#F0F2F5'
    },
    border: {
      primary: 'rgba(0,0,0,0.09)',
      secondary: 'rgba(0,0,0,0.15)',
      focus: '#111111'
    },
    text: {
      primary: '#0D1117',
      secondary: '#374151',
      muted: '#6B7280'
    },
    accent: {
      primary: '#111111',
      secondary: '#374151',
      light: 'rgba(0,0,0,0.06)',
      border: 'rgba(0,0,0,0.20)',
      contrast: '#FFFFFF'
    },
    font: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#374151',
      muted: '#6B7280'
    },
    status: {
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB'
    },
    chart: {
      green: '#16A34A',
      blue: '#2563EB',
      amber: '#D97706',
      coral: '#DC2626',
      violet: '#7C3AED',
      teal: '#0891B2',
      stone: '#6B7280',
      series: ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#6B7280']
    }
  }
};

// ============ THEME CONTEXT ============
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');
  const theme = themes[themeName];

  const toggleTheme = () => {
    setThemeName(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
