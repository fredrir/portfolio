export interface MobileState {
  activeApp: string | null;
  setActiveApp: (id: string) => void;
  goHome: () => void;
}
