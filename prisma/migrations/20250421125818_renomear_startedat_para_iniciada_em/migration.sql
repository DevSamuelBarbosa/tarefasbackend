/*
  Warnings:

  - You are about to drop the column `startedAt` on the `Tarefa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tarefa" DROP COLUMN "startedAt",
ADD COLUMN     "iniciada_em" TIMESTAMPTZ(6);
