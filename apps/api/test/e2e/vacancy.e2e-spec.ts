import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Server } from 'node:http';
import { PrismaService } from '../../src/prisma/services/prisma.service';
import { RedisService } from '../../src/redis/services/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { createAuthenticatedUser } from './utils/auth.helper';
import { createCompany } from './utils/company.helper';
import { createRecruiter } from './utils/recruiter.helper';
import { createVacancy } from './utils/vacancy.helper';
import { randomUUID } from 'crypto';
import { CreateVacancyDto } from '../../src/vacancy/dto/create-vacancy.dto';
import {
  EmploymentType,
  SeniorityLevel,
  WorkFormat,
  LanguageLevel,
} from '@prisma/client';
import { VacancyWithRelations } from '../../src/vacancy/types/vacancy-with-relations.type';
import { PaginatedResponse } from '@common/responses';
import { FindManyVacanciesDto } from '../../src/vacancy/dto/find-many-vacancies.dto';
import { SetSkillsDto } from '../../src/vacancy/dto/set-skills.dto';
import { SetLanguagesDto } from '../../src/vacancy/dto/set-languages.dto';
import { UpdateVacancyDto } from '../../src/vacancy/dto/update-vacancy.dto';
import {
  shouldFailForRecruiterWithoutCompany,
  shouldFailForVacancyOfAnotherCompany,
  shouldFailWithoutAuth,
} from './utils/guards.helper';

