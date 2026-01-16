import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { MovieDetailsDTO, MovieQueryDTO, MovieResultsDTO } from '@resources';

import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let loggerErrorSpy: jest.SpyInstance;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  beforeEach(async () => {
    loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    const module = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);

    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue('test-token');
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPopularMovies', () => {
    const mockQueryDTO: MovieQueryDTO = {
      page: 1,
      includeAdult: false,
      language: 'en-US',
    };

    const mockMovieResults: MovieResultsDTO = {
      page: 1,
      total_pages: 100,
      total_results: 2000,
      results: [],
    };

    it('should return popular movies successfully', async () => {
      const mockAxiosResponse: AxiosResponse<MovieResultsDTO> = {
        data: mockMovieResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as InternalAxiosRequestConfig,
      };

      mockHttpService.axiosRef.get.mockResolvedValue(mockAxiosResponse);

      const result = await service.getPopularMovies(mockQueryDTO);

      expect(result).toEqual(mockMovieResults);
      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        '/movie/popular',
        {
          params: mockQueryDTO,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        },
      );
      expect(mockConfigService.get).toHaveBeenCalledWith('tmdb.token');
    });

    it('should throw InternalServerErrorException on HTTP error', async () => {
      const error = new Error('Network error') as AxiosError;
      mockHttpService.axiosRef.get.mockRejectedValue(error);

      await expect(service.getPopularMovies(mockQueryDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getPopularMovies(mockQueryDTO)).rejects.toThrow(
        'Failed to fetch popular movies',
      );
    });

    it('should include query parameters in the request', async () => {
      const customQueryDTO: MovieQueryDTO = {
        page: 2,
        includeAdult: true,
        language: 'fr-FR',
      };

      const mockAxiosResponse: AxiosResponse<MovieResultsDTO> = {
        data: mockMovieResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as InternalAxiosRequestConfig,
      };

      mockHttpService.axiosRef.get.mockResolvedValue(mockAxiosResponse);

      await service.getPopularMovies(customQueryDTO);

      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        '/movie/popular',
        {
          params: customQueryDTO,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        },
      );
    });
  });

  describe('searchMovies', () => {
    const mockQueryDTO: MovieQueryDTO = {
      page: 1,
      includeAdult: false,
      language: 'en-US',
      query: 'The Matrix',
    };

    const mockMovieResults: MovieResultsDTO = {
      page: 1,
      total_pages: 10,
      total_results: 200,
      results: [],
    };

    it('should return search results successfully', async () => {
      const mockAxiosResponse: AxiosResponse<MovieResultsDTO> = {
        data: mockMovieResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as InternalAxiosRequestConfig,
      };

      mockHttpService.axiosRef.get.mockResolvedValue(mockAxiosResponse);

      const result = await service.searchMovies(mockQueryDTO);

      expect(result).toEqual(mockMovieResults);
      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        '/search/movie',
        {
          params: mockQueryDTO,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        },
      );
    });

    it('should throw BadRequestException when query is missing', async () => {
      const queryDTOWithoutQuery: MovieQueryDTO = {
        page: 1,
        includeAdult: false,
        language: 'en-US',
      };

      await expect(service.searchMovies(queryDTOWithoutQuery)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.searchMovies(queryDTOWithoutQuery)).rejects.toThrow(
        'Search query is required',
      );
      expect(mockHttpService.axiosRef.get).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when query is empty string', async () => {
      const queryDTOWithEmptyQuery: MovieQueryDTO = {
        page: 1,
        includeAdult: false,
        language: 'en-US',
        query: '',
      };

      await expect(
        service.searchMovies(queryDTOWithEmptyQuery),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.searchMovies(queryDTOWithEmptyQuery),
      ).rejects.toThrow('Search query is required');
      expect(mockHttpService.axiosRef.get).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on HTTP error', async () => {
      const error = new Error('Network error') as AxiosError;
      mockHttpService.axiosRef.get.mockRejectedValue(error);

      await expect(service.searchMovies(mockQueryDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.searchMovies(mockQueryDTO)).rejects.toThrow(
        'Failed to search for movies',
      );
    });

    it('should include query parameters in the request', async () => {
      const customQueryDTO: MovieQueryDTO = {
        page: 2,
        includeAdult: true,
        language: 'fr-FR',
        query: 'Inception',
      };

      const mockAxiosResponse: AxiosResponse<MovieResultsDTO> = {
        data: mockMovieResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as InternalAxiosRequestConfig,
      };

      mockHttpService.axiosRef.get.mockResolvedValue(mockAxiosResponse);

      await service.searchMovies(customQueryDTO);

      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        '/search/movie',
        {
          params: customQueryDTO,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        },
      );
    });
  });

  describe('getMovieDetails', () => {
    const movieId = 550;
    const mockMovieDetails: MovieDetailsDTO = {
      adult: false,
      backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
      belongs_to_collection: null,
      budget: 63000000,
      genres: [
        {
          id: 18,
          name: 'Drama',
        },
        {
          id: 53,
          name: 'Thriller',
        },
        {
          id: 35,
          name: 'Comedy',
        },
      ],
      homepage: 'http://www.foxmovies.com/movies/fight-club',
      id: 550,
      imdb_id: 'tt0137523',
      original_language: 'en',
      original_title: 'Fight Club',
      overview:
        'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
      popularity: 61.416,
      poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      production_companies: [
        {
          id: 508,
          logo_path: '/7cxRWzi4LsVm4Utfpr1hfARNurT.png',
          name: 'Regency Enterprises',
          origin_country: 'US',
        },
        {
          id: 711,
          logo_path: '/tEiIH5QesdheJmDAqQwvtN60727.png',
          name: 'Fox 2000 Pictures',
          origin_country: 'US',
        },
        {
          id: 20555,
          logo_path: '/hD8yEGUBlHOcfHYbujp71vD8gZp.png',
          name: 'Taurus Film',
          origin_country: 'DE',
        },
        {
          id: 54051,
          logo_path: null,
          name: 'Atman Entertainment',
          origin_country: '',
        },
        {
          id: 54052,
          logo_path: null,
          name: 'Knickerbocker Films',
          origin_country: 'US',
        },
        {
          id: 4700,
          logo_path: '/A32wmjrs9Psf4zw0uaixF0GXfxq.png',
          name: 'The Linson Company',
          origin_country: 'US',
        },
        {
          id: 25,
          logo_path: '/qZCc1lty5FzX30aOCVRBLzaVmcp.png',
          name: '20th Century Fox',
          origin_country: 'US',
        },
      ],
      production_countries: [
        {
          iso_3166_1: 'US',
          name: 'United States of America',
        },
      ],
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
      vote_count: 26280,
    };

    it('should return movie details successfully', async () => {
      const mockAxiosResponse: AxiosResponse<MovieDetailsDTO> = {
        data: mockMovieDetails,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as InternalAxiosRequestConfig,
      };

      mockHttpService.axiosRef.get.mockResolvedValue(mockAxiosResponse);

      const result = await service.getMovieDetails(movieId);

      expect(result).toEqual(mockMovieDetails);
      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        `/movie/${movieId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        },
      );
      expect(mockConfigService.get).toHaveBeenCalledWith('tmdb.token');
    });

    it('should throw InternalServerErrorException on HTTP error', async () => {
      const error = new Error('Network error') as AxiosError;
      mockHttpService.axiosRef.get.mockRejectedValue(error);

      await expect(service.getMovieDetails(movieId)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getMovieDetails(movieId)).rejects.toThrow(
        'Failed to fetch movie details',
      );
    });

    it('should handle different movie IDs', async () => {
      const differentMovieId = 123;
      const mockAxiosResponse: AxiosResponse<MovieDetailsDTO> = {
        data: { ...mockMovieDetails, id: differentMovieId },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as unknown as InternalAxiosRequestConfig,
      };

      mockHttpService.axiosRef.get.mockResolvedValue(mockAxiosResponse);

      await service.getMovieDetails(differentMovieId);

      expect(mockHttpService.axiosRef.get).toHaveBeenCalledWith(
        `/movie/${differentMovieId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        },
      );
    });
  });
});
