/*
  Warnings:

  - The `status` column on the `Workspace` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Workspace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('PERSONAL', 'WORK');

-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "type",
ADD COLUMN     "type" "WorkspaceType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "WorkspaceStatus" NOT NULL DEFAULT 'ACTIVE';
