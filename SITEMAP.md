# balkan.works – Complete Application Sitemap

## Architecture Overview
The application is organized into four main domains:
- **Landing Site** — Public marketing pages (/)
- **Customer App** (/app) — User-facing service discovery and transactions
- **Business Dashboard** (/business) — Vendor/service provider management
- **Admin Panel** (/admin) — Platform administration and moderation

---

## 1. PUBLIC LANDING SITE (/)

### Marketing Pages
```
/                              Home page with features, testimonials, CTA
/usluge                        Services directory
/poslovi                       Jobs marketplace
/za-kompanije                  Business registration CTA
/o-nama                        About company
/kontakt                       Contact form
/preuzmi                       App download page
```

### Static Content
```
/terms                         Terms of Service (future)
/privacy                       Privacy Policy (future)
/security                      Security & Trust info (future)
```

---

## 2. CUSTOMER APP (/app)

### Main Navigation (5 Tabs)
```
/app                           Home feed
/app/discover                  Explore categories & businesses
/app/ai                        AI Assistant chat
/app/saved                     Bookmarks & favorites
/app/profile                   User account & settings
```

### Marketplace Features
```
/app/category/[slug]          Category listing (auto, home-services, food, beauty, health, education, real-estate, events, sports, tourism, pets)
/app/business/[id]            Business detail page with reviews, gallery, booking
/app/search?q=                Search results

/app/bookings                  My bookings & appointments
/app/bookings/[id]            Booking detail & timeline (future)
/app/bookings/new             Create new booking (future)

/app/requests                  Service requests I posted
/app/requests/new             Post new service request
/app/requests/[id]            Request detail with quotes (future)

/app/messages                  Inbox & conversations
/app/messages/[conversationId] Individual conversation (future)

/app/wallet                    Payment methods & balance
/app/wallet/transactions       Transaction history (future)
/app/wallet/add-payment        Add payment method (future)
/app/wallet/withdraw           Withdrawal requests (future)
```

### User Account
```
/app/profile/edit             Edit profile
/app/profile/preferences      Notification & privacy settings
/app/profile/history          Booking history
/app/profile/reviews          My reviews
/app/profile/help             Help & support
```

---

## 3. BUSINESS DASHBOARD (/business)

### Core Dashboard
```
/business                      Dashboard overview with KPIs
/business/analytics           Detailed analytics & charts
/business/leads               Lead management & CRM
/business/leads/[id]          Lead detail (future)
/business/ai-coach            AI business coach & recommendations
```

### Business Management
```
/business/profile             Business profile editing
/business/profile/photos      Photo gallery management
/business/profile/services    Service/product catalog (future)
/business/profile/pricing     Pricing & packages (future)

/business/bookings            Booking management
/business/bookings/calendar   Calendar view (future)

/business/messages            Business inbox
/business/invoices            Invoice management (future)

/business/reviews             Customer reviews & ratings
/business/team                Team management & permissions (future)
/business/settings            Business settings
/business/settings/billing    Billing & subscription (future)
/business/settings/api        API keys & integrations (future)
```

---

## 4. ADMIN PANEL (/admin)

### System Overview
```
/admin                         Admin dashboard with system metrics
/admin/analytics              Platform-wide analytics
```

### Content Moderation
```
/admin/moderation             Moderation center
/admin/moderation/reports     Report management by status (Pending, In Review, Resolved)
/admin/moderation/[reportId]  Report detail (future)

/admin/verification           Business verification workflow
/admin/verification/pending   Pending verification queue
/admin/verification/[businessId] Verification detail (future)
```

### User Management
```
/admin/users                  User management
/admin/users/[userId]         User detail & actions (future)

/admin/businesses             Business directory
/admin/businesses/[businessId] Business detail & suspension (future)
```

### Platform Management
```
/admin/categories             Category management (future)
/admin/categories/[id]        Category editor (future)

/admin/payments               Payment processing overview (future)
/admin/payments/disputes      Dispute resolution center (future)

/admin/settings               Admin settings
/admin/settings/email         Email templates (future)
/admin/settings/features      Feature flags (future)
/admin/settings/api           API configuration (future)
```

---

## 5. FUTURE EXTENSIONS

### Authentication Flows
```
/auth/login                   Login page
/auth/register                Registration
/auth/forgot-password         Password reset
/auth/verify-email            Email verification
```

