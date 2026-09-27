# San Diego DEVx Website

Static site for the San Diego DEVx community. Astro builds the pages. Interactive UI is React.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/)

### Installation

```sh
bun install
bun run dev
```

The site runs at http://localhost:3000.

`bun run build` writes the static site to `dist/`.

### Environment

Copy `env.local.example` to `.env.local` if you need either of these:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NOTION_TOKEN` | No | Fills gathering names and dates from Notion at build time. Without it, the site uses `app/data/events.json`. |
| `LUMA_API_KEY` | No | Used only by `bun run update-events` to refresh `app/data/events.json`. |

## Contributing

The project uses Prettier and ESLint. Pre-commit hooks run `bun run precommit`.

- **[File Conventions](./docs/conventions/file-conventions.md)**
- **[Styling Guidelines](./docs/conventions/styling-guidelines.md)**
- **[Agent Guidelines](./AGENTS.md)**

Style UI with styled-components. Do not add Tailwind.

### Steps to Contribute

1. Fork the repository
2. Create a branch: `git checkout -b feature-name`
3. Commit your changes
4. Push the branch and open a pull request
