# WOG-FUNDS ONLINE — SETUP

## 1. Create Supabase project
Create a free Supabase project.

## 2. Create database
Open Supabase -> SQL Editor -> New query.
Paste `supabase-schema.sql` and click Run.

## 3. Get project credentials
Supabase -> Project Settings -> API.
Copy:
- Project URL
- anon / public key

## 4. Put them in app.js
Replace:
YOUR_SUPABASE_URL
YOUR_SUPABASE_ANON_KEY

Do NOT use the service_role/secret key in this website.

## 5. Upload to GitHub
Upload:
index.html
style.css
app.js
supabase-schema.sql
SETUP.md

## 6. GitHub Pages
Repository -> Settings -> Pages -> Deploy from branch -> main -> root -> Save.

## Security note
This version intentionally has NO LOGIN. Therefore the database policies allow anyone with the website URL to read, add and delete records. If the app becomes important for real money records, add authentication or an admin-only write layer later.
