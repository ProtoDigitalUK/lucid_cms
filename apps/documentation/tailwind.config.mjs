import starlightPlugin from "@astrojs/starlight-tailwind";

/** @type {import('tailwindcss').Config} */

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				accent: {
					base: "#C5F74E",
					hover: "#A3E82A",
					contrast: "#000",
				},
				container: {
					1: "#070707",
				},
				typography: {
					title: {
						light: "#F1F1F1",
						dark: "#000",
					},
					body: {
						light: "#F1F1F1",
						dark: "#000",
					},
				},
			},
		},
	},
	safelist: ["site-title", "header"],
	plugins: [starlightPlugin()],
};
