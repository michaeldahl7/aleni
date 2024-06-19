CREATE TABLE IF NOT EXISTS "aleni_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"workout_id" text NOT NULL,
	"name" varchar(256) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aleni_set" (
	"id" text PRIMARY KEY NOT NULL,
	"activity_id" text NOT NULL,
	"reps" integer NOT NULL,
	"duration" integer,
	"weight" numeric(10, 2),
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aleni_user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"username" varchar(18),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "aleni_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aleni_workout" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aleni_activity" ADD CONSTRAINT "aleni_activity_workout_id_aleni_workout_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."aleni_workout"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aleni_set" ADD CONSTRAINT "aleni_set_activity_id_aleni_activity_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."aleni_activity"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aleni_workout" ADD CONSTRAINT "aleni_workout_user_id_aleni_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aleni_user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workout_id_idx" ON "aleni_activity" USING btree ("workout_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "aleni_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "aleni_workout" USING btree ("user_id");