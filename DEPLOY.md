# Modern Mass — Step-by-Step Deployment Guide

Follow these steps in order. Each one takes only a few minutes.

---

## Step 1 — Create a Sanity account and project

1. Go to [sanity.io](https://sanity.io) and click **Get started free**
2. Sign up with Google or email
3. Once logged in, click **Create new project**
4. Name it `modern-mass`, choose the **Free plan**, click **Create project**
5. Note your **Project ID** — it's shown on the project dashboard (looks like `abc12def`)

---

## Step 2 — Add the prayer schema to Sanity

1. In your Sanity project dashboard, click **Schema** in the left menu
2. You'll need to add the schema via the Sanity Studio. The easiest way:
   - Download the `sanity-schema/prayer.ts` file from the project folder
   - Follow the Sanity setup guide in `sanity-schema/SETUP.md` to initialise a local Studio
   - Or ask a developer to set this up — it takes about 20 minutes

> **Shortcut:** For now, you can use the Sanity web interface to create documents manually without setting up the Studio locally. See Step 5.

---

## Step 3 — Create a GitHub account and upload the code

1. Go to [github.com](https://github.com) and sign up for a free account
2. Click **New repository** (the green button)
3. Name it `modern-mass`, set it to **Private**, click **Create repository**
4. On the next screen, click **uploading an existing file**
5. Drag and drop the entire `modern-mass-website` folder contents
6. Click **Commit changes**

---

## Step 4 — Create a Vercel account and deploy

1. Go to [vercel.com](https://vercel.com) and click **Sign up**
2. Choose **Continue with GitHub** — this links Vercel to your GitHub
3. Click **Add New Project**
4. Find `modern-mass` in the list and click **Import**
5. Before clicking Deploy, click **Environment Variables** and add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` → paste your Project ID from Step 1
   - `NEXT_PUBLIC_SANITY_DATASET` → type `production`
6. Click **Deploy**

Vercel will build and deploy your site. In about 60 seconds you'll get a live URL like `modern-mass.vercel.app`. 🎉

---

## Step 5 — Enter your first prayer into Sanity

1. Go to [sanity.io/manage](https://sanity.io/manage) → your project → **Content**
2. Click **Create new document** → **Prayer**
3. Fill in the fields:
   - **Date:** Today's date (e.g. `2026-04-05`)
   - **Liturgical Context:** e.g. `Easter Sunday — The Resurrection of the Lord`
   - **Season:** Easter
   - **Scripture Reference:** e.g. `John 20:8`
   - **Scripture Text:** paste the verse
   - **Reflection:** paste from the April prayers document
   - **Prayer:** paste from the April prayers document
   - **Notification Teaser:** the one-line teaser
   - **Status:** set to `Published` ✅
4. Click **Publish**

Within an hour (or instantly on first load), your prayer will appear on the live site.

---

## Step 6 — Connect your domain (modernmass.org)

1. In Vercel, open your project and go to **Settings → Domains**
2. Type `modernmass.org` and click **Add**
3. Vercel will show you two DNS records to add — copy them
4. Log in to wherever you registered modernmass.org (GoDaddy, Namecheap, etc.)
5. Go to your domain's **DNS settings** and add the two records Vercel gave you
6. Wait 5–30 minutes for DNS to update

Vercel automatically handles **SSL (HTTPS)** — no extra steps needed. Your site will be fully secure.

---

## Step 7 — Set up email capture (Beehiiv)

The email form on the site is a placeholder. To make it actually collect emails:

1. Go to [beehiiv.com](https://beehiiv.com) and create a free account
2. Create a new publication called **Modern Mass**
3. Go to **Grow → Subscribe Forms** and copy your embed code
4. In your GitHub repo, open `app/page.js`
5. Find the comment that says `{/* EMAIL CAPTURE — Replace the form below */}`
6. Replace the `<form>` block with your Beehiiv embed code
7. Commit the change — Vercel will automatically redeploy

---

## Daily Prayer Updates

You don't need to do anything technical for daily updates. The site automatically refreshes content from Sanity every hour. To publish a new prayer each day:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Open the prayer for that date and change **Status** from `Approved` to `Published`
3. That's it — the site will pick it up within the hour

**Recommended workflow:** Enter all your reviewed prayers in advance with dates assigned. Change each one to `Published` the evening before, or on the day.

---

## You're live! 🎉

Share `modernmass.org` and start collecting your waitlist.
