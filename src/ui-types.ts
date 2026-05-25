import { ReactNode } from "react";

export interface AppWindow {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export type AppId = "brief" | "editor" | "feed" | "stats" | "terminal" | "messenger";
