-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "job_seeker_id" TEXT NOT NULL,
    "vacancy_id" TEXT NOT NULL,
    "cover_letter" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_job_seeker_id_vacancy_id_key" ON "applications"("job_seeker_id", "vacancy_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
