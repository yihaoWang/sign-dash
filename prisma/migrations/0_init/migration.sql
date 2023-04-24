-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "google_id" UUID,
    "facebook_id" UUID,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "email_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "register_from" VARCHAR(255) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emailverificationcodes" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emailverificationcodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_google_id_key" ON "accounts"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_facebook_id_key" ON "accounts"("facebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "emailverificationcodes_code_key" ON "emailverificationcodes"("code");

-- CreateIndex
CREATE INDEX "email_verification_codes_code_idx" ON "emailverificationcodes"("code");

