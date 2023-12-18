-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "userDatasId" INTEGER NOT NULL,
    "host" TEXT NOT NULL,
    "beginAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_userDatasId_fkey" FOREIGN KEY ("userDatasId") REFERENCES "UserDatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
