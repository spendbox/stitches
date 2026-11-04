# Stitches

Client and measurement records for tailors. Works on phones and computers.

- **Clients**: name, phone, email, address, style notes
- **Measurements**: female and male mannequin guides. As you type each measurement, the yellow tape shows where it goes on the body. Keep several sets per client (for example "Standard" and "Wedding gown"), add your own extra measurements, and copy a set to paste into WhatsApp.
- **Orders**: garment, due date, price, deposit and balance, plus a status (Not started → Sewing → Ready → Delivered)
- **Login**: work email and password only. Stitches handles accounts itself and does not use Supabase Auth.

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

3. Click **Deploy**. When it finishes, open the link and create your account.

### Security
- Passwords are stored hashed with bcrypt and never saved as plain text.
- Logins use a signed, http-only cookie that lasts 30 days.
- Every database table has Row Level Security turned on with no public access. Only the Stitches server can read your data, and every request is limited to the logged-in tailor's own records.

## Running on your own computer (optional)
```bash
npm install
cp .env.example .env.local   # then fill in the three values
npm run dev
```
