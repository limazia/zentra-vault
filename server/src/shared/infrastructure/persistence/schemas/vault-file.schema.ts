import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { folders } from './folder.schema'
import { users } from './user.schema'

export const vaultFiles = pgTable('vault_files', {
  id: text('id').primaryKey(),
  folderId: text('folder_id')
    .notNull()
    .references(() => folders.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  encryptedContent: text('encrypted_content').notNull(),
  contentIv: text('content_iv').notNull(),
  wrappedDek: text('wrapped_dek').notNull(),
  dekIv: text('dek_iv').notNull(),
  size: integer('size').notNull(),
  createdById: text('created_by_id')
    .notNull()
    .references(() => users.id),
  lastEditedById: text('last_edited_by_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
