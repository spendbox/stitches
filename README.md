# Onepad

Client and measurement records for tailors. Works on phones and computers.

- **Clients**: name, phone, email, address, style notes
- **Measurements**: female and male mannequin guides. As you type each measurement, the yellow tape shows where it goes on the body. Keep several sets per client (for example "Standard" and "Wedding gown"), add your own extra measurements, and copy a set to paste into WhatsApp.
- **Orders**: garment, due date, price, deposit and balance, plus a status (Not started → Sewing → Ready → Delivered)
- **Client status links**: on any order, tap **Send on WhatsApp** to send the client a private link. They see the status (Booked → Sewing → Ready → Delivered), due date and balance, and can call or WhatsApp you. No login needed. **Make a new link** cancels the old one.
- **Fast**: the landing page is pre-built, fonts are bundled with the site, pages show a loading placeholder straight away, and every button shows a spinner while it works.
- **Landing page** at the home address, with sign-up and log-in buttons.
- **Trial and full access**: new accounts start in trial mode with everything unlocked and a notice to contact the admin to pay. Once you confirm payment, approve them and the notice disappears.
- **Admin portal** at `/admin`: see all users, search them, approve, block or unblock, record payments received offline (cash, transfer) and see revenue per month.
- **Light mode by default**, with a dark mode switch in Settings.
- **Login**: work email and password only. Onepad handles accounts itself and does not use Supabase Auth.

Built with Next.js, hosted on **Vercel**, with data stored in **Supabase**.

---

## Setup (no coding needed)

### 1. Create the database (Supabase)
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor → New query**.
3. Copy everything in [`supabase/schema.sql`](supabase/schema.sql), paste it in, and click **Run**.
4. Open **Project Settings → API** and copy two values:
   - **Project URL**
   - **service_role** key (in newer projects this is called the **secret** key). Keep it private.

### 2. Put it online (Vercel)
1. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and import this GitHub repository.
2. Before you click **Deploy**, open **Environment Variables** and add these three:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role (secret) key |
| `SESSION_SECRET` | Any long random text, at least 32 characters (for example, mash the keyboard) |
| `ADMIN_EMAIL` | The email you will use to log in at `/admin` |
| `ADMIN_PASSWORD` | A strong password for `/admin` |
| `SUPPORT_PHONE` | *(Optional)* Your WhatsApp number with country code, e.g. `+2348030000000`. Trial users see a button to message you. |
| `SUPPORT_EMAIL` | *(Optional)* Email shown to trial users. If empty, `ADMIN_EMAIL` is used. |

3. Click **Deploy**. When it finishes, open the link and create your account.

### Already deployed before? Two quick updates
1. **Database:** in Supabase, open **SQL Editor → New query**, paste everything from [`supabase/schema.sql`](supabase/schema.sql) again and click **Run**. Your data is kept; this only adds user status and the payments list.
2. **Vercel:** open your project → **Settings → Environment Variables**, add `ADMIN_EMAIL` and `ADMIN_PASSWORD` (and optionally `SUPPORT_PHONE`), then go to **Deployments** and click **Redeploy**.

### Connect onepad.site
1. In Vercel, open your project → **Settings → Domains**, type `onepad.site` and click **Add**. Add `www.onepad.site` too and let Vercel redirect it to `onepad.site`.
2. Vercel shows one or two DNS records. At the company where you bought the domain, open its **DNS settings** and add exactly those records. It usually starts working within an hour.
3. Optional: if the site ever moves to another address, set `NEXT_PUBLIC_SITE_URL` in Vercel to the new address and redeploy. Client status links, link previews and search engines all use it.

### Make it load fast (one-time, 1 minute)
Vercel should run the app in the same part of the world as your database. Otherwise every page waits on a long round trip.
1. In Supabase, open **Project Settings → General** and note the **Region** (for example *West EU (London)* or *East US*).
2. In Vercel, open your project → **Settings → Functions → Function Region**, choose the closest match (London → `lhr1`, Frankfurt → `fra1`, Ireland → `dub1`, East US → `iad1`), save, and redeploy.

### Using the admin portal
- Go to `your-site/admin` and log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- **Users**: search by name, email or phone. **Approve** gives full access, **Block** stops someone logging in (their data is kept), **Unblock** puts them back on trial.
- **Revenue**: when someone pays you, record the amount there (or on their user page). Tick "Also approve" to upgrade them in the same step.

### Security
- Passwords are stored hashed with bcrypt and never saved as plain text.
- Logins use a signed, http-only cookie that lasts 30 days.
- Every database table has Row Level Security turned on with no public access. Only the Onepad server can read your data, and every request is limited to the logged-in tailor's own records.

## Running on your own computer (optional)
```bash
npm install
cp .env.example .env.local   # then fill in the three values
npm run dev
```
