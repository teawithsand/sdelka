import {
	customizeDefaultPlugins,
	makeConfigRequired,
	makeLayoutPlugin,
	makeSelfPlugin,
} from "@teawithsand/tws-gatsby-plugin"

const plugins = customizeDefaultPlugins(
	[
		// SVG icon does not work for some reason. Use PNG instead
		// TODO(teawithsand): make some icon for sdelka
		// makeManifestPlugin("./src/images/icon.png"), 
		makeLayoutPlugin("./src/Layout.tsx"),
	],
	[
		makeSelfPlugin({
			languages: ["en-US"],
		}),
	],
)

const config = makeConfigRequired({}, [...plugins])

export default config
