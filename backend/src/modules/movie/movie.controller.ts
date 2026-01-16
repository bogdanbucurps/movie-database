import { Controller, Get, Param, Query } from '@nestjs/common';

import { MovieService } from './movie.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { MovieDetailsDTO, MovieQueryDTO, MovieResultsDTO } from '@resources';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('/popular')
  @ApiOperation({ summary: 'Get popular movies' })
  @ApiProduces('application/json')
  @ApiOkResponse({
    type: () => MovieResultsDTO,
    description: 'The list of popular movies',
  })
  async getPopularMovies(
    @Query() query: MovieQueryDTO,
  ): Promise<MovieResultsDTO> {
    return this.movieService.getPopularMovies(query);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search for movies' })
  @ApiProduces('application/json')
  @ApiOkResponse({
    type: () => MovieResultsDTO,
    description: 'The list of search results',
  })
  async searchMovies(@Query() query: MovieQueryDTO): Promise<MovieResultsDTO> {
    return this.movieService.searchMovies(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get movie details' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the movie',
    example: 550,
  })
  @ApiProduces('application/json')
  @ApiOkResponse({
    type: () => MovieDetailsDTO,
    description: 'The details of the movie',
  })
  async getMovieDetails(@Param('id') id: number): Promise<MovieDetailsDTO> {
    return this.movieService.getMovieDetails(id);
  }
}
