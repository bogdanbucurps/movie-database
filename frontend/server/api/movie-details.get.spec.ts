import type { H3Event } from 'h3';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetQuery = vi.fn();
const mockCreateError = vi.fn();
const mockUseRuntimeConfig = vi.fn();

vi.mock('h3', () => ({
	getQuery: (event: any) => mockGetQuery(event),
	createError: (options: any) => mockCreateError(options),
}));

vi.mock('#app', () => ({
	useRuntimeConfig: () => mockUseRuntimeConfig(),
}));

(global.$fetch as any) = vi.fn();

describe('movie-details.get', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseRuntimeConfig.mockReturnValue({
			apiBaseUrl: 'http://localhost:3000',
		});
		mockGetQuery.mockImplementation((event) => event.query || {});
		mockCreateError.mockImplementation((options) => {
			const error = new Error(options.message);
			(error as any).statusCode = options.statusCode;
			return error;
		});
	});

	it('extracts ID from query parameters', async () => {
		const mockResponse = {
			id: 550,
			title: 'Fight Club',
			overview: 'A ticking-time-bomb insomniac...',
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./movie-details.get')).default;
		await handler({ query: { id: '550' } } as unknown as H3Event<{ query: { id: string } }>);

		expect(global.$fetch).toHaveBeenCalledWith('/movie/550', expect.any(Object));
	});

	it('throws 400 error if ID is missing', async () => {
		const handler = (await import('./movie-details.get')).default;
		await expect(
			handler({ query: {} } as unknown as H3Event<{ query: { id: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith({
			statusCode: 400,
			message: 'ID is required',
		});
	});

	it('calls backend API with correct ID', async () => {
		const mockResponse = {
			id: 550,
			title: 'Fight Club',
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./movie-details.get')).default;
		await handler({ query: { id: '550' } } as unknown as H3Event<{ query: { id: string } }>);

		expect(global.$fetch).toHaveBeenCalledWith('/movie/550', {
			baseURL: 'http://localhost:3000',
			method: 'GET',
		});
	});

	it('returns response data correctly', async () => {
		const mockResponse = {
			id: 550,
			title: 'Fight Club',
			overview: 'A ticking-time-bomb insomniac...',
			release_date: '1999-10-15',
			vote_average: 8.433,
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./movie-details.get')).default;
		const result = await handler({ query: { id: '550' } } as unknown as H3Event<{
			query: { id: string };
		}>);

		expect(result).toEqual(mockResponse);
	});

	it('handles API errors and maps status codes', async () => {
		const mockError = {
			statusCode: 404,
			message: 'Movie not found',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const handler = (await import('./movie-details.get')).default;
		await expect(
			handler({ query: { id: '999999' } } as unknown as H3Event<{ query: { id: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith({
			statusCode: 404,
			message: 'Movie not found',
		});
	});

	it('throws Nuxt error with correct status code', async () => {
		const mockError = {
			statusCode: 500,
			message: 'Internal Server Error',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const handler = (await import('./movie-details.get')).default;
		await expect(
			handler({ query: { id: '550' } } as unknown as H3Event<{ query: { id: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 500,
				message: 'Internal Server Error',
			})
		);
	});

	it('handles missing statusCode in error response', async () => {
		const mockError = {
			message: 'An unknown error occurred',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const handler = (await import('./movie-details.get')).default;
		await expect(
			handler({ query: { id: '550' } } as unknown as H3Event<{ query: { id: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'An unknown error occurred',
			})
		);
	});
});
