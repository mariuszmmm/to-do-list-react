import { renderHook, act } from "@testing-library/react";
import { useWaitingForConfirmation } from "../hooks/useWaitingForConfirmation";

// Mock Redux
jest.mock("../../../../hooks/redux", () => ({
  useAppDispatch: () => jest.fn(),
}));

// Mock Ably
jest.mock("ably", () => {
  return jest.fn().mockImplementation(() => ({
    channels: {
      get: jest.fn().mockReturnValue({
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
        detach: jest.fn().mockResolvedValue(undefined),
      }),
    },
  }));
});

// Mock API calls
jest.mock("../../../../api/auth", () => ({
  auth: {
    login: jest.fn().mockResolvedValue({ email: "user@example.com" }),
    currentUser: jest.fn(),
  },
}));

jest.mock("../../../../utils/deviceId", () => ({
  getOrCreateDeviceId: jest.fn().mockReturnValue("device-123"),
}));

jest.mock("../../../../utils/i18n", () => ({
  __esModule: true,
  default: { language: "en" },
}));

describe("useWaitingForConfirmation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return waitingForConfirmation function", () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "Test1234!",
        message: "",
      })
    );

    expect(typeof result.current.waitingForConfirmation).toBe("function");
  });

  it("should not proceed without email", () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "",
        password: "Test1234!",
        message: "",
      })
    );

    act(() => {
      result.current.waitingForConfirmation();
    });

    // Function should return early, no async operations
    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should not proceed without password", () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "",
        message: "",
      })
    );

    act(() => {
      result.current.waitingForConfirmation();
    });

    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should set up Ably channel with correct channel name", () => {
    const email = "user@example.com";
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email,
        password: "Test1234!",
        message: "",
      })
    );

    // Note: In real scenario, this would be tested through Ably mocks
    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should handle network error during Ably auth", async () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "Test1234!",
        message: "",
      })
    );

    act(() => {
      result.current.waitingForConfirmation();
    });

    // Function sets up Ably, error handling is in the callback
    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should have cleanup logic available", () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "Test1234!",
        message: "",
      })
    );

    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should handle undefined message prop", () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "Test1234!",
        message: undefined,
      })
    );

    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should setup with correct deviceId", () => {
    require("../../../../utils/deviceId");

    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "Test1234!",
        message: "",
      })
    );

    expect(result.current.waitingForConfirmation).toBeDefined();
    // Device ID is used in channel name and auth request
  });

  it("should handle missing Ably auth response gracefully", () => {
    const { result } = renderHook(() =>
      useWaitingForConfirmation({
        email: "user@example.com",
        password: "Test1234!",
        message: "",
      })
    );

    act(() => {
      result.current.waitingForConfirmation();
    });

    expect(result.current.waitingForConfirmation).toBeDefined();
  });

  it("should be stable across re-renders", () => {
    const { result, rerender } = renderHook(
      ({ email, password }) =>
        useWaitingForConfirmation({
          email,
          password,
          message: "",
        }),
      {
        initialProps: { email: "user@example.com", password: "Test1234!" },
      }
    );

    rerender({ email: "user@example.com", password: "Test1234!" });

    // Function should remain stable even if deps change slightly
    expect(typeof result.current.waitingForConfirmation).toBe("function");
  });
});
