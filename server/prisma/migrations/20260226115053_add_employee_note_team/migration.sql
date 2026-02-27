/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published";

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "careerStartDate" TIMESTAMP(3),
    "salary" DOUBLE PRECISION,
    "role" TEXT,
    "departmentId" INTEGER,
    "reportingManagerId" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "isAdminOnly" BOOLEAN NOT NULL DEFAULT false,
    "employeeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_reportingManagerId_fkey" FOREIGN KEY ("reportingManagerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
