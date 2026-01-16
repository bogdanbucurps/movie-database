import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MovieDetailsDTO, MovieQueryDTO, MovieResultsDTO } from '@resources';

import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  const mockMovieService = {
    getPopularMovies: jest.fn(),
    searchMovies: jest.fn(),
    getMovieDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should return popular movies from service', async () => {
      const getPopularMoviesSpy = jest
        .spyOn(service, 'getPopularMovies')
        .mockResolvedValue(mockMovieResults);

      const result = await controller.getPopularMovies(mockQueryDTO);

      expect(getPopularMoviesSpy).toHaveBeenCalledWith(mockQueryDTO);
      expect(getPopularMoviesSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMovieResults);
    });

    it('should propagate InternalServerErrorException from service', async () => {
      const error = new InternalServerErrorException(
        'Failed to fetch popular movies',
      );
      jest.spyOn(service, 'getPopularMovies').mockRejectedValue(error);

      await expect(controller.getPopularMovies(mockQueryDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(controller.getPopularMovies(mockQueryDTO)).rejects.toThrow(
        'Failed to fetch popular movies',
      );
    });

    it('should pass query parameters to service', async () => {
      const customQueryDTO: MovieQueryDTO = {
        page: 2,
        includeAdult: true,
        language: 'fr-FR',
      };

      const getPopularMoviesSpy = jest
        .spyOn(service, 'getPopularMovies')
        .mockResolvedValue(mockMovieResults);

      await controller.getPopularMovies(customQueryDTO);

      expect(getPopularMoviesSpy).toHaveBeenCalledWith(customQueryDTO);
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

    it('should return search results from service', async () => {
      const searchMoviesSpy = jest
        .spyOn(service, 'searchMovies')
        .mockResolvedValue(mockMovieResults);

      const result = await controller.searchMovies(mockQueryDTO);

      expect(searchMoviesSpy).toHaveBeenCalledWith(mockQueryDTO);
      expect(searchMoviesSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMovieResults);
    });

    it('should propagate BadRequestException from service', async () => {
      const error = new BadRequestException('Search query is required');
      jest.spyOn(service, 'searchMovies').mockRejectedValue(error);

      await expect(controller.searchMovies(mockQueryDTO)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.searchMovies(mockQueryDTO)).rejects.toThrow(
        'Search query is required',
      );
    });

    it('should propagate InternalServerErrorException from service', async () => {
      const error = new InternalServerErrorException(
        'Failed to search for movies',
      );
      jest.spyOn(service, 'searchMovies').mockRejectedValue(error);

      await expect(controller.searchMovies(mockQueryDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(controller.searchMovies(mockQueryDTO)).rejects.toThrow(
        'Failed to search for movies',
      );
    });

    it('should pass query parameters to service', async () => {
      const customQueryDTO: MovieQueryDTO = {
        page: 2,
        includeAdult: true,
        language: 'fr-FR',
        query: 'Inception',
      };

      const searchMoviesSpy = jest
        .spyOn(service, 'searchMovies')
        .mockResolvedValue(mockMovieResults);

      await controller.searchMovies(customQueryDTO);

      expect(searchMoviesSpy).toHaveBeenCalledWith(customQueryDTO);
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

    it('should return movie details from service', async () => {
      const getMovieDetailsSpy = jest
        .spyOn(service, 'getMovieDetails')
        .mockResolvedValue(mockMovieDetails);

      const result = await controller.getMovieDetails(movieId);

      expect(getMovieDetailsSpy).toHaveBeenCalledWith(movieId);
      expect(getMovieDetailsSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockMovieDetails);
    });

    it('should propagate InternalServerErrorException from service', async () => {
      const error = new InternalServerErrorException(
        'Failed to fetch movie details',
      );
      jest.spyOn(service, 'getMovieDetails').mockRejectedValue(error);

      await expect(controller.getMovieDetails(movieId)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(controller.getMovieDetails(movieId)).rejects.toThrow(
        'Failed to fetch movie details',
      );
    });

    it('should pass movie ID to service', async () => {
      const differentMovieId = 123;
      const getMovieDetailsSpy = jest
        .spyOn(service, 'getMovieDetails')
        .mockResolvedValue({ ...mockMovieDetails, id: differentMovieId });

      await controller.getMovieDetails(differentMovieId);

      expect(getMovieDetailsSpy).toHaveBeenCalledWith(differentMovieId);
    });
  });
});
