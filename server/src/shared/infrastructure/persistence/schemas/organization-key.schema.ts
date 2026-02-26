import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const organizationKeys = pgTable('organization_keys', {
  id: text('id').primaryKey(),
  wrappedKey: text('wrapped_key').notNull(),
  keyId: text('key_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
