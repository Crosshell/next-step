-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED';
