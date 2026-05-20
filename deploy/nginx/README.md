# Flowbrand UI Nginx Setup

Use this when the backend already owns port `3000` and the frontend must be served through Nginx.

## Ports

| Service             | URL                                   | Local port |
| ------------------- | ------------------------------------- | ---------- |
| Backend API         | internal backend                      | `3000`     |
| Production frontend | `http://flowbrand.hng14.com/`         | `3001`     |
| Staging frontend    | `http://staging.flowbrand.hng14.com/` | `3002`     |

## Frontend Environment

Production frontend:

```env
BASE_URL=http://127.0.0.1:3000
APP_URL=http://flowbrand.hng14.com
NEXT_PUBLIC_APP_URL=http://flowbrand.hng14.com
NEXTAUTH_URL=http://flowbrand.hng14.com
AUTH_SECRET=<production-secret>
NEXTAUTH_SECRET=<production-secret>
```

Staging frontend:

```env
BASE_URL=http://127.0.0.1:3000
APP_URL=http://staging.flowbrand.hng14.com
NEXT_PUBLIC_APP_URL=http://staging.flowbrand.hng14.com
NEXTAUTH_URL=http://staging.flowbrand.hng14.com
AUTH_SECRET=<staging-secret>
NEXTAUTH_SECRET=<staging-secret>
```

## Install Nginx Config

From the repo on the server:

```bash
sudo cp deploy/nginx/flowbrand-ui.conf /etc/nginx/sites-available/flowbrand-ui.conf
sudo ln -sf /etc/nginx/sites-available/flowbrand-ui.conf /etc/nginx/sites-enabled/flowbrand-ui.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Verify

Check the frontend services directly:

```bash
curl -I http://127.0.0.1:3001
curl -I http://127.0.0.1:3002
```

Check Nginx routing:

```bash
curl -I http://flowbrand.hng14.com/
curl -I http://staging.flowbrand.hng14.com/
```

Confirm Nginx loaded the expected server blocks:

```bash
sudo nginx -T | grep -A35 -B5 "server_name flowbrand.hng14.com"
sudo nginx -T | grep -A35 -B5 "server_name staging.flowbrand.hng14.com"
```

If either domain still resolves to the backend, another Nginx server block is catching the same `server_name`, or this config has not been enabled/reloaded.
