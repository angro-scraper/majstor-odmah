# Digital Flyers

Digital Flyers is the shared promotion module for verified businesses. A flyer is created as a draft, published by its owner, and becomes publicly visible only while its optional availability window is valid.

## Feature flag

`DIGITAL_FLYERS_ENABLED=false` by default. The API returns `DIGITAL_FLYERS_DISABLED` until the flag is enabled for an environment.

## API

- `GET /api/v1/flyers` — public, published flyers only
- `GET /api/v1/flyers/:id` — public flyer detail
- `POST /api/v1/flyers` — authenticated business owner creates a draft
- `PATCH /api/v1/flyers/:id` — authenticated owner updates the flyer
- `POST /api/v1/flyers/:id/publish` — authenticated owner publishes it
- `POST /api/v1/flyers/:id/view` — authenticated view event

Business analytics include `publishedFlyers` and `flyerViews`. Every creation or update is written to the audit log.
