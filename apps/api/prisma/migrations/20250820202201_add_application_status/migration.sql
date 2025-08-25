/*
  Warnings:

  - The `status` column on the `applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('SUBMITTED', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "status",
ADD COLUMN     "status" "application_status" NOT NULL DEFAULT 'SUBMITTED';

-- DropEnum
DROP TYPE "ApplicationStatus";
