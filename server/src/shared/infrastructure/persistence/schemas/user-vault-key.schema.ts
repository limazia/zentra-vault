import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const userVaultKeys = pgTable('user_vault_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id)
    .unique(),
  encryptedOrgKey: text('encrypted_org_key').notNull(),
  salt: text('salt').notNull(),
  iv: text('iv').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
