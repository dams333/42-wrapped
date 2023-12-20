-- CreateTable
CREATE TABLE "ProjectUser" (
    "id" SERIAL NOT NULL,
    "userDatasId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "finalMark" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUserTeam" (
    "id" SERIAL NOT NULL,
    "projectUserId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL,
    "isValidated" BOOLEAN NOT NULL,
    "isClosed" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "finalMark" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lockAt" TIMESTAMP(3) NOT NULL,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "users" TEXT[],

    CONSTRAINT "ProjectUserTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cursus" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_userDatasId_fkey" FOREIGN KEY ("userDatasId") REFERENCES "UserDatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserTeam" ADD CONSTRAINT "ProjectUserTeam_projectUserId_fkey" FOREIGN KEY ("projectUserId") REFERENCES "ProjectUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
