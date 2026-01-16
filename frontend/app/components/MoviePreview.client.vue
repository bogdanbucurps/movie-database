<template>
	<nuxt-link :to="`/movie/${movie.id}`" class="movie-preview">
		<nuxt-img :src="posterUrl" :alt="movie.title" loading="lazy" />

		<div class="content">
			<p class="title">{{ movie.title }}</p>
			<p class="release-date">Released on {{ movie.release_date }}</p>
		</div>

    <Badge :value="rating" />
	</nuxt-link>
</template>

<script setup lang="ts">
	import type { IMovieItem } from '~~/interfaces';

	const props = defineProps<{
		movie: IMovieItem;
	}>();

	const { public: { imageBaseUrl } } = useRuntimeConfig();

	const posterUrl = computed(() => `${imageBaseUrl}${props.movie.poster_path}`);
	const rating = computed(() => `${(props.movie.vote_average * 10).toFixed(0)}%`);
</script>

<style lang="scss" scoped>
	.movie-preview {
    position: relative;
		display: flex;
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;

    img {
      width: 10rem;
      height: auto;
      object-fit: cover;
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 2rem 1rem;

      .title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #000;
      }

      .release-date {
        font-size: 0.8rem;
        color: #666;
      }
    }

    :deep(.p-badge) {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
    }
	}
</style>
