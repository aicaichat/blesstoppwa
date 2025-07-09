import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
} 