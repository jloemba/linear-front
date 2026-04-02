import { createContext } from "react";

export type SnackbarType = "success" | "error";

export interface SnackbarState {
  message: string;
  type: SnackbarType;
}

export interface SnackbarContextValue {
  showSnackbar: (next: SnackbarState) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export default SnackbarContext;
