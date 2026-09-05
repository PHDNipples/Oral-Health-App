# Public Release Security Checklist

Status: **NO-GO until every requirement below is checked.**

Complete the items in order. Each item is complete only when all of its requirements and evidence are satisfied.

## 1. Production API and frontend deployment

- [x] Choose and document one production hosting path for the frontend and backend: Render Static Site at `https://oral-health-app-frontend.onrender.com` for the frontend and Render Web Service at `https://oral-health-app.onrender.com` for the backend, as recorded in `README.md` and `render.yaml`.
- [x] In the Render frontend service `oral-health-app-frontend`, rename the existing `VITE_API_URI` variable to `VITE_API_URL` and set its value to `https://oral-health-app.onrender.com`; leave the Google Maps variables unchanged. Save and redeploy using the current repository commit.
- [x] Verify the production frontend does not send API requests to `localhost`, `127.0.0.1`, or a Vite development proxy. The deployed bundle uses `https://oral-health-app.onrender.com`; its one remaining `localhost` string is React Router's internal URL fallback, not an API endpoint.
- [ ] Verify the deployed frontend can successfully call `/api/health` and an authenticated API route from the real public origin. The backend health request from the frontend origin is verified; the authenticated route still requires a real sign-in test.
- [x] Set `FRONTEND_ORIGINS=https://oral-health-app-frontend.onrender.com` in the Render backend service `oral-health-app`, save, and redeploy. The live backend returns `Access-Control-Allow-Origin: https://oral-health-app-frontend.onrender.com` and does not grant the unapproved-origin probe.
- [x] Verify the deployment does not expose a broken `/api` route through GitHub Pages or another static host. The Render frontend host returns its HTML application for `/api/health`, not a backend JSON response; API traffic must go to `https://oral-health-app.onrender.com`.
- [x] Record the final frontend URL, backend URL, and deployment settings in `README.md` and `render.yaml`.

## 2. HTTPS and transport security

- [x] Serve the public backend only through HTTPS with a valid certificate. The HTTPS health endpoint responds successfully.
- [x] Configure the hosting proxy or load balancer to redirect HTTP to HTTPS, or reject public HTTP traffic. Render redirects the HTTP backend URL to HTTPS.
- [ ] If TLS terminates at a reverse proxy, configure Express proxy handling correctly and verify HTTPS redirect logic cannot be bypassed through spoofed headers.
- [ ] Verify cookies, if introduced later, use `Secure`, `HttpOnly`, and an appropriate `SameSite` policy.
- [ ] Verify no production configuration, API URL, documentation, or browser network request uses plain HTTP except local development.
- [ ] Confirm security headers are supplied by the edge or application, including at least `Strict-Transport-Security`, `X-Content-Type-Options`, and a suitable `Content-Security-Policy`.

## 3. JWT validation and revocation

- [ ] Define the JWT contract: issuer, audience, algorithm, maximum lifetime, required subject or UID claim, and required token version claim.
- [ ] Configure signing and verification to allow only the selected algorithm; do not rely on library defaults.
- [ ] Verify tokens reject missing, malformed, expired, wrong-issuer, wrong-audience, wrong-algorithm, and missing-claim cases.
- [ ] Bind the authenticated request identity to the immutable Firebase UID, not to a mutable email address or user-supplied identifier.
- [ ] Verify logout increments the server-side token version and that the previously issued token is rejected afterward.
- [ ] Verify token revocation also works after account deletion, account disablement, or another required security event.
- [ ] Confirm JWT secrets are long, randomly generated, stored only in the deployment secret manager, and never returned in responses or logs.
- [ ] Add automated tests for all rejected-token and revoked-token cases.

## 4. Firebase authentication

- [ ] Verify every backend Firebase token is checked with the Firebase Admin SDK for the intended project and tenant, if applicable.
- [ ] Verify revoked Firebase ID tokens are rejected using the Admin SDK revocation check where the flow requires it.
- [ ] Verify disabled, deleted, unverified, and otherwise unauthorized Firebase accounts cannot obtain a backend session, according to the product policy.
- [ ] Verify the backend creates or links a MongoDB user only after Firebase verification succeeds.
- [ ] Prevent account-linking by email from attaching a Firebase UID to the wrong existing account; use an explicit, verified linking policy.
- [ ] Verify Firebase errors return generic client messages and do not expose credentials, token contents, stack traces, or database details.
- [ ] Add automated tests for invalid, revoked, disabled, and cross-account Firebase authentication cases.

