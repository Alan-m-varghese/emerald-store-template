# Environment Setup Guide: Database & APIs Integration

This guide walks you through registering, generating, and updating your real environment credentials. You can copy the template variables from [.env.example](file:///Users/alanmvarghese/alan/freelance/ecommerce/.env.example) into your local [.env](file:///Users/alanmvarghese/alan/freelance/ecommerce/.env) file to configure the production settings.

---

## 1. Database Configuration (Prisma ORM & Neon PostgreSQL)

To sync your database schemas (Users, Products, Orders, and Coupons) with a live cloud service, we use **Prisma ORM** connecting to **PostgreSQL**.

### Setup Steps:
1. Go to [Neon.tech](https://neon.tech/) and sign up for a free serverless PostgreSQL instance.
2. Create a new project (e.g. `emerald-store-db`).
3. Under the **Connection Details** section on your Neon dashboard, copy the PostgreSQL connection string. Ensure the string ends with `?sslmode=require`.
4. Open your local [.env](file:///Users/alanmvarghese/alan/freelance/ecommerce/.env) file, locate `DATABASE_URL`, and replace the placeholder string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-flower-12345.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   ```
5. Once updated, run the following command in your terminal to initialize the database tables:
   ```bash
   npx prisma db push
   ```

---

## 2. Authentication Config (NextAuth.js)

NextAuth requires a secret key to sign session tokens and cryptographically protect user passwords and admin states.

### Setup Steps:
1. Generate a secure random base64 string. Run this command in your Mac terminal:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the resulting string.
3. Open your local [.env](file:///Users/alanmvarghese/alan/freelance/ecommerce/.env) file and define these values:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="PASTE_GENERATED_STRING_HERE"
   ```
   > [!NOTE]
   > For production deployments (e.g. Vercel), replace `http://localhost:3000` with your actual store domain name (e.g. `https://emeraldstore.in`).

---

## 3. Payment Gateway Config (Razorpay UPI & Card Checkout)

We integrate **Razorpay** checkout script for mobile payments, card checkouts, and UPI.

### Setup Steps:
1. Sign up for a [Razorpay Dashboard](https://dashboard.razorpay.com/) account.
2. Go to **Settings** (bottom-left) > **API Keys** tab > click **Generate Key** (use Test Mode first for sandbox validations).
3. Copy both the **Key ID** and the **Key Secret**.
4. Update your local [.env](file:///Users/alanmvarghese/alan/freelance/ecommerce/.env) file:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_paste_key_id_here"
   RAZORPAY_KEY_SECRET="paste_key_secret_here"
   ```

---

## 4. Media Upload Config (Cloudinary Image Hosting)

Artisanal product cover images uploaded via the admin console are saved directly to **Cloudinary CDN** and served instantly.

### Setup Steps:
1. Sign up for a free [Cloudinary](https://cloudinary.com/) account.
2. On your Cloudinary Dashboard, copy:
   - **Cloud Name** (e.g., `dmw7xyz`)
   - **API Base Environment Variable URL** (starts with `cloudinary://...`)
3. **Configure Unsigned Preset** (Mandatory for client-side uploads):
   - Navigate to **Settings** (gear icon) > **Upload** tab.
   - Scroll down to the **Upload presets** section and click **Add upload preset**.
   - Set the **Signing Mode** to **Unsigned**.
   - Copy the generated **Upload preset name** (e.g. `ml_default` or a random string like `g3j7n2q8`).
4. Update your local [.env](file:///Users/alanmvarghese/alan/freelance/ecommerce/.env) file:
   ```env
   CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
   CLOUDINARY_CLOUD_NAME="your_copied_cloud_name"
   CLOUDINARY_UPLOAD_PRESET="your_unsigned_preset_name"
   ```

---

## 5. Live Production Deployment Checklist

When preparing to publish the store onto Vercel or Netlify:
- Ensure all environment variables listed above are copied into the hosting provider's **Environment Variables** settings panel.
- Run `npx prisma db push` before releasing the build.
- The lazy database proxy we configured guarantees the Next.js compile build stage succeeds perfectly even before the database is fully linked.
