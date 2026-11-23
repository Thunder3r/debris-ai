# DEBRIS AI — Starter project

A responsive, installable web-app starter for Android and PC. It includes a premium dark interface, DEBRIS personality prompt, chat UI, PWA manifest/service worker, and a server-side AI endpoint.

## Requirements
- Node.js 18+
- An OpenAI API key for live AI replies

## Run locally
1. Extract this ZIP and open the folder in a terminal.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your API key to `.env` (never place it in frontend code).
5. Run `npm run dev`.
6. Open `http://localhost:5173`.

## Android and PC
The app is responsive. For installation, deploy it over HTTPS, then use your browser's **Install app** / **Add to Home screen** option. On PC, use the browser install icon or menu.

## Important: what is and isn't implemented
- Live AI chat: implemented through the server endpoint when a valid API key is configured.
- DEBRIS personality: implemented as the server-side assistant instruction.
- Owner-free Pro: shown as a starter UI/demo state, not secure account entitlements.
- Paid plans: pricing screen is a mock-up only. No money is collected.
- Real authentication, verified owner identity, usage metering, subscription checkout, cancellation, refunds, tax handling, rate limits, and database-backed chat history are **not yet implemented**.
- Voice, image generation, web search, and file uploads are UI placeholders, not working integrations yet.

Before public launch, add secure authentication and enforce owner/subscriber entitlements on the server. Never trust a role or plan sent by the browser. Use a reputable payment provider and have an adult/business owner handle merchant, tax, and payment-account setup where required.

## Configuration
See `.env.example`:
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `PORT`
- `OWNER_EMAIL` (reserved for future auth integration; not yet used for verification)
