import { ApiProperty } from '@nestjs/swagger';

export class MovieItemDTO {
  @ApiProperty({
    type: Boolean,
    description: 'Whether the movie is for adults only',
    example: false,
  })
  adult: boolean;

  @ApiProperty({
    type: String,
    description: 'The backdrop path of the movie',
    example: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  })
  backdrop_path: string;

  @ApiProperty({
    type: Number,
    isArray: true,
    description: 'The genre IDs of the movie',
    example: [18, 53, 35],
  })
  genre_ids: number[];

  @ApiProperty({
    type: Number,
    description: 'The ID of the movie',
    example: 550,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The original language of the movie',
    example: 'en',
  })
  original_language: string;

  @ApiProperty({
    type: String,
    description: 'The original title of the movie',
    example: 'Fight Club',
  })
  original_title: string;

  @ApiProperty({
    type: String,
    description: 'The overview of the movie',
    example:
      'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
  })
  overview: string;

  @ApiProperty({
    type: Number,
    description: 'The popularity of the movie',
    example: 73.433,
  })
  popularity: number;

  @ApiProperty({
    type: String,
    description: 'The poster path of the movie',
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  })
  poster_path: string;

  @ApiProperty({
    type: String,
    description: 'The release date of the movie',
    example: '1999-10-15',
  })
  release_date: string;

  @ApiProperty({
    type: String,
    description: 'The title of the movie',
    example: 'Fight Club',
  })
  title: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the movie is a video',
    example: false,
  })
  video: boolean;

  @ApiProperty({
    type: Number,
    description: 'The vote average of the movie',
    example: 8.433,
  })
  vote_average: number;

  @ApiProperty({
    type: Number,
    description: 'The vote count of the movie',
    example: 26279,
  })
  vote_count: number;
}
