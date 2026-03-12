# Salon App – Run & set up on QA

Steps to run and set up the salon-app on the QA server (`root@QA:~/salon-app`).

---

## 1. Set environment (QA)

The app uses **Vite modes**. For QA, the mode is `qa`, which loads **`.env.qa`**.

- Ensure **`.env.qa`** exists and has the QA API base URL, for example:
  ```bash
  # .env.qa
  VITE_APP_BASE_URL=http://129.212.226.33/api
  ```
- Replace `http://129.212.226.33` with your QA server host if different.
- No need to set `NODE_ENV`; Vite uses `--mode qa` to choose `.env.qa`.

---

## 2. Install dependencies (one-time)

```bash
cd ~/salon-app
npm install
```

---

## 3. Run on QA

You can either run the **dev server** (for quick testing) or **build and serve** static files (recommended for a stable QA deployment).

### Option A: Dev server (quick test)

```bash
cd ~/salon-app
npm run qa
```

- Runs Vite with `--mode qa` (loads `.env.qa`).
- App is at `http://<QA_HOST>:5173` (or the host Vite prints).
- Stop with `Ctrl+C`. For long-running, use Option B or run under PM2 (see below).

### Option B: Build and serve (recommended for QA)

Build the QA bundle, then serve the `dist` folder with any static server or reverse proxy.

```bash
cd ~/salon-app
npm run build:qa
```

- Output is in **`dist/`**.
- The app is built with **base path `/salon-app/`**, so it must be served under that path (e.g. `https://your-qa-server/salon-app/`).

**Serve with a static server (e.g. `serve`):**

```bash
# Install serve once (if needed)
npm install -g serve

# Serve dist at /salon-app (so app is at http://<QA_HOST>:3000/salon-app/)
serve -s dist -l 3000 -n
```

Then configure your reverse proxy (e.g. nginx) to proxy or serve:
- `/salon-app/` → `http://127.0.0.1:3000/salon-app/`  
  or point the document root for `/salon-app/` to `~/salon-app/dist` with location `/salon-app/` and `try_files` / `alias` as needed.

**Or run the dev server under PM2 (for a persistent QA instance):**

```bash
cd ~/salon-app
pm2 start npm --name "salon-app-qa" -- run qa
pm2 save
```

- Uses `npm run qa` (Vite dev server with `--mode qa`). App will be on the port Vite shows (e.g. 5173). Expose it via nginx or firewall as needed.

---

## 4. Quick reference

| Task | Command |
|------|--------|
| Install deps | `npm install` |
| Run dev server (QA mode) | `npm run qa` |
| Build for QA | `npm run build:qa` |
| Preview built app locally | `npm run preview` (after build) |
| Serve built app (e.g. port 3000) | `serve -s dist -l 3000 -n` (after `npm run build:qa`) |

---

## 5. Env files summary

| File | When used |
|------|-----------|
| `.env` | Base; loaded in all modes |
| `.env.qa` | When running with `--mode qa` (`npm run qa`, `npm run build:qa`) |
| `.env.production` | When running with `--mode production` |

Ensure **`VITE_APP_BASE_URL`** in `.env.qa` points to your QA API (e.g. `http://129.212.226.33/api`).
