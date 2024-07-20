/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Snippet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Snippet" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "snippetBinId" UUID;

-- CreateTable
CREATE TABLE "SnippetBin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "snippetId" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR,
    "code" VARCHAR NOT NULL,
    "language" "Language" NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP NOT NULL,
    "deletedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,

    CONSTRAINT "SnippetBin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SnippetBin" ADD CONSTRAINT "SnippetBin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_snippetBinId_fkey" FOREIGN KEY ("snippetBinId") REFERENCES "SnippetBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
