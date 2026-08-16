# Azure Hosting Notes for n8n (Student Credits)

This project only needs one change in frontend config when moving from local n8n to Azure:

- Set VITE_N8N_WEBHOOK_URL in frontend/.env to your Azure-hosted webhook URL.

Example:

VITE_N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/renovateai/lead-intake

## Recommended Azure Option

Use Azure Container Apps for simple managed hosting.

Why:

- Good fit for containerized n8n
- HTTPS endpoint by default
- Easy environment variable management

## Required n8n Environment Variables

At minimum configure these in Azure:

- N8N_HOST=<your public host name>
- N8N_PROTOCOL=https
- WEBHOOK_URL=https://<your public host name>/
- N8N_EDITOR_BASE_URL=https://<your public host name>/
- N8N_ENCRYPTION_KEY=<strong random value>
- SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
- SUPABASE_SECRET_KEY=<your supabase secret key>

Important:

- Keep N8N_ENCRYPTION_KEY stable forever for that environment.
- Do not commit keys or credential values in repo files.
- Keep SUPABASE_SECRET_KEY server-side only (never in frontend env).
- Workflow supports fallback SUPABASE_SERVICE_ROLE_KEY for older Supabase projects.

## Persistence

n8n needs persistent storage for workflow state and credentials.

- If using SQLite, mount persistent volume to n8n data path.
- For better reliability, use Postgres and point n8n to that database.

## Network and Security

- Restrict editor access with basic auth or SSO.
- Use HTTPS only.
- Add CORS allowlist to include your frontend domain when needed.
- Keep API credentials in n8n credential store, not in workflow JSON.

## Frontend Deployment Impact

After Azure n8n is live:

1. Update frontend/.env with Azure webhook URL.
2. Rebuild/redeploy frontend.
3. Test one submission end-to-end and verify n8n execution log.
