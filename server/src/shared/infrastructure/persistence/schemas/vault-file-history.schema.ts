import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './user.schema'
import { vaultFiles } from './vault-file.schema'

export const vaultFileHistory = pgTable('vault_file_history', {
  id: text('id').primaryKey(),
  fileId: text('file_id')
    .notNull()
    .references(() => vaultFiles.id, { onDelete: 'cascade' }),
  editedById: text('edited_by_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
