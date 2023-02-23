import {
	Paths,
	useLanguagePrefixedPaths,
	UseLanguagePrefixedPathsConfig,
} from "@teawithsand/tws-trans"

export interface AppPaths extends Paths {
	homePath: string
	blogPostsPath: string
	tagsPath: string
	appsPath: string
	contactPath: string
	tagPath: (tag: string) => string
}

const paths: AppPaths = {
	homePath: "/",
	blogPostsPath: "/posts",
	tagsPath: "/tags",
	appsPath: "/apps",
	contactPath: "/contact",
	tagPath: (tag: string) =>
		// eslint-disable-next-line no-control-regex
		`/tag/${tag.replace(/[^\x00-\x7F]/g, "").toLowerCase()}`,
}

const config: UseLanguagePrefixedPathsConfig = {
	allowedLanguages: ["en-US", "pl-PL"],
	defaultLanguage: "en-US",
}

export const useAppPaths = (): AppPaths =>
	useLanguagePrefixedPaths(paths, config)
