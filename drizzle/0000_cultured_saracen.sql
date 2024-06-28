CREATE TABLE IF NOT EXISTS "aleni_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"username" varchar(18),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "aleni_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aleni_workouts" (
	"id" text PRIMARY KEY NOT NULL,
	"activities" json,
	"user_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aleni_workouts" ADD CONSTRAINT "aleni_workouts_user_id_aleni_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aleni_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "aleni_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "aleni_workouts" USING btree ("user_id");