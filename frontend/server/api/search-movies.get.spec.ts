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

describe('search-movies.get', () => {
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

	it('forwards query parameters correctly (page, query)', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 10,
			total_results: 200,
			results: [],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./search-movies.get')).default;
		const result = await handler({
			query: { page: '1', query: 'The Matrix' },
		} as unknown as H3Event<{
			query: { page: string; query: string };
		}>);

		expect(global.$fetch).toHaveBeenCalledWith('/movie/search', {
			baseURL: 'http://localhost:3000',
			method: 'GET',
			params: { page: '1', query: 'The Matrix' },
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(result).toEqual(mockResponse);
	});

	it('calls backend API with correct endpoint', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 10,
			total_results: 200,
			results: [],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./search-movies.get')).default;
		await handler({ query: { query: 'Inception' } } as unknown as H3Event<{
			query: { query: string };
		}>);

		expect(global.$fetch).toHaveBeenCalledWith('/movie/search', expect.any(Object));
	});

	it('returns response data correctly', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 10,
			total_results: 200,
			results: [
				{
					id: 603,
					title: 'The Matrix',
					poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
				},
			],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./search-movies.get')).default;
		const result = await handler({ query: { query: 'The Matrix' } } as unknown as H3Event<{
			query: { query: string };
		}>);

		expect(result).toEqual(mockResponse);
	});

	it('handles API errors and maps status codes', async () => {
		const mockError = {
			statusCode: 400,
			message: 'Bad Request',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		vi.mocked(mockCreateError).mockImplementation(() => {
			const error = new Error('Bad Request');
			(error as any).statusCode = 400;
			return error;
		});

		const handler = (await import('./search-movies.get')).default;
		await expect(
			handler({ query: { query: 'Test' } } as unknown as H3Event<{ query: { query: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith({
			statusCode: 400,
			message: 'Bad Request',
		});
	});

	it('throws Nuxt error with correct status code', async () => {
		const mockError = {
			statusCode: 500,
			message: 'Internal Server Error',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const createErrorSpy = vi.fn((options) => {
			const error = new Error(options.message);
			(error as any).statusCode = options.statusCode;
			return error;
		});

		vi.mocked(mockCreateError).mockImplementation(() => {
			const error = new Error('Internal Server Error');
			(error as any).statusCode = 500;
			return error;
		});

		const handler = (await import('./search-movies.get')).default;
		await expect(
			handler({ query: { query: 'Test' } } as unknown as H3Event<{ query: { query: string } }>)
		).rejects.toThrow();

		expect(createErrorSpy).toHaveBeenCalledWith(
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

		vi.mocked(mockCreateError).mockImplementation(() => {
			const error = new Error('An unknown error occurred');
			(error as any).statusCode = 500;
			return error;
		});

		const handler = (await import('./search-movies.get')).default;
		await expect(
			handler({ query: { query: 'Test' } } as unknown as H3Event<{ query: { query: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 500,
				message: 'An unknown error occurred',
			})
		);
	});
});
