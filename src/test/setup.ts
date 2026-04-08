import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock authenticated user for useAuth
const mockUser = { id: "1", email: "test@example.com", provider: "LOCAL" };
localStorage.setItem("user", JSON.stringify(mockUser));
localStorage.setItem("userId", "1");

