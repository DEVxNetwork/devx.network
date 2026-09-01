# Stage 1: build the static export from source (no host-built out/ required —
# this makes the image buildable directly by CapRover, via `caprover deploy`
# or a tarball upload, with no CI/registry round-trip needed).
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./

# --ignore-scripts: sqlite3/better-sqlite3 are unused dead deps that otherwise
# try to compile a native module at install time and need a full toolchain.
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .

# Public Supabase anon key/URL — safe to bake in, matches .github/workflows/check.yml.
ARG NEXT_PUBLIC_SUPABASE_URL="https://psbmuerdpmkajkkldqtz.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYm11ZXJkcG1rYWpra2xkcXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDE1NjcsImV4cCI6MjA3ODkxNzU2N30.JKaPS9tajIe6YJklEAdlih8a5xA-XgD3hStwKOEiihI"
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN bun run build

# Stage 2: serve the static export
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
