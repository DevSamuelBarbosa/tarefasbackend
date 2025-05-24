/*
  Warnings:

  - A unique constraint covering the columns `[token_jwt]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token_jwt` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "token_jwt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_token_jwt_key" ON "Usuario"("token_jwt");
