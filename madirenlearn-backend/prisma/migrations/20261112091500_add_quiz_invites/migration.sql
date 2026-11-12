CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "QuizInvite" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "host_id" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "invitee_id" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "room_code" VARCHAR(8) NOT NULL,
  "subject" VARCHAR(100) NOT NULL,
  "status" VARCHAR(16) NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "responded_at" TIMESTAMPTZ(6),
  CONSTRAINT "QuizInvite_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QuizInvite_host_not_invitee_check" CHECK ("host_id" <> "invitee_id"),
  CONSTRAINT "QuizInvite_status_check" CHECK ("status" IN ('PENDING', 'ACCEPTED', 'DECLINED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "QuizInvite_host_id_invitee_id_room_code_key"
  ON "QuizInvite" ("host_id", "invitee_id", "room_code");

CREATE INDEX IF NOT EXISTS "QuizInvite_invitee_id_status_created_at_idx"
  ON "QuizInvite" ("invitee_id", "status", "created_at");
