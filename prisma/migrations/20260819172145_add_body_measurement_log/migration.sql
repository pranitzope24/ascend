-- CreateTable
CREATE TABLE "BodyMeasurementLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "part" TEXT NOT NULL,
    "side" TEXT,
    "value" DECIMAL(5,2) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'in',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyMeasurementLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BodyMeasurementLog_userId_date_idx" ON "BodyMeasurementLog"("userId", "date" DESC);

-- AddForeignKey
ALTER TABLE "BodyMeasurementLog" ADD CONSTRAINT "BodyMeasurementLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
