import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Server } from 'node:http';
import { PrismaService } from '../../src/prisma/services/prisma.service';
import { RedisService } from '../../src/redis/services/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { CreateJobSeekerDto } from '../../src/job-seeker/dto/create-job-seeker.dto';
import { createAuthenticatedUser } from './utils/auth.helper';
import { LanguageLevel, SeniorityLevel } from '@prisma/client';
import { FindManyJobSeekersDto } from '../../src/job-seeker/dto/find-many-job-seekers.dto';
import { createJobSeekerWithProps } from './utils/job-seeker.helper';
import { PaginatedResponse } from '@common/responses';
import { UpdateJobSeekerDto } from '../../src/job-seeker/dto/update-job-seeker.dto';
import { JobSeekerWithRelations } from '../../src/job-seeker/types/job-seeker-with-relations.type';
import { SetLanguagesDto } from '../../src/job-seeker/dto/set-languages.dto';
import { SetContactsDto } from '../../src/job-seeker/dto/set-contacts.dto';
import { randomUUID } from 'node:crypto';
import {
  shouldFailWithoutAuth,
  shouldFailWithoutJobSeekerProfile,
} from './utils/guards.helper';

describe('JobSeekerController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;
  let redis: RedisService;

  const baseUrl = '/api/job-seekers';

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
    await prisma.jobSeeker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.skill.deleteMany({});
    await redis.flushall();
  });

  afterAll(async () => {
    await prisma.jobSeeker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.skill.deleteMany({});
    await redis.flushall();
    await app.close();
    server.close();
  });

  describe('POST /job-seekers', () => {
    const body: CreateJobSeekerDto = {
      firstName: 'First Name',
      lastName: 'Last Name',
      expectedSalary: 5000,
      seniorityLevel: SeniorityLevel.SENIOR,
    };

    it('should create job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const res = await request(server)
        .post(baseUrl)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(201);

      const resBody = res.body as JobSeekerWithRelations;

      expect(resBody.id).toBeDefined();
      expect(resBody).toMatchObject({
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        expectedSalary: body.expectedSalary,
        isOpenToWork: false,
        seniorityLevel: body.seniorityLevel,
      });

      const jobSeeker = await prisma.jobSeeker.findUnique({
        where: { id: resBody.id },
      });
      expect(jobSeeker).not.toBeNull();
    });

    it('should return 400 if the user already has a job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      await createJobSeekerWithProps(prisma, {}, user.id);

      return request(server)
        .post(baseUrl)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(400);
    });

    shouldFailWithoutAuth(() => server, 'post', baseUrl);
  });

  describe('GET /job-seekers/me', () => {
    it('should return the authenticated job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      const res = await request(server)
        .get(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const resBody = res.body as JobSeekerWithRelations;
      expect(resBody.id).toBe(jobSeeker.id);
      expect(resBody.userId).toBe(jobSeeker.userId);
    });

    shouldFailWithoutAuth(() => server, 'get', `${baseUrl}/me`);
    shouldFailWithoutJobSeekerProfile(
      () => server,
      () => prisma,
      () => redis,
      'get',
      `${baseUrl}/me`,
    );
  });

  describe('GET /job-seekers/:id', () => {
    it('should return a job seeker by id', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      const res = await request(server)
        .get(`${baseUrl}/${jobSeeker.id}`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const resBody = res.body as JobSeekerWithRelations;

      expect(resBody.id).toBe(jobSeeker.id);
      expect(resBody.firstName).toBe(jobSeeker.firstName);
    });

    it('should return 404 if job seeker does not exist', async () => {
      const { sid } = await createAuthenticatedUser(prisma, redis);
      const jobSeekerId = randomUUID();

      return request(server)
        .get(`${baseUrl}/${jobSeekerId}`)
        .set('Cookie', [`sid=${sid}`])
        .expect(404);
    });

    shouldFailWithoutAuth(() => server, 'get', `${baseUrl}/${randomUUID()}`);
  });

  describe('POST /job-seekers/search', () => {
    it('should filter by skills, languages and sort results', async () => {
      const javaSkill = await prisma.skill.create({ data: { name: 'Java' } });
      const sqlSkill = await prisma.skill.create({
        data: { name: 'SQL' },
      });

      const engLang = await prisma.language.create({
        data: { name: 'English' },
      });

      const targetUserJobSeeker = await createJobSeekerWithProps(prisma, {
        seniority: SeniorityLevel.SENIOR,
        skillIds: [javaSkill.id],
        languages: [{ languageId: engLang.id, level: LanguageLevel.NATIVE }],
        expectedSalary: 6000,
      });

      await createJobSeekerWithProps(prisma, {
        seniority: SeniorityLevel.SENIOR,
        skillIds: [sqlSkill.id],
        languages: [{ languageId: engLang.id, level: LanguageLevel.NATIVE }],
        expectedSalary: 5500,
      });

      const { sid } = await createAuthenticatedUser(prisma, redis);

      const searchDto: FindManyJobSeekersDto = {
        skillIds: [javaSkill.id],
        languages: [
          { languageId: engLang.id, level: LanguageLevel.UPPER_INTERMEDIATE },
        ],
        page: 1,
        take: 10,
      };

      const res = await request(server)
        .post(`${baseUrl}/search`)
        .set('Cookie', [`sid=${sid}`])
        .send(searchDto)
        .expect(200);

      const { data, meta } =
        res.body as PaginatedResponse<JobSeekerWithRelations>;

      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(targetUserJobSeeker.id);
      expect(meta.total).toBe(1);
    });

    shouldFailWithoutAuth(() => server, 'post', `${baseUrl}/search`);
  });

  describe('PATCH /job-seekers/me', () => {
    const body: UpdateJobSeekerDto = {
      firstName: 'Updated First Name',
    };

    it('should update the authenticated job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      const res = await request(server)
        .patch(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(200);

      const resBody = res.body as JobSeekerWithRelations;

      expect(resBody.firstName).toBe(body.firstName);
      expect(resBody.id).toBe(jobSeeker.id);
      expect(resBody.updatedAt).not.toBe(jobSeeker.updatedAt.toISOString());

      const updatedJobSeeker = await prisma.jobSeeker.findUnique({
        where: { id: jobSeeker.id },
      });
      expect(updatedJobSeeker).not.toBeNull();
      expect(updatedJobSeeker).toMatchObject({
        firstName: body.firstName,
      });
    });

    shouldFailWithoutAuth(() => server, 'patch', `${baseUrl}/me`);
    shouldFailWithoutJobSeekerProfile(
      () => server,
      () => prisma,
      () => redis,
      'patch',
      `${baseUrl}/me`,
    );
  });

  describe('DELETE /job-seekers/me', () => {
    it('should delete the authenticated job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      await request(server)
        .delete(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const deletedJobSeeker = await prisma.jobSeeker.findUnique({
        where: { id: jobSeeker.id },
      });
      expect(deletedJobSeeker).toBeNull();
    });

    shouldFailWithoutAuth(() => server, 'delete', `${baseUrl}/me`);
    shouldFailWithoutJobSeekerProfile(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/me`,
    );
  });

  describe('PUT /job-seekers/me/skills', () => {
    it('should put skills to the authenticated job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      const skill = await prisma.skill.create({
        data: { name: 'Java' },
      });

      const res = await request(server)
        .put(`${baseUrl}/me/skills`)
        .set('Cookie', [`sid=${sid}`])
        .send({
          skillIds: [skill.id],
        })
        .expect(200);

      const resBody = res.body as JobSeekerWithRelations;

      expect(resBody.id).toBe(jobSeeker.id);
      expect(resBody.skills).toHaveLength(1);

      const expectedSkills = [{ skill: { id: skill.id, name: skill.name } }];
      expect(resBody.skills).toEqual(expect.arrayContaining(expectedSkills));

      const updatedJobSeeker = await prisma.jobSeeker.findUnique({
        where: { id: jobSeeker.id },
        select: { skills: true },
      });
      expect(updatedJobSeeker).not.toBeNull();
      expect(updatedJobSeeker!.skills).toHaveLength(1);
    });

    it('should return 400 if skills are not found', async () => {
      const body = { skillIds: [randomUUID()] };

      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      await createJobSeekerWithProps(prisma, {}, user.id);

      return request(server)
        .put(`${baseUrl}/me/skills`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(400);
    });

    shouldFailWithoutAuth(() => server, 'put', `${baseUrl}/me/skills`);
    shouldFailWithoutJobSeekerProfile(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/me/skills`,
    );
  });

  describe('PUT /job-seekers/me/languages', () => {
    it('should put languages to the authenticated job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      const language = await prisma.language.create({
        data: { name: 'English' },
      });

      const res = await request(server)
        .put(`${baseUrl}/me/languages`)
        .set('Cookie', [`sid=${sid}`])
        .send({
          languages: [{ languageId: language.id, level: LanguageLevel.NATIVE }],
        })
        .expect(200);

      const resBody = res.body as JobSeekerWithRelations;

      expect(resBody.id).toBe(jobSeeker.id);
      expect(resBody.languages).toHaveLength(1);

      const expectedLanguages = [
        {
          language: { id: language.id, name: language.name },
          level: LanguageLevel.NATIVE,
        },
      ];
      expect(resBody.languages).toEqual(
        expect.arrayContaining(expectedLanguages),
      );

      const updatedJobSeeker = await prisma.jobSeeker.findUnique({
        where: { id: jobSeeker.id },
        select: { languages: true },
      });
      expect(updatedJobSeeker).not.toBeNull();
      expect(updatedJobSeeker!.languages).toHaveLength(1);
    });

    it('should return 400 if languages are not found', async () => {
      const body: SetLanguagesDto = {
        languages: [
          {
            languageId: randomUUID(),
            level: LanguageLevel.NATIVE,
          },
        ],
      };

      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      await createJobSeekerWithProps(prisma, {}, user.id);

      return request(server)
        .put(`${baseUrl}/me/languages`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(400);
    });

    shouldFailWithoutAuth(() => server, 'put', `${baseUrl}/me/languages`);
    shouldFailWithoutJobSeekerProfile(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/me/languages`,
    );
  });

  describe('PUT /job-seekers/me/contacts', () => {
    const body: SetContactsDto = {
      githubUrl: 'https://github.com/user',
      linkedinUrl: 'https://www.linkedin.com/in/user',
    };

    it('should put contacts to the authenticated job seeker profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const jobSeeker = await createJobSeekerWithProps(prisma, {}, user.id);

      const res = await request(server)
        .put(`${baseUrl}/me/contacts`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(200);

      const resBody = res.body as JobSeekerWithRelations;
      expect(resBody.id).toBe(jobSeeker.id);
      expect(resBody.contacts).toMatchObject(body);

      const updatedJobSeeker = await prisma.jobSeeker.findUnique({
        where: { id: jobSeeker.id },
        select: { contacts: true },
      });
      expect(updatedJobSeeker).not.toBeNull();
      expect(updatedJobSeeker?.contacts).not.toBeNull();
    });

    shouldFailWithoutAuth(() => server, 'put', `${baseUrl}/me/contacts`);
    shouldFailWithoutJobSeekerProfile(
      () => server,
      () => prisma,
      () => redis,
      'put',
      `${baseUrl}/me/contacts`,
    );
  });
});
