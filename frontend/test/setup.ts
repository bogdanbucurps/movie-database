import { vi } from 'vitest';

// Mock Nuxt composables
const mockUseRuntimeConfig = vi.fn(() => ({
  apiBaseUrl: 'http://localhost:3000',
  public: {
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
  },
}));

const mockUseRoute = vi.fn(() => ({
  params: { id: '550' },
  query: {},
}));

const mockNavigateTo = vi.fn();

const mockUseAsyncData = vi.fn((key, fn) => {
  const data = fn ? fn() : Promise.resolve(null);
  return {
    data: { value: null },
    error: { value: null },
    refresh: vi.fn(),
    pending: { value: false },
  };
});

const mockUseSeoMeta = vi.fn();
const mockUseHead = vi.fn();

vi.mock('#app', () => ({
  useRuntimeConfig: mockUseRuntimeConfig,
  useRoute: mockUseRoute,
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  navigateTo: mockNavigateTo,
  useAsyncData: mockUseAsyncData,
  useSeoMeta: mockUseSeoMeta,
  useHead: mockUseHead,
}));
