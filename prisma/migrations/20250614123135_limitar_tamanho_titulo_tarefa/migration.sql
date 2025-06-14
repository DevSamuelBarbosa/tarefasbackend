/*
  Warnings:

  - You are about to alter the column `titulo` on the `Tarefa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `descricao` on the `Tarefa` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.

*/
-- AlterTable
ALTER TABLE "Tarefa" ALTER COLUMN "titulo" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(2000);