describe('VacancyController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;
  let redis: RedisService;

  const baseUrl = '/api/vacancies';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get(PrismaService);
    redis = app.get(RedisService);

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api');

    await app.init();

    server = app.getHttpServer() as Server;
  });

  beforeEach(async () => {
    await prisma.vacancy.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.recruiter.deleteMany({});
    await prisma.user.deleteMany({});
    await redis.flushall();
  });

  afterAll(async () => {
    await prisma.vacancy.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.recruiter.deleteMany({});
    await prisma.user.deleteMany({});
    await redis.flushall();
    await app.close();
    server.close();
  });

  describe('POST /vacancies', () => {
    const body: CreateVacancyDto = {
      title: 'Strong Senior Backend Developer',
      description:
        'We are searching for a senior. We are searching for a senior.',
      salaryMin: 1000,
      salaryMax: 3000,
      seniorityLevel: SeniorityLevel.SENIOR,
      workFormat: [WorkFormat.REMOTE],
      employmentType: [EmploymentType.FULL_TIME],
    };

    it('should create a vacancy', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(prisma, { companyId: company.id }, user.id);

      const res = await request(server)
        .post(baseUrl)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(201);

      const resBody = res.body as VacancyWithRelations;

      expect(resBody.id).toEqual(expect.any(String));
      expect(resBody.companyId).toBe(company.id);
      expect(resBody.title).toBe(body.title);

      const vacancy = await prisma.vacancy.findUnique({
        where: { id: resBody.id },
      });
      expect(vacancy).not.toBeNull();
    });

    shouldFailWithoutAuth(() => server, 'post', baseUrl);
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'post',
      baseUrl,
    );
  });

  describe('GET /vacancies/:id', () => {
    it('should return vacancy by id', async () => {
      const company = await createCompany(prisma);
      const vacancy = await createVacancy(prisma, company.id);

      const res = await request(server)
        .get(`${baseUrl}/${vacancy.id}`)
        .expect(200);

      const resBody = res.body as VacancyWithRelations;
      expect(resBody.id).toBe(vacancy.id);
      expect(resBody.companyId).toBe(company.id);
    });

    it('should return 404 if vacancy does not exist', async () => {
      const id = randomUUID();
      return request(server).get(`${baseUrl}/${id}`).expect(404);
    });
  });

  describe('POST /vacancies/search', () => {
    it('should return filtered vacancies', async () => {
      const company = await createCompany(prisma);

      const targetVacancy = await createVacancy(prisma, company.id, {
        seniorityLevel: SeniorityLevel.SENIOR,
        workFormat: [WorkFormat.REMOTE],
      });

      await createVacancy(prisma, company.id, {
        seniorityLevel: SeniorityLevel.MIDDLE,
        workFormat: [WorkFormat.REMOTE],
        employmentType: [EmploymentType.FULL_TIME],
      });

      const dto: FindManyVacanciesDto = {
        seniorityLevels: [SeniorityLevel.SENIOR],
        page: 1,
        take: 10,
      };

      const res = await request(server)
        .post(`${baseUrl}/search`)
        .send(dto)
        .expect(200);

      const { data, meta } =
        res.body as PaginatedResponse<VacancyWithRelations>;

      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(targetVacancy.id);
      expect(meta.total).toBe(1);
    });
  });

  describe('PATCH /vacancies/:id', () => {
    const body: UpdateVacancyDto = {
      title: 'Updated Vacancy Title',
    };

    it('should update vacancy', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      await createRecruiter(prisma, { companyId: company.id }, user.id);

      const vacancy = await createVacancy(prisma, company.id);

      const res = await request(server)
        .patch(`${baseUrl}/${vacancy.id}`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(200);

      const resBody = res.body as VacancyWithRelations;

      expect(resBody.id).toBe(vacancy.id);
      expect(resBody.title).toBe(body.title);
      expect(resBody.updatedAt).not.toBe(vacancy.updatedAt.toISOString());

      const updatedVacancy = await prisma.vacancy.findUnique({
        where: { id: vacancy.id },
      });
      expect(updatedVacancy).not.toBeNull();
      expect(updatedVacancy).toMatchObject({ title: body.title });
    });

    shouldFailWithoutAuth(() => server, 'patch', `${baseUrl}/${randomUUID()}`);
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'patch',
      `${baseUrl}/${randomUUID()}`,
    );
    shouldFailForVacancyOfAnotherCompany(
      () => server,
      () => prisma,
      () => redis,
      'patch',
      `${baseUrl}`,
    );
  });

  describe('DELETE /vacancies/:id', () => {
    it('should delete vacancy', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(prisma, { companyId: company.id }, user.id);

      const vacancy = await createVacancy(prisma, company.id);

      await request(server)
        .delete(`${baseUrl}/${vacancy.id}`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const deletedVacancy = await prisma.vacancy.findUnique({
        where: { id: vacancy.id },
      });
      expect(deletedVacancy).toBeNull();
    });

    shouldFailWithoutAuth(() => server, 'delete', `${baseUrl}/${randomUUID()}`);
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/${randomUUID()}`,
    );
    shouldFailForVacancyOfAnotherCompany(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}`,
    );
  });

  describe('PUT /vacancies/:id/skills', () => {
    it('should set required skills for vacancy', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(prisma, { companyId: company.id }, user.id);

      const vacancy = await createVacancy(prisma, company.id);

      const skill = await prisma.skill.create({
        data: { name: 'Java' },
      });

      const body: SetSkillsDto = {
        requiredSkillIds: [skill.id],
      };

      const res = await request(server)
        .put(`${baseUrl}/${vacancy.id}/skills`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(200);

      const resBody = res.body as VacancyWithRelations;
      expect(resBody.id).toBe(vacancy.id);
      expect(resBody.requiredSkills).toHaveLength(1);

      const expectedSkills = [{ skill: { id: skill.id, name: skill.name } }];
      expect(resBody.requiredSkills).toEqual(
        expect.arrayContaining(expectedSkills),
      );

      const updatedVacancy = await prisma.vacancy.findUnique({
        where: { id: vacancy.id },
        select: { requiredSkills: true },
      });
      expect(updatedVacancy).not.toBeNull();
      expect(updatedVacancy!.requiredSkills).toHaveLength(1);
    });

    it('should return 400 if skills not exist', async () => {
      const skillId = randomUUID();

      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(prisma, { companyId: company.id }, user.id);
      const vacancy = await createVacancy(prisma, company.id);

      return request(server)
        .put(`${baseUrl}/${vacancy.id}/skills`)
        .set('Cookie', [`sid=${sid}`])
        .send({ requiredSkillIds: [skillId] })
        .expect(400);
    });

    shouldFailWithoutAuth(
      () => server,
      'put',
      `${baseUrl}/${randomUUID()}/skills`,
    );
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/${randomUUID()}/skills`,
    );
    shouldFailForVacancyOfAnotherCompany(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/:id/skills`,
    );
  });

  describe('PUT /vacancies/:id/languages', () => {
    it('should set required languages for vacancy', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(prisma, { companyId: company.id }, user.id);
      const vacancy = await createVacancy(prisma, company.id);

      const language = await prisma.language.create({
        data: { name: 'English' },
      });

      const dto: SetLanguagesDto = {
        requiredLanguages: [
          { languageId: language.id, level: LanguageLevel.ADVANCED },
        ],
      };

      const res = await request(server)
        .put(`${baseUrl}/${vacancy.id}/languages`)
        .set('Cookie', [`sid=${sid}`])
        .send(dto)
        .expect(200);

      const resBody = res.body as VacancyWithRelations;
      expect(resBody.requiredLanguages).toHaveLength(1);

      const updatedVacancy = await prisma.vacancy.findUnique({
        where: { id: vacancy.id },
        select: { requiredLanguages: true },
      });
      expect(updatedVacancy).not.toBeNull();
      expect(updatedVacancy!.requiredLanguages).toHaveLength(1);
    });

    it('should return 400 if languages do not exist', async () => {
      const languageId = randomUUID();

      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(prisma, { companyId: company.id }, user.id);
      const vacancy = await createVacancy(prisma, company.id);

      return request(server)
        .put(`${baseUrl}/${vacancy.id}/languages`)
        .set('Cookie', [`sid=${sid}`])
        .send({
          requiredLanguages: [
            { languageId: languageId, level: LanguageLevel.NATIVE },
          ],
        })
        .expect(400);
    });

    shouldFailWithoutAuth(
      () => server,
      'put',
      `${baseUrl}/${randomUUID()}/languages`,
    );
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/${randomUUID()}/languages`,
    );
    shouldFailForVacancyOfAnotherCompany(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/:id/languages`,
    );
  });
});
