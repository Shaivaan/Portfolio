# Portfolio

My personal portfolio site, with a small admin panel to update its content without touching code.

- **Public site** (`/`): a single page with About, Experience, Projects, Skills, Education and Contact. Dark theme by default, with a light theme toggle.
- **Admin panel** (`/admin`): password-protected forms to add, edit, hide and delete everything shown on the site, including image uploads.

## Tech stack

| Part | What it uses |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components) + TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Database | [Neon](https://neon.com) Postgres, accessed with [Drizzle ORM](https://orm.drizzle.team) |
| Image storage | Neon Object Storage (S3-compatible), via [Files SDK](https://files-sdk.dev) |
| Admin auth | One password, stored only as a scrypt hash, plus a signed session cookie ([jose](https://github.com/panva/jose)) |
| Hosting | [Vercel](https://vercel.com) |

## Running it locally

**You need:** Node.js 20 or newer, and access to the Neon project.

1. **Install packages**

   ```bash
   npm install
   ```

2. **Get the environment variables.** Sign in to Neon and link this folder to the project; this writes the database and storage keys into `.env.local`:

   ```bash
   npx neon@latest login
   npx neon@latest link
   npx neon@latest env pull
   ```

   See [`.env.example`](.env.example) for the full list of variables.

3. **Set the admin password.** This asks for a password (at least 10 characters) and saves its hash, plus a session secret, to `.env.local`:

   ```bash
   npm run admin:set-password
   ```

4. **Create the database tables** (only needed on a new database):

   ```bash
   npm run db:migrate
   ```

5. **Start the app**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 for the site and http://localhost:3000/admin for the admin panel.

To check that the database and storage are reachable, open http://localhost:3000/api/health.

## Updating the content

Everything on the site comes from the database and is edited in `/admin`:

| Section | What you can set |
| --- | --- |
| Profile | Name, headline, about text, focus areas, email, location, photo, resume link, "open to work" badge |
| Skills | Name, category, icon. **Quick add** creates many at once (comma or newline separated). |
| Projects | Name, descriptions, type, live and GitHub links, image, tech stack, featured |
| Experience | Company, role, dates (leave "To" empty for a current job), bullet points, tech stack, logo |
| Education | Institution, degree, dates, grade |
| Social links | GitHub, LinkedIn, LeetCode and other profiles |

A few things to know:

- **Add skills first.** Projects and experience pick their tech stack from the skills list.
- **Order** fields control the order on the site: lower numbers come first.
- **Hide** removes an item from the site without deleting it.
- **Images** can be up to 4 MB (JPG, PNG, WebP, AVIF, GIF or SVG). When you replace or delete one, the old file is removed from storage too.
- **The resume** is a link (for example a Google Drive file shared as "Anyone with the link"), not an upload.
- Saving in the admin updates the public page right away.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (needs the env vars, because the home page is built from the database) |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the code |
| `npm run admin:set-password` | Set or change the admin password |
| `npm run db:generate` | Create a migration after changing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:studio` | Browse the database in the browser |

## Project structure

```
src/
  app/
    page.tsx               Public portfolio page
    admin/login/           Admin login
    admin/(dashboard)/     Admin screens: profile, skills, projects, experience, education, social-links
    api/health/            Database and storage health check
  components/
    site/                  Public page sections and theme toggle
    admin/                 Admin form fields, list actions, form wrapper
  db/
    schema.ts              Database tables
    index.ts               Database connection
  lib/
    portfolio.ts           Cached query that loads everything the public page shows
    storage.ts             Image upload, delete and public URLs
    auth/                  Password check, session cookie, access check for admin pages and actions
    admin/form.ts          Form validation helpers
  proxy.ts                 Redirects signed-out visitors away from /admin
drizzle/                   SQL migrations
scripts/                   Admin password script
```

## Deploying to Vercel

1. Import this repository on [vercel.com/new](https://vercel.com/new). The framework is detected as Next.js.
2. Add the environment variables from `.env.local` (you can paste the whole file into the Environment Variables screen):
   `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`.
3. Deploy.
4. In **Settings → Functions**, set the function region close to the database. The Neon project is in AWS `us-east-2` (Ohio), so pick Cleveland (`cle1`), or Washington D.C. (`iad1`). Redeploy after changing it.

After changing the admin password, update `ADMIN_PASSWORD_HASH` on Vercel and redeploy.

## Notes

- The database and storage are in Ohio, US. Locally from India each database query takes about 300 ms, so the admin panel feels slower in development than it does on Vercel.
- `.env.local` holds real keys and is git-ignored. Never commit it.
