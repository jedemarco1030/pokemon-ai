import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/hooks/use-theme';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('useTheme hook', () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.documentElement.classList.remove('dark');
        jest.clearAllMocks();
    });

    it('should initialize with light theme by default (based on mock matchMedia)', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current.theme).toBe('light');
    });

    it('should toggle theme correctly', () => {
        const { result } = renderHook(() => useTheme());
        
        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe('dark');
        expect(window.localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.theme).toBe('light');
        expect(window.localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should load theme from localStorage on mount', () => {
        window.localStorage.setItem('theme', 'light');
        const { result } = renderHook(() => useTheme());

        // useEffect runs after render
        expect(result.current.theme).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
