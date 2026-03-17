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

### Local Supabase Development

The repo includes a Supabase CLI project under `supabase/` with config and migrations, so you can run the full stack locally.

#### 1. Prerequisites

- **Docker Desktop** – [Install Docker Desktop](https://docs.docker.com/desktop/) and ensure it's running before starting Supabase.
- **Supabase CLI** – [Install the Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started#installing-the-supabase-cli) for your platform.

#### 2. Start the local Supabase stack

From the repo root:

```sh
supabase start
```

On success, you should see output including:

- **Project URL**: `http://127.0.0.1:54321`
- **Studio**: `http://127.0.0.1:54323`
- **Database**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

If you change migrations or want a clean slate:

```sh
supabase stop
supabase db reset   # WARNING: destroys local data, reapplies migrations
supabase start
```

#### 3. Point the Next.js app at local Supabase

Update `.env.local` in the project root:

```sh
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

> Note: the `sb_publishable_...` key is printed in the `supabase start` output under “Authentication Keys → Publishable”.

Restart the dev server after changing `.env.local`.

#### 4. Authentication

For local testing, **username/password authentication** works out of the box – just sign up with any email and password in the app.

For OAuth providers (GitHub, Google), see the [Local OAuth Setup Guide](./docs/local-oauth-setup.md).

#### 5. Common local issues

- **`"no Route matched with those values"` at `127.0.0.1:54321`**  
  This is normal for the bare API root. Use Studio (`http://127.0.0.1:54323`) or `http://localhost:3000` instead.
- **Docker daemon errors (`Cannot connect to the Docker daemon`)**  
  Make sure Docker Desktop is installed and running before you call `supabase start`.

## Admin Access

Certain features (e.g. reviewing talk submissions) are restricted to admin users.
Admin status is stored as `is_admin` on the `profiles` table. To grant admin access,
set `is_admin = true` for the relevant profile row in Supabase (via Studio or SQL).

Admin-only pages:

- `/admin/talks` — View and manage all talk submissions (filter by status, change status)

Access is enforced at both the database level (RLS policies) and the frontend (redirect on
non-admin access).

## GitHub Secrets Required for Production Deploy

The GitHub Actions workflow requires the following repository secrets (Settings → Secrets and variables → Actions):

| Secret | Description |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens). Authenticates the CLI. |
| `SUPABASE_PROJECT_REF` | Project reference ID (found in Supabase project settings → General). Used to link the CLI to the correct project. |
| `SUPABASE_DB_PASSWORD` | Database password for the Supabase project. Required by `supabase db push` to apply migrations. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL. Injected at build time for the frontend client. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon/publishable key. Injected at build time for the frontend client. |

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

## Footnotes

> **Note:** This project is being refactored to use styled-components exclusively. Please do not add new Tailwind classes. See [styling guidelines](./docs/conventions/styling-guidelines.md) for details.
