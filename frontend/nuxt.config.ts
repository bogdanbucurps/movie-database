import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-29',

	css: ['primeicons/primeicons.css', '~/assets/main.scss'],

	devtools: { enabled: true },

	modules: ['@primevue/nuxt-module', '@nuxt/eslint', '@nuxt/image'],

	postcss: {
		plugins: {
			autoprefixer: {},
			cssnano: {
				preset: ['default', { discardComments: { removeAll: true } }],
			},
		},
	},

	primevue: {
		autoImport: true,
		options: {
			ripple: true,
			inputVariant: 'filled',
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: '.dark-mode',
				},
			},
		},
		usePrimeVue: true,
	},

	runtimeConfig: {
		apiBaseUrl: '',
		public: {
			imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
		},
	},

	ssr: true,

	vite: {
		server: {
			hmr: {
				overlay: false,
			},
		},
		optimizeDeps: {
			include: ['vue', 'vue-router'],
		},
	},
});
