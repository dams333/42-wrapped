-- CreateTable
CREATE TABLE "AuthIdentifier" (
    "identifier" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthIdentifier_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentifier_identifier_key" ON "AuthIdentifier"("identifier");

-- AddForeignKey
ALTER TABLE "AuthIdentifier" ADD CONSTRAINT "AuthIdentifier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
