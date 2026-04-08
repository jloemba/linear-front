import { createContext } from "react";

export type SnackbarStateType = "SUCCESS" | "ERROR";

export interface SnackbarState {
  message: string;
  type: SnackbarStateType;
}

export interface SnackbarContextValue {
  showSnackbar: (next: SnackbarState) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export default SnackbarContext;
