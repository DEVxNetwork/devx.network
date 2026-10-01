import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import { loadEnv } from "vite"
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

// GitHub Pages only serves the static build, so the Notion token never ships
// to the browser. This route exists on the dev server. The form mails the
// proposal when the route is absent.
function speakApi() {
	const endpoint = "/api/speak"
	return {
		name: "speak-api",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const url = req.url?.split("?")[0]
				if (url !== endpoint) return next()
				if (req.method !== "POST") {
					sendJson(res, 405, { ok: false, error: "Use POST." })
					return
				}

				try {
					if (!process.env.NOTION_TOKEN) {
						const env = loadEnv(server.config.mode, root, "NOTION_")
						if (env.NOTION_TOKEN) process.env.NOTION_TOKEN = env.NOTION_TOKEN
					}
					const raw = await readBody(req, 20_000)
					const mod = await server.ssrLoadModule(
						resolve(root, "app/services/notion/presentations.ts")
					)
					const result = await mod.handleSpeakPost(raw)
					sendJson(res, result.status, result.body)
				} catch (error) {
					const status = error && error.status === 413 ? 413 : 500
					console.warn(error)
					sendJson(res, status, {
						ok: false,
						error: status === 413 ? "That note is too long." : "Something went wrong. Try again."
					})
				}
			})
		}
	}
}

function sendJson(res, status, body) {
	res.statusCode = status
	res.setHeader("Content-Type", "application/json")
	res.end(JSON.stringify(body))
}

function readBody(req, max) {
	return new Promise((resolveBody, reject) => {
		let size = 0
		const chunks = []
		req.on("data", (chunk) => {
			size += chunk.length
			if (size > max) {
				const error = new Error("too large")
				error.status = 413
				reject(error)
				req.destroy()
				return
			}
			chunks.push(chunk)
		})
		req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")))
		req.on("error", reject)
	})
}

export default defineConfig({
	output: "static",
	redirects: {
		"/who-we-are": "/about"
	},
	server: {
		port: 3000
	},
	integrations: [react({ experimentalDisableStreaming: true })],
	vite: {
		plugins: [styledComponentsSsr(), speakApi()],
		resolve: {
			alias: [{ find: /^@\//, replacement: `${root}/` }],
			dedupe: ["react", "react-dom", "styled-components"]
		},
		ssr: {
			noExternal: ["styled-components"]
		}
	}
})
