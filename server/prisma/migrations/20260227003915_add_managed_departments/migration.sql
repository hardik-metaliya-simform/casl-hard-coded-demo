/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "ManagedDepartment" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "ManagedDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagedDepartment_employeeId_departmentId_key" ON "ManagedDepartment"("employeeId", "departmentId");

-- AddForeignKey
ALTER TABLE "ManagedDepartment" ADD CONSTRAINT "ManagedDepartment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagedDepartment" ADD CONSTRAINT "ManagedDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
