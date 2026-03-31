import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setBreakpoint: (isMobile: boolean, isTablet: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  isMobile: false,
  isTablet: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setBreakpoint: (isMobile, isTablet) => set({ isMobile, isTablet }),
}));
