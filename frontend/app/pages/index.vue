<template>
	<div class="homepage">
		<h1>Movie Database</h1>

		<div class="section">
			<p id="search-movies-title" class="title">Search Movies</p>

			<ClientOnly>
				<InputGroup>
					<InputGroupAddon>
						<Button icon="pi pi-search" @click="onSearchMovies()" />
					</InputGroupAddon>

					<InputText v-model="searchQuery" placeholder="Search movies" @keyup="onSearchMovies()" />
				</InputGroup>
			</ClientOnly>

			<div v-if="searchResults && searchResults.results.length" class="movies">
				<MoviePreview
					v-for="(movie, index) in searchResults.results"
					:key="`movie-${index}`"
					:movie="movie" />

				<Paginator
					:total-records="searchResults.total_results"
					:rows="searchResults.results.length"
					@page="onSearchMovies" />
			</div>

			<div v-else class="no-movies">No movies found</div>
		</div>

		<div class="section">
			<p id="popular-movies-title" class="title">Popular Movies</p>

			<div v-if="popularMovies && popularMovies.results.length" class="movies">
				<MoviePreview
					v-for="(movie, index) in popularMovies.results"
					:key="`movie-${index}`"
					:movie="movie" />

				<Paginator
					:total-records="popularMovies.total_results"
					:rows="popularMovies.results.length"
					@page="onPopularMoviesPageChange" />
			</div>

			<div v-else class="no-movies">No movies found</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { PageState } from 'primevue';
	import debounce from 'lodash/debounce';

	import type { IMovieResults } from '~~/interfaces';

	const popularMoviesPage = ref<number>(1);
	const searchMoviesPage = ref<number>(1);
	const searchQuery = ref<string>('');
	const searchResults = ref<IMovieResults | null>(null);

	const { data: popularMovies, refresh: refreshPopularMovies } = await useAsyncData<IMovieResults>(
		'popular-movies',
		() =>
			$fetch<IMovieResults>('/api/popular-movies', {
				method: 'GET',
				query: {
					page: popularMoviesPage.value,
				},
			})
	);

	const onPopularMoviesPageChange = async (event: PageState) => {
		popularMoviesPage.value = event.page + 1;
		await refreshPopularMovies();

		const popularMoviesTitle = document.getElementById('popular-movies-title');
		if (popularMoviesTitle) {
			popularMoviesTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

	const onSearchMovies = debounce(async (event?: PageState) => {
		if (event) {
			searchMoviesPage.value = event.page + 1;
		}

		if (!searchQuery.value) {
			searchMoviesPage.value = 1;
			searchResults.value = null;
			return;
		}

		try {
			const response = await $fetch<IMovieResults>('/api/search-movies', {
				method: 'GET',
				query: {
					page: searchMoviesPage.value,
					query: searchQuery.value,
				},
			});

			searchResults.value = response;

			const searchMoviesTitle = document.getElementById('search-movies-title');
			if (searchMoviesTitle) {
				searchMoviesTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		} catch (error) {
			searchMoviesPage.value = 1;
			searchResults.value = null;
		}
	}, 500); // 500ms debounce time
</script>

<style lang="scss" scoped>
	.homepage {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 2rem;

		.section {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			width: 100%;

			.title {
				font-size: 1.5rem;
				font-weight: 600;
			}

			.movies {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}
		}
	}
</style>
