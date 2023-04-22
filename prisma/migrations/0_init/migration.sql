-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "google_id" UUID,
    "facebook_id" UUID,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "email_verified" BOOLEAN DEFAULT false,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_google_id_key" ON "accounts"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_facebook_id_key" ON "accounts"("facebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

