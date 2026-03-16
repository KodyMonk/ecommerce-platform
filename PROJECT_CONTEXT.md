# Project Context

## Project Name
Ecommerce Platform

## Goal
Build a modern ecommerce system with:
- Customer web app
- Admin panel
- Mobile app for iOS and Android
- Payment gateway integration
- Shared backend/data model

## Apps
- `apps/web` → customer storefront
- `apps/admin` → admin dashboard
- `apps/mobile` → React Native / Expo mobile app

## Packages
- `packages/ui` → shared components, design tokens, utilities
- `packages/db` → Prisma schema, database client, migrations
- `packages/api` → shared API logic / client helpers
- `packages/types` → shared TypeScript types
- `packages/payments` → payment service abstraction

## Planned Stack
- Monorepo: Turborepo
- Web: Next.js
- Admin: Next.js
- Mobile: Expo + React Native
- Database: PostgreSQL
- ORM: Prisma
- Auth: To be decided (Clerk or Auth.js)
- Data fetching: TanStack Query
- Payments: Payment gateway via secure backend integration
- Storage: To be decided (S3 / Cloudinary / UploadThing)

## Core Features
- User authentication
- Product catalog
- Product categories
- Product variants
- Cart
- Checkout
- Payment processing
- Orders
- Customer account
- Admin product management
- Admin order management
- Coupons / discounts
- Media upload
- Inventory management

## Rules / Conventions
- Never store payment secrets in frontend apps
- Payment processing must go through backend/server routes
- Shared types should live in `packages/types`
- Database logic should live in `packages/db`
- Payment gateway logic should live in `packages/payments`
- Reusable UI pieces should go in `packages/ui`
- Keep business logic out of UI components where possible
- Prefer TypeScript everywhere

## Development Approach
Phase 1:
- monorepo setup
- web app
- admin app
- database schema
- auth
- products
- cart
- checkout
- payments
- orders

Phase 2:
- mobile app
- push notifications
- coupons
- wishlists
- reviews
- analytics
- delivery tracking
- localization

## Notes
This file should be updated whenever architecture, stack, or priorities change.
Paste this file into new ChatGPT chats when continuing development.