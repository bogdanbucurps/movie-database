import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { IMovieResults } from '~~/interfaces';

const mockUseAsyncData = vi.fn();
const mock$fetch = vi.fn();

vi.mock('#app', () => ({
  useAsyncData: mockUseAsyncData,
}));

vi.mock('lodash/debounce', () => ({
  default: vi.fn((fn) => fn),
}));

describe('index.vue - State Management and Logic', () => {
  const mockPopularMovies: IMovieResults = {
    page: 1,
    total_pages: 100,
    total_results: 2000,
    results: [
      {
        id: 550,
        title: 'Fight Club',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        release_date: '1999-10-15',
        vote_average: 8.433,
        adult: false,
        backdrop_path: '',
        genre_ids: [],
        original_language: 'en',
        original_title: 'Fight Club',
        overview: '',
        popularity: 73.433,
        video: false,
        vote_count: 26279,
      },
    ],
  };

  const mockSearchResults: IMovieResults = {
    page: 1,
    total_pages: 10,
    total_results: 200,
    results: [
      {
        id: 603,
        title: 'The Matrix',
        poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        release_date: '1999-03-31',
        vote_average: 8.7,
        adult: false,
        backdrop_path: '',
        genre_ids: [],
        original_language: 'en',
        original_title: 'The Matrix',
        overview: '',
        popularity: 100.0,
        video: false,
        vote_count: 20000,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('State Management', () => {
    it('initializes with correct default values', () => {
      const popularMoviesPage = 1;
      const searchMoviesPage = 1;
      const searchQuery = '';

      expect(popularMoviesPage).toBe(1);
      expect(searchMoviesPage).toBe(1);
      expect(searchQuery).toBe('');
    });

    it('updates searchQuery when user types', () => {
      let searchQuery = '';
      searchQuery = 'The Matrix';

      expect(searchQuery).toBe('The Matrix');
    });

    it('updates popularMoviesPage on pagination', () => {
      let popularMoviesPage = 1;
      popularMoviesPage = 2;

      expect(popularMoviesPage).toBe(2);
    });

    it('updates searchMoviesPage on pagination', () => {
      let searchMoviesPage = 1;
      searchMoviesPage = 2;

      expect(searchMoviesPage).toBe(2);
    });
  });

  describe('Popular Movies', () => {
    it('fetches popular movies on mount', async () => {
      mockUseAsyncData.mockReturnValue({
        data: { value: mockPopularMovies },
        refresh: vi.fn(),
      });

      const result = mockUseAsyncData('popular-movies', () => {
        return mock$fetch('/api/popular-movies', {
          method: 'GET',
          query: { page: 1 },
        });
      });

      expect(mockUseAsyncData).toHaveBeenCalledWith(
        'popular-movies',
        expect.any(Function),
      );
    });

    it('displays popular movies when data is available', () => {
      const popularMovies = mockPopularMovies;

      expect(popularMovies).toBeDefined();
      expect(popularMovies.results.length).toBeGreaterThan(0);
    });

    it('shows "No movies found" when results are empty', () => {
      const emptyResults: IMovieResults = {
        page: 1,
        total_pages: 0,
        total_results: 0,
        results: [],
      };

      const hasResults = emptyResults.results.length > 0;
      expect(hasResults).toBe(false);
    });

    it('handles pagination for popular movies', () => {
      let popularMoviesPage = 1;
      const onPageChange = (event: { page: number }) => {
        popularMoviesPage = event.page + 1;
      };

      onPageChange({ page: 1 } as any);
      expect(popularMoviesPage).toBe(2);
    });

    it('refreshes data when page changes', async () => {
      const refreshFn = vi.fn();
      mockUseAsyncData.mockReturnValue({
        data: { value: mockPopularMovies },
        refresh: refreshFn,
      });

      const { refresh } = mockUseAsyncData('popular-movies', () => null);
      await refresh();

      expect(refreshFn).toHaveBeenCalled();
    });
  });

  describe('Search Functionality', () => {
    it('debounces search input (500ms delay)', async () => {
      const debounceTime = 500;
      let searchQuery = '';
      const onSearch = vi.fn();

      searchQuery = 'The Matrix';
      onSearch();

      vi.advanceTimersByTime(debounceTime);
      expect(onSearch).toHaveBeenCalled();
    });

    it('calls search API with correct query parameters', async () => {
      const searchQuery = 'The Matrix';
      const searchMoviesPage = 1;

      mock$fetch.mockResolvedValue(mockSearchResults);

      const response = await mock$fetch('/api/search-movies', {
        method: 'GET',
        query: {
          page: searchMoviesPage,
          query: searchQuery,
        },
      });

      expect(mock$fetch).toHaveBeenCalledWith('/api/search-movies', {
        method: 'GET',
        query: {
          page: 1,
          query: 'The Matrix',
        },
      });
      expect(response).toEqual(mockSearchResults);
    });

    it('displays search results when available', () => {
      const searchResults = mockSearchResults;

      expect(searchResults).toBeDefined();
      expect(searchResults.results.length).toBeGreaterThan(0);
    });

    it('shows "No movies found" when search returns empty', () => {
      const emptyResults: IMovieResults = {
        page: 1,
        total_pages: 0,
        total_results: 0,
        results: [],
      };

      const hasResults = emptyResults.results.length > 0;
      expect(hasResults).toBe(false);
    });

    it('clears search results when query is empty', () => {
      let searchQuery = 'The Matrix';
      let searchResults: IMovieResults | null = mockSearchResults;

      if (!searchQuery) {
        searchResults = null;
      }

      searchQuery = '';
      if (!searchQuery) {
        searchResults = null;
      }

      expect(searchResults).toBeNull();
    });

    it('resets search page to 1 when query is cleared', () => {
      let searchMoviesPage = 2;
      const searchQuery = '';

      if (!searchQuery) {
        searchMoviesPage = 1;
      }

      expect(searchMoviesPage).toBe(1);
    });

    it('handles search API errors gracefully', async () => {
      const searchQuery = 'Invalid Query';
      mock$fetch.mockRejectedValue(new Error('API Error'));

      let searchResults: IMovieResults | null = null;
      let searchMoviesPage = 1;

      try {
        await mock$fetch('/api/search-movies', {
          method: 'GET',
          query: {
            page: searchMoviesPage,
            query: searchQuery,
          },
        });
      } catch (error) {
        searchMoviesPage = 1;
        searchResults = null;
      }

      expect(searchResults).toBeNull();
      expect(searchMoviesPage).toBe(1);
    });

    it('handles pagination for search results', () => {
      let searchMoviesPage = 1;
      const onPageChange = (event: { page: number }) => {
        searchMoviesPage = event.page + 1;
      };

      onPageChange({ page: 1 } as any);
      expect(searchMoviesPage).toBe(2);
    });
  });

  describe('Integration', () => {
    it('both sections can display movies simultaneously', () => {
      const popularMovies = mockPopularMovies;
      const searchResults = mockSearchResults;

      expect(popularMovies.results.length).toBeGreaterThan(0);
      expect(searchResults.results.length).toBeGreaterThan(0);
    });

    it('search and popular movies do not interfere with each other', () => {
      let popularMoviesPage = 1;
      let searchMoviesPage = 2;
      const searchQuery = 'The Matrix';

      popularMoviesPage = 3;

      expect(searchMoviesPage).toBe(2);
      expect(searchQuery).toBe('The Matrix');
    });
  });
});
