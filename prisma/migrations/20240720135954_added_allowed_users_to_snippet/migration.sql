-- CreateTable
CREATE TABLE "_AllowedUserSnippets" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AllowedUserSnippets_AB_unique" ON "_AllowedUserSnippets"("A", "B");

-- CreateIndex
CREATE INDEX "_AllowedUserSnippets_B_index" ON "_AllowedUserSnippets"("B");

-- AddForeignKey
ALTER TABLE "_AllowedUserSnippets" ADD CONSTRAINT "_AllowedUserSnippets_A_fkey" FOREIGN KEY ("A") REFERENCES "Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllowedUserSnippets" ADD CONSTRAINT "_AllowedUserSnippets_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
