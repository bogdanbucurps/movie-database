import { ApiProperty } from '@nestjs/swagger';

class GenreDTO {
  @ApiProperty({
    type: Number,
    description: 'The ID of the genre',
    example: 18,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The name of the genre',
    example: 'Drama',
  })
  name: string;
}

class ProductionCompanyDTO {
  @ApiProperty({
    type: Number,
    description: 'The ID of the production company',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The logo path of the production company',
    example: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  })
  logo_path: string;

  @ApiProperty({
    type: String,
    description: 'The name of the production company',
    example: 'Warner Bros.',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The origin country of the production company',
    example: 'US',
  })
  origin_country: string;
}

class ProductionCountryDTO {
  @ApiProperty({
    type: String,
    description: 'The name of the production country',
    example: 'United States',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The ISO 3166-1 code of the production country',
    example: 'US',
  })
  iso_3166_1: string;
}

class SpokenLanguageDTO {
  @ApiProperty({
    type: String,
    description: 'The name of the spoken language',
    example: 'English',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'The ISO 639-1 code of the spoken language',
    example: 'en',
  })
  iso_639_1: string;

  @ApiProperty({
    type: String,
    description: 'The English name of the spoken language',
    example: 'English',
  })
  english_name: string;
}

export class MovieDetailsDTO {
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
    type: Object,
    description: 'The belongs to collection of the movie',
    example: null,
  })
  belongs_to_collection: null;

  @ApiProperty({
    type: Number,
    description: 'The budget of the movie',
    example: 100000000,
  })
  budget: number;

  @ApiProperty({
    type: () => GenreDTO,
    isArray: true,
    description: 'The genres of the movie',
  })
  genres: GenreDTO[];

  @ApiProperty({
    type: String,
    description: 'The homepage of the movie',
    example: 'https://www.imdb.com/title/tt0137523/',
  })
  homepage: string;

  @ApiProperty({
    type: Number,
    description: 'The ID of the movie',
    example: 550,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The IMDB ID of the movie',
    example: 'tt0137523',
  })
  imdb_id: string;

  @ApiProperty({
    type: String,
    description: 'The original language of the movie',
    example: 'en',
  })
  original_language: string;

  @ApiProperty({
    type: String,
    description: 'The original title of the movie',
    example: 'The Matrix',
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
    type: () => ProductionCompanyDTO,
    isArray: true,
    description: 'The production companies of the movie',
  })
  production_companies: ProductionCompanyDTO[];

  @ApiProperty({
    type: () => ProductionCountryDTO,
    isArray: true,
    description: 'The production countries of the movie',
  })
  production_countries: ProductionCountryDTO[];

  @ApiProperty({
    type: String,
    description: 'The release date of the movie',
    example: '1999-10-15',
  })
  release_date: string;

  @ApiProperty({
    type: Number,
    description: 'The revenue of the movie',
    example: 100853753,
  })
  revenue: number;

  @ApiProperty({
    type: Number,
    description: 'The runtime of the movie',
    example: 139,
  })
  runtime: number;

  @ApiProperty({
    type: () => SpokenLanguageDTO,
    isArray: true,
    description: 'The spoken languages of the movie',
  })
  spoken_languages: SpokenLanguageDTO[];

  @ApiProperty({
    type: String,
    description: 'The status of the movie',
    example: 'Released',
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'The tagline of the movie',
    example: 'Mischief. Mayhem. Soap.',
  })
  tagline: string;

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
