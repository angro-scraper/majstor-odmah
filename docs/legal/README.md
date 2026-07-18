# Legal document workflow

This folder is the controlled source area for Balkan.works legal drafts. Documents must be reviewed by qualified counsel for each launch country before they are published or presented as binding terms.

The application stores legal documents as versioned database records. The release workflow is:

1. Draft the document here and have it reviewed by legal counsel and the data-protection owner.
2. Create it through `POST /api/v1/admin/compliance/documents`; it is stored as `DRAFT`.
3. Approve a publication decision and publish it with `POST /api/v1/admin/compliance/documents/:id/publish`.
4. Capture consent against the precise published document/version. Publishing a newer version archives the previous document of the same type and locale.

No wallet, payment, regulated financial product, cross-border transfer, or marketplace terms are enabled merely by this technical foundation. Those features require country-specific review, provider agreements and operational controls before release.
