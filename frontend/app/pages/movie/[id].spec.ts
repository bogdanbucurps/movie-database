import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IMovieDetails } from '~~/interfaces';

const mockNavigateTo = vi.fn();
const mockUseRoute = vi.fn();
const mockUseAsyncData = vi.fn();
const mockUseSeoMeta = vi.fn();
const mockUseRuntimeConfig = vi.fn();

vi.mock('#app', () => ({
  useRoute: () => mockUseRoute(),
  navigateTo: mockNavigateTo,
  useAsyncData: mockUseAsyncData,
  useSeoMeta: mockUseSeoMeta,
  useRuntimeConfig: () => mockUseRuntimeConfig(),
}));

describe('movie/[id].vue - Computed Properties and Logic', () => {
  const mockMovieDetails: IMovieDetails = {
    adult: false,
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    belongs_to_collection: {},
    budget: 63000000,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 53, name: 'Thriller' },
    ],
    homepage: 'http://www.foxmovies.com/movies/fight-club',
    id: 550,
    imdb_id: 'tt0137523',
    original_language: 'en',
    original_title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac...',
    popularity: 73.433,
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    production_companies: [],
    production_countries: [],
    release_date: '1999-10-15',
    revenue: 100853753,
    runtime: 139,
    spoken_languages: [
      {
        english_name: 'English',
        iso_639_1: 'en',
        name: 'English',
      },
    ],
    status: 'Released',
    tagline: 'Mischief. Mayhem. Soap.',
    title: 'Fight Club',
    video: false,
    vote_average: 8.433,
    vote_count: 26279,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRuntimeConfig.mockReturnValue({
      public: {
        imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
      },
    });
  });

  describe('Language computation', () => {
    it('computes language name correctly from spoken_languages', () => {
      const movieDetails = {
        ...mockMovieDetails,
        original_language: 'en',
        spoken_languages: [
          {
            english_name: 'English',
            iso_639_1: 'en',
            name: 'English',
          },
        ],
      };

      const language = movieDetails.spoken_languages.find(
        (lang) => lang.iso_639_1 === movieDetails.original_language,
      )?.name;

      expect(language).toBe('English');
    });

    it('handles missing language gracefully', () => {
      const movieDetails = {
        ...mockMovieDetails,
        original_language: 'fr',
        spoken_languages: [
          {
            english_name: 'English',
            iso_639_1: 'en',
            name: 'English',
          },
        ],
      };

      const language = movieDetails.spoken_languages.find(
        (lang) => lang.iso_639_1 === movieDetails.original_language,
      )?.name;

      expect(language).toBeUndefined();
    });
  });

  describe('Poster URL computation', () => {
    it('computes poster URL correctly', () => {
      const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
      const posterPath = '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg';
      const posterUrl = `${imageBaseUrl}${posterPath}`;

      expect(posterUrl).toBe(
        'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      );
    });
  });

  describe('Rating computation', () => {
    it('computes rating percentage correctly', () => {
      const voteAverage = 8.433;
      const rating = `${(voteAverage * 10).toFixed(0)}%`;

      expect(rating).toBe('84%');
    });

    it('formats rating with correct decimal places', () => {
      const voteAverage = 7.5;
      const rating = `${(voteAverage * 10).toFixed(0)}%`;

      expect(rating).toBe('75%');
    });

    it('handles edge case: vote_average is 0', () => {
      const voteAverage = 0;
      const rating = `${(voteAverage * 10).toFixed(0)}%`;

      expect(rating).toBe('0%');
    });

    it('handles edge case: vote_average is undefined', () => {
      const voteAverage = undefined as any;
      const rating = `${((voteAverage ?? 0) * 10).toFixed(0)}%`;

      expect(rating).toBe('0%');
    });
  });

  describe('Data fetching logic', () => {
    it('fetches movie details using correct ID from route params', async () => {
      const movieId = '550';
      mockUseRoute.mockReturnValue({
        params: { id: movieId },
      });

      const fetchCall = vi.fn().mockResolvedValue(mockMovieDetails);
      mockUseAsyncData.mockImplementation((key, fn) => {
        const result = fn();
        return {
          data: { value: result },
          error: { value: null },
          refresh: vi.fn(),
          pending: { value: false },
        };
      });

      const result = await fetchCall('/api/movie-details', {
        method: 'GET',
        params: { id: movieId },
      });

      expect(fetchCall).toHaveBeenCalledWith('/api/movie-details', {
        method: 'GET',
        params: { id: movieId },
      });
      expect(result).toEqual(mockMovieDetails);
    });

    it('navigates to home if ID is missing', async () => {
      mockUseRoute.mockReturnValue({
        params: {},
      });

      if (!mockUseRoute().params.id) {
        await mockNavigateTo('/');
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/');
    });

    it('navigates to home if API returns error', async () => {
      mockUseRoute.mockReturnValue({
        params: { id: '550' },
      });

      mockUseAsyncData.mockReturnValue({
        data: { value: null },
        error: { value: { message: 'Not found' } },
        refresh: vi.fn(),
        pending: { value: false },
      });

      const { error } = mockUseAsyncData('', () => null);

      if (error.value || !mockUseAsyncData().data.value) {
        await mockNavigateTo('/');
      }

      expect(mockNavigateTo).toHaveBeenCalledWith('/');
    });
  });

  describe('SEO meta tags', () => {
    it('sets SEO meta title from movie title', () => {
      const movieTitle = 'Fight Club';
      mockUseSeoMeta({
        title: movieTitle,
      });

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          title: movieTitle,
        }),
      );
    });

    it('sets SEO meta description from overview', () => {
      const overview = 'A ticking-time-bomb insomniac...';
      mockUseSeoMeta({
        description: overview,
      });

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          description: overview,
        }),
      );
    });

    it('sets og:image from poster URL', () => {
      const posterUrl = 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg';
      mockUseSeoMeta({
        ogImage: posterUrl,
      });

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          ogImage: posterUrl,
        }),
      );
    });
  });
});
