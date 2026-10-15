This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Newsletter and Resend

The subscribe form posts to `/api/subscribe`. A successful request saves the email
as a Resend Contact and adds it to the configured newsletter segment. The handler
then attempts a welcome email and a separate team notification. Email failures do
not undo a saved subscription; the form tells readers when a welcome email could
not be sent. Existing contacts are reused; submitting again can opt an unsubscribed
contact back in. Each email uses its own Resend idempotency key for 24 hours.
Delivery and bounces can be checked in the Resend dashboard.

Copy `.env.example` to `.env.local` for local development. On Vercel, keep the
existing production values under **Project Settings → Environment Variables**:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Required server-only key with **Full access** to manage Contacts and send emails. A sending-only key cannot save subscribers. |
| `RESEND_FROM_EMAIL` | Required sender on your existing verified Resend domain, such as `Budera <hello@your-verified-domain.com>`. The `onboarding@resend.dev` test sender cannot send welcome emails to general subscribers. |
| `RESEND_NOTIFY_EMAIL` | Team inbox for new subscriber notifications. Defaults to `budera.founders@gmail.com`. |
| `RESEND_SEGMENT_ID` | Optional existing Resend newsletter segment. Set this to group signups for Broadcasts; without it they are saved in the global Contact list. |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata and the sitemap. |

Set variables for the Vercel environments you deploy to, then redeploy. Never
prefix the Resend key with `NEXT_PUBLIC_` or commit `.env.local`.

Run `npm run subscriptions:check` with those environment values loaded to check
Contacts access, the configured segment, and sender-domain verification. It uses
the same `.env*` loading rules as Next.js, prints no credentials or contact details,
does not change contacts, and sends no emails. It exits with a nonzero status when
configuration fails. Sending quotas and inbox delivery still need a live check.
For production failures, match the reference shown by the form to Vercel function
logs for `/api/subscribe`; the log identifies the failing operation and Resend
error code. Transient API failures retry up to twice within an 18-second overall
provider time budget; permission, validation, and quota failures are not retried.

Publishing an article does not automatically send a campaign; send newsletter
Broadcasts from Resend to your configured segment.

`npm test` exercises the real subscription handler and Resend SDK against mocked
HTTP responses, including rejected sends, invalid input, retries, and returning
subscribers. It does not send live emails.

The ATOMS **Get new episodes** button opens the newsletter form until a real
episode destination is available. Guest and suggestion buttons open an email to
the team with the subject filled in.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
