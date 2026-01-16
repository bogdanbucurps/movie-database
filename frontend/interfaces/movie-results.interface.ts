import { IMovieItem } from './movie-item.interface';

export interface IMovieResults {
	page: number;
	total_pages: number;
	total_results: number;
	results: IMovieItem[];
}
