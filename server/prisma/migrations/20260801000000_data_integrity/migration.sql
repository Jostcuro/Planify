-- AlterTable
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Task_userId_status_idx" ON "Task"("userId", "status");

-- CreateIndex
CREATE INDEX "Task_userId_dueDate_idx" ON "Task"("userId", "dueDate");

-- CheckConstraint (añadido manualmente: Prisma no soporta CHECK nativo)
-- Garantiza coherencia entre status y completedAt:
--   COMPLETED  -> completedAt NO NULL
--   otro status -> completedAt NULL
ALTER TABLE "Task" ADD CONSTRAINT "Task_status_completedAt_check" CHECK (
  ("status" = 'COMPLETED' AND "completedAt" IS NOT NULL)
  OR ("status" <> 'COMPLETED' AND "completedAt" IS NULL)
);
