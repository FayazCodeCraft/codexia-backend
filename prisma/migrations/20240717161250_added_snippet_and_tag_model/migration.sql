-- CreateEnum
CREATE TYPE "Language" AS ENUM ('JAVASCRIPT', 'PYTHON', 'JAVA', 'CSHARP', 'RUBY', 'GO', 'PHP', 'SWIFT', 'TYPESCRIPT', 'KOTLIN', 'SCALA', 'RUST', 'PERL', 'HTML', 'CSS', 'SQL', 'BASH', 'R', 'OBJECTIVEC', 'C', 'CPP', 'LUA');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Snippet" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR NOT NULL,
    "description" VARCHAR,
    "code" VARCHAR NOT NULL,
    "language" "Language" NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" UUID NOT NULL,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SnippetToTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SnippetToTag_AB_unique" ON "_SnippetToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SnippetToTag_B_index" ON "_SnippetToTag"("B");

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SnippetToTag" ADD CONSTRAINT "_SnippetToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SnippetToTag" ADD CONSTRAINT "_SnippetToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
