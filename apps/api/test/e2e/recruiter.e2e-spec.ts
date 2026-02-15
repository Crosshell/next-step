import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Server } from 'node:http';
import { PrismaService } from '../../src/prisma/services/prisma.service';
import { RedisService } from '../../src/redis/services/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../src/app.module';
import { createAuthenticatedUser } from './utils/auth.helper';
import { CompanyRole, Recruiter } from '@prisma/client';
import { CreateRecruiterDto } from '../../src/recruiter/dto/create-recruiter.dto';
import { createRecruiter } from './utils/recruiter.helper';
import { randomUUID } from 'node:crypto';
import { createCompany } from './utils/company.helper';
import { UpdateRecruiterDto } from '../../src/recruiter/dto/update-recruiter.dto';
import {
  shouldFailForRecruiterWithoutCompany,
  shouldFailWithoutAuth,
  shouldFailWithoutRecruiterProfile,
} from './utils/guards.helper';
import { PaginatedResponse } from '@common/responses';

describe('RecruiterController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;
  let redis: RedisService;

  const baseUrl = '/api/recruiters';

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
    await prisma.recruiter.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.user.deleteMany({});
    await redis.flushall();
  });

  afterAll(async () => {
    await prisma.recruiter.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.user.deleteMany({});
    await redis.flushall();
    await app.close();
    server.close();
  });

  describe('POST /recruiters', () => {
    const body: CreateRecruiterDto = {
      firstName: 'First Name',
      lastName: 'Last Name',
    };

    it('should create a new recruiter', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const res = await request(server)
        .post(baseUrl)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(201);

      const resBody = res.body as Recruiter;

      expect(resBody).toMatchObject({
        firstName: body.firstName,
        lastName: body.lastName,
        userId: user.id,
        role: CompanyRole.MEMBER,
      });
      expect(resBody.id).toBeDefined();

      const createdRecruiter = await prisma.recruiter.findUnique({
        where: { userId: user.id },
      });

      expect(createdRecruiter).not.toBeNull();
    });

    it('should return 400 if the user already has a recruiter profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      await prisma.recruiter.create({
        data: { ...body, user: { connect: { id: user.id } } },
      });

      return request(server)
        .post(baseUrl)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(400);
    });

    shouldFailWithoutAuth(() => server, 'post', baseUrl);
  });

  describe('GET /recruiters/me', () => {
    it('should return the authenticated recruiter profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const recruiter = await createRecruiter(prisma, {}, user.id);

      const res = await request(server)
        .get(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const resBody = res.body as Recruiter;
      expect(resBody.id).toBe(recruiter.id);
      expect(resBody.userId).toBe(recruiter.userId);
    });

    shouldFailWithoutAuth(() => server, 'get', `${baseUrl}/me`);
    shouldFailWithoutRecruiterProfile(
      () => server,
      () => prisma,
      () => redis,
      'get',
      `${baseUrl}/me`,
    );
  });

  describe('GET /recruiters/:id', () => {
    it('should return a recruiter profile by id', async () => {
      const recruiter = await createRecruiter(prisma, {});

      const res = await request(server)
        .get(`${baseUrl}/${recruiter.id}`)
        .expect(200);

      const resBody = res.body as Recruiter;
      expect(resBody).toMatchObject({
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
      });
      expect(resBody.id).toBe(recruiter.id);
    });

    it('should return 404 if recruiter does not exist', async () => {
      const recruiterId = randomUUID();

      return request(server).get(`${baseUrl}/${recruiterId}`).expect(404);
    });
  });

  describe('GET /recruiters', () => {
    it('should return recruiters by company', async () => {
      const company = await createCompany(prisma);
      const targetRecruiter = await createRecruiter(prisma, {
        companyId: company.id,
      });

      await createRecruiter(prisma, {});

      const res = await request(server)
        .get(baseUrl)
        .query({ companyId: company.id })
        .expect(200);

      const { data, meta } = res.body as PaginatedResponse<Recruiter>;

      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(targetRecruiter.id);
      expect(meta.total).toBe(1);
    });
  });

  describe('PATCH /recruiters/me', () => {
    const body: UpdateRecruiterDto = {
      firstName: 'Updated First Name',
    };

    it('should update the authenticated recruiter profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const recruiter = await createRecruiter(prisma, {}, user.id);

      const res = await request(server)
        .patch(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(200);

      const resBody = res.body as Recruiter;

      expect(resBody.firstName).toBe(body.firstName);
      expect(resBody.id).toBe(recruiter.id);
      expect(resBody.updatedAt).not.toBe(recruiter.updatedAt.toISOString());

      const updatedRecruiter = await prisma.recruiter.findUnique({
        where: { id: recruiter.id },
      });
      expect(updatedRecruiter ? updatedRecruiter.firstName : null).toBe(
        body.firstName,
      );
    });

    shouldFailWithoutAuth(() => server, 'patch', `${baseUrl}/me`);
    shouldFailWithoutRecruiterProfile(
      () => server,
      () => prisma,
      () => redis,
      'patch',
      `${baseUrl}/me`,
    );
  });

  describe('DELETE /recruiters/me/company', () => {
    it('should delete the authenticated recruiter company', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      const recruiter = await createRecruiter(
        prisma,
        {
          companyId: company.id,
        },
        user.id,
      );

      await request(server)
        .delete(`${baseUrl}/me/company`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const recruiterWithoutCompany = await prisma.recruiter.findUnique({
        where: { id: recruiter.id },
      });
      expect(recruiterWithoutCompany).not.toBeNull();
      expect(recruiterWithoutCompany).toMatchObject({ companyId: null });
    });

    it('should return 403 if the recruiter is a company admin', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(
        prisma,
        {
          companyId: company.id,
          role: CompanyRole.ADMIN,
        },
        user.id,
      );

      return request(server)
        .delete(`${baseUrl}/me/company`)
        .set('Cookie', [`sid=${sid}`])
        .expect(403);
    });

    shouldFailWithoutAuth(() => server, 'delete', `${baseUrl}/me/company`);
    shouldFailWithoutRecruiterProfile(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/me/company`,
    );
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/me/company`,
    );
  });

  describe('DELETE /recruiters/me', () => {
    it('should delete the authenticated recruiter profile', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const recruiter = await createRecruiter(prisma, {}, user.id);

      await request(server)
        .delete(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const deletedRecruiter = await prisma.recruiter.findUnique({
        where: { id: recruiter.id },
      });

      expect(deletedRecruiter).toBeNull();
    });

    it('should return 403 if the recruiter is a company admin', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);
      const company = await createCompany(prisma);
      await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      return request(server)
        .delete(`${baseUrl}/me`)
        .set('Cookie', [`sid=${sid}`])
        .expect(403);
    });

    shouldFailWithoutAuth(() => server, 'delete', `${baseUrl}/me`);
    shouldFailWithoutRecruiterProfile(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/me`,
    );
  });
});
