import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const root = resolve(dirname(fileURLToPath(import.meta.url)))

// Astro renders each React island on its own. styled-components only emits CSS
// through ServerStyleSheet, and that sheet has to be read after renderToString.
// The collected tag is moved into <head> before hydration so the island markup
// still matches the component.
function styledComponentsSsr() {
	return {
		name: "styled-components-ssr",
		enforce: "pre",
		transform(code, id) {
			if (!id.includes(`${root}/node_modules/@astrojs/react/dist/server.js`)) return null
			if (code.includes("ServerStyleSheet")) return null

			const withImport = code.replace(
				'import ReactDOM from "react-dom/server";',
				'import ReactDOM from "react-dom/server";\nimport { ServerStyleSheet } from "styled-components";'
			)
			const withSheet = withImport.replace(
				"const vnode = React.createElement(Component, newProps);",
				"const sheet = new ServerStyleSheet();\n  const vnode = sheet.collectStyles(React.createElement(Component, newProps));"
			)
			const withStyles = withSheet.replace(
				"html = ReactDOM.renderToString(vnode);",
				`html = ReactDOM.renderToString(vnode);
    html = sheet.getStyleTags() + '<script>(function(){var s=document.currentScript;var t=s&&s.previousElementSibling;if(t&&t.tagName==="STYLE")document.head.appendChild(t);s&&s.remove()})()</script>' + html;`
			)

			if (withStyles === code) {
				throw new Error("styled-components SSR patch did not match @astrojs/react server renderer")
			}
			return withStyles
		}
	}
}

export default defineConfig({
	output: "static",
	server: {
		port: 3000
	},
	integrations: [react({ experimentalDisableStreaming: true })],
	vite: {
		plugins: [styledComponentsSsr()],
		resolve: {
			alias: [{ find: /^@\//, replacement: `${root}/` }],
			dedupe: ["react", "react-dom", "styled-components"]
		},
		ssr: {
			noExternal: ["styled-components"]
		}
	}
})
