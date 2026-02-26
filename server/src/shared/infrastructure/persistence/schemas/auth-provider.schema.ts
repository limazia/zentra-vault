import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const authProviders = pgTable(
  'auth_providers',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    providerUsername: text('provider_username'),
    providerAvatarUrl: text('provider_avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('auth_providers_provider_user_idx').on(
      table.provider,
      table.providerUserId
    ),
  ]
)