## 5. IDOR and authorization

- [ ] Enforce ownership using the authenticated Firebase UID on every user-owned read, update, delete, and future resource endpoint.
- [ ] Do not authorize access by comparing mutable email fields.
- [ ] Reject requests that attempt to update immutable identity fields such as Firebase UID or account ownership.
- [ ] Verify a user cannot read, modify, or delete another user by changing a path ID, query parameter, request body, or JWT claim.
- [ ] Return consistent `401` responses for unauthenticated requests and `403` responses for authenticated requests without ownership.
- [ ] Add automated two-user tests covering profile reads, updates, deletes, and every user-owned resource.

## 6. MongoDB production access

- [ ] Use a dedicated least-privilege MongoDB application user; do not use an owner or administrator account.
- [ ] Restrict MongoDB network access to the backend deployment using private networking or an explicit IP allowlist.
- [ ] Require TLS for the MongoDB connection and verify the production URI does not disable certificate validation.
- [ ] Configure connection timeout, server-selection timeout, and pool limits appropriate for the deployment.
- [ ] Confirm unique indexes and required validation exist for email and Firebase UID, and test duplicate/linking conflicts safely.
- [ ] Ensure queries use validated identifiers and controlled update fields; prevent mass assignment of protected fields.
- [ ] Verify database errors are logged securely and generic errors are returned to clients.
- [ ] Confirm backups, retention, restore testing, and deletion requirements are documented for user data.

## 7. Request abuse and application hardening

- [ ] Keep the JSON and URL-encoded body limits intentionally small for each route; verify oversized requests return `413`.
- [ ] Apply rate limits to Firebase login, signup, password recovery, logout, and other expensive or security-sensitive endpoints.
- [ ] Configure rate limiting for the real deployment topology so proxy headers cannot let attackers evade limits.
- [ ] Decide whether limits need a shared store for multiple backend instances and configure one if required.
- [ ] Validate and constrain all user-controlled strings, IDs, emails, names, and update fields.
- [ ] Verify error responses do not reveal stack traces, secrets, tokens, MongoDB details, or Firebase details.
- [ ] Add request logging and alerting for repeated authentication failures, authorization failures, and rate-limit events without logging credentials or tokens.

## 8. Release verification

- [x] Run the complete backend test suite with `npm test` from `backend/`; all 8 tests pass.
- [x] Run the frontend production check with `npm run build` from `frontend/`; TypeScript and Vite build both pass.
- [ ] Add and pass tests for the JWT, Firebase revocation, IDOR, production CORS, HTTPS/proxy, and MongoDB requirements above.
- [ ] Perform a clean checkout or equivalent CI build using only documented environment variables and deployment secrets. The backend `npm ci --dry-run` passes against the current lockfile, but the full clean production checkout still needs to be documented and verified.
- [ ] Scan Git-tracked files and Git history for `.env` files, private keys, service-account files, credentials, tokens, and accidental secret values.
- [ ] Confirm generated `dist/` output contains no backend secrets, private keys, internal database URLs, or unintended development endpoints.
- [ ] Review the final dependency audit and resolve or explicitly accept all high and critical vulnerabilities.
- [ ] Have a second reviewer verify this checklist and the release evidence.

## 9. Final gate: rotate credentials immediately before public release

Do this only after all previous requirements are complete and the deployment configuration is ready to receive new values.

- [ ] Rotate the production MongoDB password or application user credentials.
- [ ] Rotate the production JWT signing secret; invalidate all existing backend JWTs.
- [ ] Rotate Firebase Admin service-account credentials or replace the service account if any credential may have existed in repository history.
- [ ] Rotate any other API keys, tokens, hosting secrets, or deployment credentials found during the final scan.
- [ ] Update only the production secret manager or deployment environment with the new values; do not commit them or place them in frontend source.
- [ ] Redeploy and verify health, Firebase sign-in, protected API access, logout revocation, and database access with the new credentials.
- [ ] Verify old credentials and all previously issued JWTs no longer work.
- [ ] Run the final Git-tracked secret scan again and confirm it is clean.
- [ ] Record rotation time, affected services, verification results, and the next rotation owner/date without recording secret values.
- [ ] Mark the release **GO** only after this final item is complete.
