# San Diego DEVx Website

Welcome to the San Diego DEVx website repository! This project aims to build a vibrant community of developers in San Diego, providing a platform for networking, learning, and sharing knowledge.

## Development Setup

Follow these instructions to set up the development environment and run the project locally.

### Prerequisites

Make sure you have the following installed on your machine:

- [Bun](https://bun.sh/) (latest version recommended)

### Installation

1. **Clone the repository**:

```sh
git clone https://github.com/yourusername/san-diego-devx.git
cd san-diego-devx
```

2. **Install dependencies**:

```sh
bun install
```

3. **Start the development server with the following command:**:

```sh
bun run dev
```

The site will be running at http://localhost:3000.

### Environment Variables

Realtime doorbell interactions rely on Supabase Realtime. Create a Supabase project (free tier is fine) and add the following to `.env.local`:

```sh
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-public-anon-key>
```

These keys are safe to expose to the browser but should be scoped to the realtime channel only via Supabase RLS/policies.

**Note: This project is being refactored to use styled-components exclusively. Please do not add new Tailwind classes. See [styling guidelines](./docs/conventions/styling-guidelines.md) for details.**

## Contributing

We welcome contributions from the community! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

### Guidelines

The project uses Prettier and ESLint for code formatting and linting.
Integrating ESLint in your editor is recommended to ensure that the code
formatting in addition to the linting rules are followed. For VSCode, you can
use [the ESLint extension](https://github.com/Microsoft/vscode-eslint).

Pre-commit hooks are in place to ensure that the code is properly formatted
before a commit is added to the repo. The pre-commit hook runs the precommit
script (`bun run precommit`).

For detailed code style and organization guidelines:

- **[File Conventions](./docs/conventions/file-conventions.md)** - File structure and organization patterns for all code files
- **[Styling Guidelines](./docs/conventions/styling-guidelines.md)** - Styled-components usage and migration from Tailwind
- **[Agent Guidelines](./AGENTS.md)** - Complete coding standards for AI agents and developers

### Steps to Contribute

1. **Fork the repository**
2. **Create a new branch**:
   ```sh
   git checkout -b feature-name
   ```
3. **Make your changes and commit**
   ```sh
   git add .
   git commit -m "Add some feature"
   ```
4. **Push to the branch**
   ```sh
   git push origin feature-name
   ```
5. **Open a pull request on Github**
