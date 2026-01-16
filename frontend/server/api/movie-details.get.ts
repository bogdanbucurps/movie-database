import type { NuxtError } from 'nuxt/app';

export default defineEventHandler(async (event) => {
	const params = getQuery(event);

	const id = params.id as string;

	if (!id) {
		throw createError({
			statusCode: 400,
			message: 'ID is required',
		});
	}

	const { apiBaseUrl } = useRuntimeConfig();

	try {
		const response = await $fetch(`/movie/${id}`, {
			baseURL: apiBaseUrl,
			method: 'GET',
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
