-- CreateTable
CREATE TABLE "MacroLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MacroLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MacroLog_userId_date_idx" ON "MacroLog"("userId", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "MacroLog_userId_date_key" ON "MacroLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "MacroLog" ADD CONSTRAINT "MacroLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