### Specialized Features
```
/subscriptions                Premium plans
/subscriptions/compare        Plan comparison
/business/pro-features        Premium dashboard features
```

### Content Pages
```
/blog                         Blog listing
/blog/[slug]                  Blog post
/faq                          FAQ page
/community                    Community forum (future)
```

---

## 6. DYNAMIC CATEGORY PAGES

Each category under `/app/category/[slug]` with specialized layouts:

**Service Categories:**
- `/app/category/home-services` — Plumbers, electricians, repairs
- `/app/category/beauty` — Salons, barbers, spas
- `/app/category/health` — Clinics, fitness, therapy
- `/app/category/food` — Restaurants, catering, delivery
- `/app/category/auto` — Mechanics, car wash, rentals
- `/app/category/education` — Tutoring, courses, training
- `/app/category/real-estate` — Rentals, sales, agents
- `/app/category/events` — Catering, venues, planning
- `/app/category/sports` — Fitness, lessons, equipment
- `/app/category/tourism` — Hotels, tours, attractions
- `/app/category/pets` — Vets, grooming, training

---

## 7. ROUTE PATTERNS & CONVENTIONS

### Path Conventions
- **Public pages**: Root domain and simple paths (`/`, `/about`)
- **User flows**: Authenticated under `/app/*`
- **Business flows**: Authenticated under `/business/*`
- **Admin flows**: Restricted to `/admin/*`
- **Dynamic routes**: Use square brackets `[param]` for IDs/slugs

### URL Parameters
- `[id]` — Numeric or UUID identifier
- `[slug]` — URL-friendly text identifier
- `?q=` — Search query parameter
- `?status=` — Filter parameter
- `?page=` — Pagination parameter

### Locale Routing (Planned)
All routes support locale prefix (future):
```
/sr/app/home
/hr/app/home
/bs/app/home
/me/app/home
/mk/app/home
/sl/app/home
/bg/app/home
```

---

## 8. API ENDPOINTS (Backend Structure)

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register

GET    /api/businesses
GET    /api/businesses/[id]
POST   /api/businesses (create for authenticated users)
PUT    /api/businesses/[id]
DELETE /api/businesses/[id]

GET    /api/categories
GET    /api/categories/[slug]

GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/[id]
PUT    /api/bookings/[id]

GET    /api/requests
POST   /api/requests
GET    /api/requests/[id]
PUT    /api/requests/[id]

GET    /api/messages
GET    /api/messages/[conversationId]
POST   /api/messages

GET    /api/wallet
GET    /api/wallet/transactions
POST   /api/wallet/add-payment

GET    /api/reviews
POST   /api/reviews
GET    /api/reviews/[id]

GET    /api/admin/analytics
GET    /api/admin/users
PUT    /api/admin/users/[id]
GET    /api/admin/businesses
PUT    /api/admin/businesses/[id]/verify
DELETE /api/admin/businesses/[id]

GET    /api/admin/reports
PUT    /api/admin/reports/[id]/status
```

---

## 9. DEPLOYMENT STRUCTURE

### Vercel Project Setup
```
production     → https://balkan.works (main domain)
staging        → https://staging.balkan.works
preview        → Dynamic PR previews
```

### Database & Services
```
PostgreSQL     → User data, bookings, messages
Redis          → Cache, sessions, real-time updates
File Storage   → Vercel Blob (photos, documents)
Search         → Elasticsearch or Meilisearch (future)
Email          → SendGrid or Resend
SMS            → Twilio (future)
Payments       → Stripe
```

---

## 10. PERFORMANCE TARGETS

- **Lighthouse Score**: 90+
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Time to Interactive**: <3s on 4G
- **Bundle Size**: <200KB JS (gzipped)
- **API Response**: <200ms p95

---

## 11. SECURITY ARCHITECTURE

### Authentication
- JWT tokens for session management
- Role-based access control (RBAC)
- OAuth 2.0 for future social logins

### Data Protection
- Row-Level Security (RLS) in database
- End-to-end encryption for messages
- PCI DSS compliance for payments
- GDPR compliance for EU users

### Abuse Prevention
- Rate limiting on API endpoints
- Captcha on forms
- Automated content moderation
- Manual review queue for reports

---

This sitemap represents a **production-grade, scalable architecture** ready for deployment across the Balkans with multi-language support and comprehensive user, vendor, and administrative workflows.
