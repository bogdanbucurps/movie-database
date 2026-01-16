<template>
	<div v-if="movieDetails" class="movie-details">
		<h1>{{ movieDetails.title }}</h1>
		<p>Released on {{ movieDetails.release_date }}</p>

		<div class="poster">
			<nuxt-img :src="posterUrl" :alt="movieDetails.title" />

			<Badge :value="rating" />
		</div>

		<div class="genres">
			<Badge v-for="genre in movieDetails.genres" :key="genre.id" :value="genre.name" />
		</div>

		<div class="overview">
			<p class="title">Overview</p>
			<p class="content">{{ movieDetails.overview }}</p>
		</div>

		<p class="info">Runtime: {{ movieDetails.runtime }} minutes</p>
		<p class="info">Language: {{ language }}</p>
	</div>
</template>

<script setup lang="ts">
	import type { IMovieDetails } from '~~/interfaces';

	const {
		params: { id },
	} = useRoute();
	const {
		public: { imageBaseUrl },
	} = useRuntimeConfig();

	if (!id) {
		await navigateTo('/');
	}

	const { data: movieDetails, error } = await useAsyncData(`movie-details-${id}`, () =>
		$fetch<IMovieDetails>('/api/movie-details', {
			method: 'GET',
			params: {
				id,
			},
		})
	);

	if (error.value || !movieDetails.value) {
		await navigateTo('/');
	}

	const language = computed(() => {
		return movieDetails.value?.spoken_languages.find(
			(language) => language.iso_639_1 === movieDetails.value?.original_language
		)?.name;
	});
	const posterUrl = computed(() => `${imageBaseUrl}${movieDetails.value?.poster_path}`);
	const rating = computed(() => `${((movieDetails.value?.vote_average ?? 0) * 10).toFixed(0)}%`);

	useSeoMeta({
		title: movieDetails.value?.title,
		ogTitle: movieDetails.value?.title,
		description: movieDetails.value?.overview,
		ogDescription: movieDetails.value?.overview,
		ogImage: posterUrl.value,
	});
</script>

<style lang="scss" scoped>
	.movie-details {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		.poster {
			position: relative;

			img {
				width: 100%;
				height: auto;
				object-fit: cover;
			}

			:deep(.p-badge) {
				position: absolute;
				top: 0.5rem;
				left: 0.5rem;
			}
		}

		.genres {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.overview {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			.title {
				font-size: 1.2rem;
				font-weight: 600;
			}

			.content {
				font-size: 1rem;
				color: #666;
			}
		}
	}
</style>
