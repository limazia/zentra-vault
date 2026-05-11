import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  folderId: text('folder_id'),
  folderName: text('folder_name').notNull().default('—'),
  fileId: text('file_id'),
  fileName: text('file_name').notNull().default('—'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
