import type { NuxtError } from 'nuxt/app';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	const { apiBaseUrl } = useRuntimeConfig();

	try {
		const response = await $fetch('/movie/popular', {
      baseURL: apiBaseUrl,
			method: 'GET',
			params: query,
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		return response;
	} catch (error) {
		const errorResponse = error as NuxtError;

		throw createError({
			statusCode: errorResponse.statusCode!,
			message: errorResponse.message || 'An unknown error occurred',
		});
	}
});
