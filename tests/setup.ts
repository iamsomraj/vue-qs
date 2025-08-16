import { vi, beforeEach } from 'vitest';

// Mock window and global objects for testing environment
const mockLocation = {
  search: '',
  href: 'https://example.com/',
  pathname: '/',
  hash: '',
  origin: 'https://example.com',
  protocol: 'https:',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  assign: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  toString: () => 'https://example.com/',
};

const mockHistory = {
  length: 1,
  scrollRestoration: 'auto' as 'auto' | 'manual',
  state: null,
  back: vi.fn(),
  forward: vi.fn(),
  go: vi.fn(),
  pushState: vi.fn(),
  replaceState: vi.fn(),
};

// Set up global DOM environment for tests
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true,
});

// Mock URL constructor for consistent behavior
global.URL = class MockURL {
  searchParams: URLSearchParams;
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;

  constructor(url: string, base?: string) {
    const fullUrl = base ? new URL(url, base).href : url;
    const urlParts = fullUrl.match(/^(https?:)\/\/([^/]+)(\/[^?]*)?(\?[^#]*)?(#.*)?$/);

    this.protocol = urlParts?.[1] || 'https:';
    this.host = urlParts?.[2] || 'example.com';
    this.hostname = this.host.split(':')[0];
    this.port = this.host.split(':')[1] || '';
    this.pathname = urlParts?.[3] || '/';
    this.search = urlParts?.[4] || '';
    this.hash = urlParts?.[5] || '';
    this.origin = `${this.protocol}//${this.host}`;
    this.href = fullUrl;

    this.searchParams = new URLSearchParams(this.search);
  }

  toString() {
    return this.href;
  }
} as any;

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();

  // Reset location state
  mockLocation.search = '';
  mockLocation.href = 'https://example.com/';
  mockLocation.pathname = '/';
  mockLocation.hash = '';

  // Reset history state
  mockHistory.state = null;
});
