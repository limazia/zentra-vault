CREATE TABLE "vault_files" (
	"id" text PRIMARY KEY NOT NULL,
	"folder_id" text NOT NULL,
	"name" text NOT NULL,
	"encrypted_content" text NOT NULL,
	"content_iv" text NOT NULL,
	"wrapped_dek" text NOT NULL,
	"dek_iv" text NOT NULL,
	"size" integer NOT NULL,
	"created_by_id" text NOT NULL,
	"last_edited_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vault_file_history" (
	"id" text PRIMARY KEY NOT NULL,
	"file_id" text NOT NULL,
	"edited_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vault_files" ADD CONSTRAINT "vault_files_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_files" ADD CONSTRAINT "vault_files_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_files" ADD CONSTRAINT "vault_files_last_edited_by_id_users_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_file_history" ADD CONSTRAINT "vault_file_history_file_id_vault_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."vault_files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vault_file_history" ADD CONSTRAINT "vault_file_history_edited_by_id_users_id_fk" FOREIGN KEY ("edited_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;