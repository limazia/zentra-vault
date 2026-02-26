CREATE TABLE "organization_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"wrapped_key" text NOT NULL,
	"key_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vault_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"encrypted_org_key" text NOT NULL,
	"salt" text NOT NULL,
	"iv" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_vault_keys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_vault_keys" ADD CONSTRAINT "user_vault_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;