CREATE TABLE "promo_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "carts" ADD COLUMN "promo_code_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "subtotal" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "promo_code" text;--> statement-breakpoint
UPDATE "orders" SET "subtotal" = "total";--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_promo_code_id_promo_codes_id_fk" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE set null ON UPDATE no action;