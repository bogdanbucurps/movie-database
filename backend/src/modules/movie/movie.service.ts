import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MovieDetailsDTO, MovieQueryDTO, MovieResultsDTO } from '@resources';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getPopularMovies(dto: MovieQueryDTO): Promise<MovieResultsDTO> {
    let response: MovieResultsDTO;

    try {
      const { data } = await this.httpService.axiosRef.get<MovieResultsDTO>(
        `/movie/popular`,
        {
          params: dto,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get('tmdb.token')}`,
          },
        },
      );

      response = data;
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching popular movies: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new InternalServerErrorException('Failed to fetch popular movies');
    }

    return response;
  }

  async searchMovies(dto: MovieQueryDTO): Promise<MovieResultsDTO> {
    if (!dto.query) {
      throw new BadRequestException('Search query is required');
    }

    let response: MovieResultsDTO;

    try {
      const { data } = await this.httpService.axiosRef.get<MovieResultsDTO>(
        `/search/movie`,
        {
          params: dto,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get('tmdb.token')}`,
          },
        },
      );

      response = data;
    } catch (error) {
      this.logger.error(
        `Error occurred while searching for movies: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new InternalServerErrorException('Failed to search for movies');
    }

    return response;
  }

  async getMovieDetails(id: number): Promise<MovieDetailsDTO> {
    let response: MovieDetailsDTO;

    try {
      const { data } = await this.httpService.axiosRef.get<MovieDetailsDTO>(
        `/movie/${id}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get('tmdb.token')}`,
          },
        },
      );

      response = data;
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching movie details: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new InternalServerErrorException('Failed to fetch movie details');
    }

    return response;
  }
}
