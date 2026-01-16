import { ApiProperty } from '@nestjs/swagger';

import { MovieItemDTO } from './movie-item.dto';

export class MovieResultsDTO {
  @ApiProperty({
    type: Number,
    description: 'The page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'The total number of pages',
    example: 100,
  })
  total_pages: number;

  @ApiProperty({
    type: Number,
    description: 'The total number of results',
    example: 100,
  })
  total_results: number;

  @ApiProperty({
    type: () => MovieItemDTO,
    isArray: true,
    description: 'The list of movies',
  })
  results: MovieItemDTO[];
}
