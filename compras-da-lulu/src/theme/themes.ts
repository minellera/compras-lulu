import type { ThemeName } from '@/types';

export interface ThemeTokens {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  border: string;
  success: string;
  danger: string;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  white: {
    background: '#FFFFFF',
    surface: '#F3F4F6',
    text: '#111827',
    textMuted: '#6B7280',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    border: '#E5E7EB',
    success: '#16A34A',
    danger: '#DC2626',
  },
  black: {
    background: '#0F0F0F',
    surface: '#1F1F1F',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    primary: '#60A5FA',
    primaryText: '#0F172A',
    border: '#374151',
    success: '#4ADE80',
    danger: '#F87171',
  },
  green: {
    background: '#F0FDF4',
    surface: '#DCFCE7',
    text: '#14532D',
    textMuted: '#4D7C5C',
    primary: '#16A34A',
    primaryText: '#FFFFFF',
    border: '#BBF7D0',
    success: '#15803D',
    danger: '#DC2626',
  },
  red: {
    background: '#FFF1F2',
    surface: '#FFE4E6',
    text: '#881337',
    textMuted: '#9F4858',
    primary: '#E11D48',
    primaryText: '#FFFFFF',
    border: '#FECDD3',
    success: '#16A34A',
    danger: '#9F1239',
  },
  pink: {
    background: '#FDF2F8',
    surface: '#FCE7F3',
    text: '#831843',
    textMuted: '#9D4B6B',
    primary: '#DB2777',
    primaryText: '#FFFFFF',
    border: '#FBCFE8',
    success: '#16A34A',
    danger: '#DC2626',
  },
  yellow: {
    background: '#FFFBEB',
    surface: '#FEF3C7',
    text: '#78350F',
    textMuted: '#92400E',
    primary: '#D97706',
    primaryText: '#FFFFFF',
    border: '#FDE68A',
    success: '#16A34A',
    danger: '#DC2626',
  },
  purple: {
    background: '#F5F3FF',
    surface: '#EDE9FE',
    text: '#2E1065',
    textMuted: '#6D28D9',
    primary: '#7C3AED',
    primaryText: '#FFFFFF',
    border: '#DDD6FE',
    success: '#16A34A',
    danger: '#DC2626',
  },
  blue: {
    background: '#EFF6FF',
    surface: '#DBEAFE',
    text: '#1E3A5F',
    textMuted: '#3B5A8A',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    border: '#BFDBFE',
    success: '#16A34A',
    danger: '#DC2626',
  },
};
