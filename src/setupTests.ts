import "@testing-library/jest-dom";

import { vi } from "vitest";

// Mock ResizeObserver to avoid errors in tests
class MockResizeObserver {
  constructor() {}

  observe() {}

  unobserve() {}

  disconnect() {}
}

window.ResizeObserver = MockResizeObserver as any;
