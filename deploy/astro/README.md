# Astro recipes for the home server

Copy these files into the Astro project root (not an app in this monorepo).

| Need                                        | Use                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Pure static output                          | `Dockerfile.static` + `nginx.conf` + `security-headers.conf`                                                  |
| Endpoints, forms, sessions, any server code | `Dockerfile.ssr` (adapter `@astrojs/node`, `mode: "standalone"`, and a `src/pages/healthz.ts` returning `ok`) |

Both serve on `0.0.0.0:8080`, expose `GET /healthz`, run as non-root, and work with `--read-only --tmpfs /tmp`. `Dockerfile.ssr` also declares a `/data` volume.

Public values are passed as build args (`--build-arg PUBLIC_SITE_URL=...`); add one `ARG` and `ENV` pair per `PUBLIC_*` variable. Runtime secrets (SSR only) come from the environment.

```sh
docker build -f Dockerfile.static -t site .
docker run --read-only --tmpfs /tmp -p 8080:8080 site
```

Static assets under `/_astro/` are cached for a year (immutable); HTML is `no-cache`. Pre-compressed `.gz` files next to the assets are served when present (`gzip_static`). Add a Content-Security-Policy to `security-headers.conf` once the site's script and style sources are known.
