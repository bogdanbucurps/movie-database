import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class MovieQueryDTO {
  @ApiProperty({
    type: Number,
    description: 'The page number',
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @ApiProperty({
    type: Boolean,
    description: 'Whether to include adult movies',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeAdult: boolean = false;

  @ApiProperty({
    type: String,
    description: 'The language of the movie',
    example: 'en-US',
    required: false,
  })
  @IsOptional()
  @IsString()
  language: string = 'en-US';

  @ApiProperty({
    type: String,
    description: 'The query to search for movies',
    example: 'The Matrix',
    required: false,
  })
  @IsOptional()
  @IsString()
  query?: string;
}
