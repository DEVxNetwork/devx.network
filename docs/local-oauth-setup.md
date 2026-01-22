# Local OAuth Setup Guide

This guide explains how to set up OAuth providers (GitHub, Google, etc.) for local Supabase development. This is **optional** – username/password authentication works out of the box.

## GitHub OAuth

To log in with GitHub against your local Supabase instance:

### 1. Create a GitHub OAuth App

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. Use these settings:
   - **Application name**: `DEVx Local`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://127.0.0.1:54321/auth/v1/callback`
3. After creating the app, copy the **Client ID** from the app's page
4. Click **"Generate a new client secret"** and copy the secret

### 2. Configure Supabase

Add GitHub OAuth configuration to `supabase/config.toml`:

```toml
[auth.external.github]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET)"
```

### 3. Set Environment Variables

Create `supabase/.env` (this file is git-ignored):

```sh
SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID=your_client_id_here
SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET=your_client_secret_here
```

### 4. Restart Supabase

```sh
supabase stop && supabase start
```

## Google OAuth

Similar steps apply for Google OAuth:

1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Set the authorized redirect URI to `http://127.0.0.1:54321/auth/v1/callback`
3. Add to `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
skip_nonce_check = true
```

4. Add credentials to `supabase/.env`

## Troubleshooting

### "Unsupported provider: provider is not enabled"

- Ensure the provider section exists in `supabase/config.toml` with `enabled = true`
- Verify environment variables are set in `supabase/.env`
- Restart Supabase: `supabase stop && supabase start`

### OAuth callback errors

- Verify the callback URL in your OAuth app matches exactly: `http://127.0.0.1:54321/auth/v1/callback`
- Note: Use `127.0.0.1` not `localhost` for the callback URL
