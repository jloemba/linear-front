/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from "@testing-library/react";
// ... le reste de votre code
import type { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../context/Language/LanguageProvider";
import { SnackbarProvider } from "../context/Snackbar/SnackbarProvider";
import { ThemeProvider } from "../context/Theme/ThemeProvider";

const Providers = ({ children }: PropsWithChildren) => (
  <MemoryRouter>
    <ThemeProvider>
      <LanguageProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </LanguageProvider>
    </ThemeProvider>
  </MemoryRouter>
);

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });
