/*
  Warnings:

  - You are about to drop the column `snippetBinId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_snippetBinId_fkey";

-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "codePreview" VARCHAR;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "snippetBinId";

-- CreateTable
CREATE TABLE "_SnippetBinToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SnippetBinToTag_AB_unique" ON "_SnippetBinToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SnippetBinToTag_B_index" ON "_SnippetBinToTag"("B");

-- AddForeignKey
ALTER TABLE "_SnippetBinToTag" ADD CONSTRAINT "_SnippetBinToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "SnippetBin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SnippetBinToTag" ADD CONSTRAINT "_SnippetBinToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
