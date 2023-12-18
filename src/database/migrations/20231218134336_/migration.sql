-- CreateTable
CREATE TABLE "EventUser" (
    "id" SERIAL NOT NULL,
    "userDatasId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "beginAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "kind" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventUser" ADD CONSTRAINT "EventUser_userDatasId_fkey" FOREIGN KEY ("userDatasId") REFERENCES "UserDatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventUser" ADD CONSTRAINT "EventUser_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
