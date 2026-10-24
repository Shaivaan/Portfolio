// Cache tag for everything the public portfolio reads from the DB.
// Public pages tag their cached reads with it; admin actions call updateTag() after a change.
export const PORTFOLIO_TAG = "portfolio";
