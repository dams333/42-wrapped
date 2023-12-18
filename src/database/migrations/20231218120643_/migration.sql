-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "user_id_seq";

-- CreateTable
CREATE TABLE "UserDatas" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "UserDatas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchivementUser" (
    "id" SERIAL NOT NULL,
    "userDatasId" INTEGER NOT NULL,
    "achievmentId" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchivementUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievment" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "kind" TEXT NOT NULL,

    CONSTRAINT "Achievment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDatas_userId_key" ON "UserDatas"("userId");

-- AddForeignKey
ALTER TABLE "UserDatas" ADD CONSTRAINT "UserDatas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchivementUser" ADD CONSTRAINT "AchivementUser_userDatasId_fkey" FOREIGN KEY ("userDatasId") REFERENCES "UserDatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchivementUser" ADD CONSTRAINT "AchivementUser_achievmentId_fkey" FOREIGN KEY ("achievmentId") REFERENCES "Achievment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
