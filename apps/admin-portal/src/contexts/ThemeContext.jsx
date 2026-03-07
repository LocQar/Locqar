import React, { createContext, useContext, useState } from 'react';

// ============ THEMES ============
export const themes = {
  dark: {
    name: 'dark',
    bg: {
      primary: '#100E0C',
      secondary: '#191613',
      tertiary: '#252119',   // lifted slightly for visible depth
      card: '#1E1A17',
      hover: '#2E2925',      // lifted for more visible hover feedback
      input: '#252119'
    },
    border: {
      primary: 'rgba(255,255,255,0.10)',   // was 0.08 — slightly more visible
      secondary: 'rgba(255,255,255,0.16)',
      focus: 'rgba(255,255,255,0.65)'
    },
    text: {
      primary: '#F0EBE5',
      secondary: '#C4BDB8',
      muted: '#918A84'       // was #6E6560 — contrast ratio was ~2.8:1, now ~4.6:1
    },
    accent: {
      primary: '#F0EBE5',
      secondary: '#C4BDB8',
      light: 'rgba(240,235,229,0.10)',
      border: 'rgba(240,235,229,0.22)',
      contrast: '#100E0C'
    },
    font: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#C4BDB8',
      muted: '#918A84'       // was #6E6560 — same fix as text.muted
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
      primary: '#F1F3F7',    // page background — clean neutral grey
      secondary: '#FFFFFF',  // sidebar + header — white stands out from grey page
      tertiary: '#E8EBF1',   // nested sections, slightly deeper
      card: '#FFFFFF',       // cards — white on grey page = clear hierarchy
      hover: '#E4E7EE',
      input: '#EEF0F5'       // grey inputs visible inside white card forms
    },
    border: {
      primary: 'rgba(0,0,0,0.09)',
      secondary: 'rgba(0,0,0,0.16)',
      focus: '#1A1A2E'
    },
    text: {
      primary: '#0D1117',
      secondary: '#374151',
      muted: '#5C6370'       // was #6B7280 — slightly darker for better contrast on white
    },
    accent: {
      primary: '#1A1A2E',    // deep navy — more distinguishable than pure black
      secondary: '#374151',
      light: 'rgba(26,26,46,0.07)',
      border: 'rgba(26,26,46,0.22)',
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
      success: '#15803D',    // darker green for better contrast on white (was #16A34A ~4.5:1, now ~6:1)
      warning: '#B45309',    // darker amber — was #D97706 at 3.2:1, now ~5.0:1
      error: '#B91C1C',      // darker red — was #DC2626 at 4.0:1, now ~5.8:1
      info: '#1D4ED8'        // darker blue — was #2563EB at 4.7:1, now ~7.0:1
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
