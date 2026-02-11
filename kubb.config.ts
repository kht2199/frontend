import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig({
	input: {
		// TODO: Replace with your actual OpenAPI spec URL or file path
		path: "./openapi.json",
	},
	output: {
		path: "./src",
		clean: true,
	},
	plugins: [
		pluginOas(),
		pluginTs({
			output: { path: "models" },
		}),
		pluginZod({
			output: { path: "zod" },
		}),
		pluginReactQuery({
			output: { path: "hooks" },
		}),
	],
});
