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

describe('popular-movies.get', () => {
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

	it('forwards query parameters correctly', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 100,
			total_results: 2000,
			results: [],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./popular-movies.get')).default;
		const result = await handler({ query: { page: '1', language: 'en-US' } } as unknown as H3Event<{
			query: { page: string; language: string };
		}>);

		expect(global.$fetch).toHaveBeenCalledWith('/movie/popular', {
			baseURL: 'http://localhost:3000',
			method: 'GET',
			params: { page: '1', language: 'en-US' },
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});
		expect(result).toEqual(mockResponse);
	});

	it('calls backend API with correct baseURL', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 100,
			total_results: 2000,
			results: [],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./popular-movies.get')).default;
		await handler({ query: {} } as unknown as H3Event<{
			query: { page: string; language: string };
		}>);

		expect(global.$fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				baseURL: 'http://localhost:3000',
			})
		);
	});

	it('returns response data correctly', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 100,
			total_results: 2000,
			results: [
				{
					id: 550,
					title: 'Fight Club',
					poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
				},
			],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./popular-movies.get')).default;
		const result = await handler({ query: {} } as unknown as H3Event<{
			query: { page: string; language: string };
		}>);

		expect(result).toEqual(mockResponse);
	});

	it('handles API errors and maps status codes', async () => {
		const mockError = {
			statusCode: 500,
			message: 'Internal Server Error',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const handler = (await import('./popular-movies.get')).default;
		await expect(
			handler({ query: {} } as unknown as H3Event<{ query: { page: string; language: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith({
			statusCode: 500,
			message: 'Internal Server Error',
		});
	});

	it('throws Nuxt error with correct status code', async () => {
		const mockError = {
			statusCode: 404,
			message: 'Not Found',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const handler = (await import('./popular-movies.get')).default;
		await expect(
			handler({ query: {} } as unknown as H3Event<{ query: { page: string; language: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith(
			expect.objectContaining({
				statusCode: 404,
				message: 'Not Found',
			})
		);
	});

	it('handles missing statusCode in error response', async () => {
		const mockError = {
			message: 'Unknown error',
		};

		(global.$fetch as any).mockRejectedValue(mockError);

		const handler = (await import('./popular-movies.get')).default;
		await expect(
			handler({ query: {} } as unknown as H3Event<{ query: { page: string; language: string } }>)
		).rejects.toThrow();

		expect(mockCreateError).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Unknown error',
			})
		);
	});

	it('uses correct HTTP headers', async () => {
		const mockResponse = {
			page: 1,
			total_pages: 100,
			total_results: 2000,
			results: [],
		};

		(global.$fetch as any).mockResolvedValue(mockResponse);

		const handler = (await import('./popular-movies.get')).default;
		await handler({ query: {} } as unknown as H3Event<{
			query: { page: string; language: string };
		}>);

		expect(global.$fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
		);
	});
});
