import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import Snackbar from "../../components/Snackbar/Snackbar";
import SnackbarContext, {
  type SnackbarContextValue,
  type SnackbarState,
} from "./snackbarContext";

const SNACKBAR_DURATION = 4000;

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  useEffect(() => {
    if (!snackbar) return;

    const timeoutId = window.setTimeout(() => {
      setSnackbar(null);
    }, SNACKBAR_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [snackbar]);

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showSnackbar: (next) => setSnackbar(next),
      hideSnackbar: () => setSnackbar(null),
    }),
    [],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={value.hideSnackbar}
        />
      )}
    </SnackbarContext.Provider>
  );
};
