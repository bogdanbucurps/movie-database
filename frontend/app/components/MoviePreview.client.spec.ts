import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import MoviePreview from './MoviePreview.client.vue';
import type { IMovieItem } from '~~/interfaces';

vi.mock('#app', async () => {
  const actual = await vi.importActual('#app');
  return {
    ...actual,
    useRuntimeConfig: () => ({
      public: {
        imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
      },
    }),
  };
});

describe('MoviePreview', () => {
  const mockMovie: IMovieItem = {
    adult: false,
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    genre_ids: [18, 53, 35],
    id: 550,
    original_language: 'en',
    original_title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac...',
    popularity: 73.433,
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    release_date: '1999-10-15',
    title: 'Fight Club',
    video: false,
    vote_average: 8.433,
    vote_count: 26279,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountOptions = {
    global: {
      stubs: {
        'nuxt-img': {
          template: '<img :src="$attrs.src" :alt="$attrs.alt" />',
        },
        'nuxt-link': {
          template: '<a :href="$attrs.to"><slot /></a>',
        },
        Badge: {
          template: '<span class="p-badge">{{ $attrs.value }}</span>',
        },
      },
    },
  };

  it('renders release date correctly', () => {
    const wrapper = mount(MoviePreview, {
      props: { movie: mockMovie },
      ...mountOptions,
    });

    expect(wrapper.text()).toContain('Released on 1999-10-15');
  });

  it('renders movie title correctly', () => {
    const wrapper = mount(MoviePreview, {
      props: { movie: mockMovie },
      ...mountOptions,
    });

    expect(wrapper.text()).toContain('Fight Club');
  });

  it('computes poster URL correctly from imageBaseUrl and poster_path', () => {
    const wrapper = mount(MoviePreview, {
      props: { movie: mockMovie },
      ...mountOptions,
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(
      'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    );
  });

  it('computes rating percentage correctly', () => {
    const wrapper = mount(MoviePreview, {
      props: { movie: mockMovie },
      ...mountOptions,
    });

    const component = wrapper.vm as any;
    expect(component.rating).toBe('84%');
  });

  it('formats rating with correct decimal places', () => {
    const movieWithRating: IMovieItem = {
      ...mockMovie,
      vote_average: 7.5,
    };

    const wrapper = mount(MoviePreview, {
      props: { movie: movieWithRating },
      ...mountOptions,
    });

    const component = wrapper.vm as any;
    expect(component.rating).toBe('75%');
  });

  it('links to correct movie detail page', () => {
    const wrapper = mount(MoviePreview, {
      props: { movie: mockMovie },
      ...mountOptions,
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/movie/550');
  });

  it('handles missing poster_path gracefully', () => {
    const movieWithoutPoster: IMovieItem = {
      ...mockMovie,
      poster_path: '',
    };

    const wrapper = mount(MoviePreview, {
      props: { movie: movieWithoutPoster },
      ...mountOptions,
    });

    expect(wrapper.exists()).toBe(true);
    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe('https://image.tmdb.org/t/p/w500');
  });

  it('handles edge cases: vote_average = 0', () => {
    const movieWithZeroRating: IMovieItem = {
      ...mockMovie,
      vote_average: 0,
    };

    const wrapper = mount(MoviePreview, {
      props: { movie: movieWithZeroRating },
      ...mountOptions,
    });

    const component = wrapper.vm as any;
    expect(component.rating).toBe('0%');
  });

  it('displays Badge component with rating', () => {
    const wrapper = mount(MoviePreview, {
      props: { movie: mockMovie },
      ...mountOptions,
    });

    const badge = wrapper.find('.p-badge');
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toBe('84%');
  });

  it('handles null poster_path', () => {
    const movieWithNullPoster: IMovieItem = {
      ...mockMovie,
      poster_path: null as any,
    };

    const wrapper = mount(MoviePreview, {
      props: { movie: movieWithNullPoster },
      ...mountOptions,
    });

    expect(wrapper.exists()).toBe(true);
    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe('https://image.tmdb.org/t/p/w500null');
  });

  it('handles undefined vote_average', () => {
    const movieWithUndefinedRating: IMovieItem = {
      ...mockMovie,
      vote_average: undefined as any,
    };

    const wrapper = mount(MoviePreview, {
      props: { movie: movieWithUndefinedRating },
    });

    const component = wrapper.vm as any;
    expect(component.rating).toBe('NaN%');
  });
});
