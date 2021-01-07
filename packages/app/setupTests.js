import '@testing-library/jest-dom/extend-expect';

// Disable dynamic imports for now (Sorry HighCharts)
jest.mock('next/dynamic', () => {
  return jest.fn(() => 'div');
});

// matchMedia does not exist without a window object. Fake it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
