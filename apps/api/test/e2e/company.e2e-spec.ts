import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Server } from 'node:http';
import { PrismaService } from '../../src/prisma/services/prisma.service';
import { RedisService } from '../../src/redis/services/redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as cookieParser from 'cookie-parser';
import { EmailService } from '../../src/email/services/email.service';
import { CreateCompanyDto } from '../../src/company/dto/create-company.dto';
import { createAuthenticatedUser } from './utils/auth.helper';
import { createRecruiter } from './utils/recruiter.helper';
import { createCompany } from './utils/company.helper';
import { Company, CompanyRole } from '@prisma/client';
import { FindManyCompaniesDto } from '../../src/company/dto/find-many-companies.dto';
import { PaginatedResponse } from '@common/responses';
import { randomUUID } from 'node:crypto';
import { TokenType } from '../../src/token/enums/token-type.enum';
import { UpdateCompanyDto } from '../../src/company/dto/update-company.dto';
import {
  shouldFailForRecruiterWithoutCompany,
  shouldFailIfRecruiterHasCompany,
  shouldFailWithoutAuth,
  shouldFailWithoutCompanyAdminRole,
} from './utils/guards.helper';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;
  let redis: RedisService;

  const baseUrl = '/api/companies';

  const mockEmailService = {
    sendCompanyInvitation: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .compile();

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
    await prisma.company.deleteMany({});
    await prisma.recruiter.deleteMany({});
    await prisma.user.deleteMany({});
    await redis.flushall();
  });

  afterAll(async () => {
    await prisma.company.deleteMany({});
    await prisma.recruiter.deleteMany({});
    await prisma.user.deleteMany({});
    await redis.flushall();
    await app.close();
    server.close();
  });

  describe('POST /companies', () => {
    const body: CreateCompanyDto = {
      name: 'Company Name',
      description: 'Company Description',
    };

    it('should create a new company', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const recruiter = await createRecruiter(prisma, {}, user.id);

      const res = await request(server)
        .post(baseUrl)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(201);

      const resBody = res.body as Company;

      expect(resBody.id).toBeDefined();
      expect(resBody).toMatchObject({
        name: body.name,
        description: body.description,
        isVerified: false,
      });

      const createdCompany = await prisma.company.findUnique({
        where: { id: resBody.id },
      });
      expect(createdCompany).not.toBeNull();

      const companyCreator = await prisma.recruiter.findUnique({
        where: { id: recruiter.id },
      });

      expect(companyCreator).toMatchObject({
        companyId: resBody.id,
        role: CompanyRole.ADMIN,
      });
    });

    shouldFailWithoutAuth(() => server, 'post', baseUrl);
    shouldFailIfRecruiterHasCompany(
      () => server,
      () => prisma,
      () => redis,
      'post',
      baseUrl,
    );
  });

  describe('POST /companies/invite', () => {
    it('should send an email invitation to the company', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);
      await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      const { user: invitedUser } = await createAuthenticatedUser(
        prisma,
        redis,
      );
      await createRecruiter(prisma, {}, invitedUser.id);

      await request(server)
        .post(`${baseUrl}/invite`)
        .set('Cookie', [`sid=${sid}`])
        .send({ email: invitedUser.email })
        .expect(200);

      expect(mockEmailService.sendCompanyInvitation).toHaveBeenCalledWith(
        invitedUser.email,
        expect.any(String),
        company.name,
      );

      const keys = await redis.keys(`${TokenType.INVITE}:*`);
      expect(keys.length).toBe(1);
    });

    shouldFailWithoutAuth(() => server, 'post', `${baseUrl}/invite`);
    shouldFailWithoutCompanyAdminRole(
      () => server,
      () => prisma,
      () => redis,
      'post',
      `${baseUrl}/invite`,
    );
  });

  describe('GET /companies', () => {
    const query: FindManyCompaniesDto = {
      name: 'Targe',
      page: 1,
      take: 10,
    };

    it('should return companies matching the search query', async () => {
      const targetCompany = await createCompany(prisma, 'Target Company');
      await createCompany(prisma);

      const res = await request(server).get(baseUrl).query(query).expect(200);

      const resBody = res.body as PaginatedResponse<Company>;

      expect(resBody.data).toHaveLength(1);
      expect(resBody.data[0].id).toBe(targetCompany.id);
      expect(resBody.data[0].name).toBe(targetCompany.name);
      expect(resBody.meta.total).toBe(1);
    });
  });

  describe('GET /companies/my', () => {
    it('should return the company of the authenticated recruiter', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      await createRecruiter(prisma, { companyId: company.id }, user.id);

      const res = await request(server)
        .get(`${baseUrl}/my`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const resBody = res.body as Company;
      expect(resBody.id).toBe(company.id);
    });

    shouldFailWithoutAuth(() => server, 'get', `${baseUrl}/my`);
    shouldFailForRecruiterWithoutCompany(
      () => server,
      () => prisma,
      () => redis,
      'get',
      `${baseUrl}/my`,
    );
  });

  describe('GET /companies/:id', () => {
    it('should return a company by id', async () => {
      const company = await createCompany(prisma);

      const res = await request(server)
        .get(`${baseUrl}/${company.id}`)
        .expect(200);

      const resBody = res.body as Company;

      expect(resBody.id).toBe(company.id);
      expect(resBody.name).toBe(company.name);
    });

    it('should return 404 if company does not exist', async () => {
      const companyId = randomUUID();
      return request(server).get(`${baseUrl}/${companyId}`).expect(404);
    });
  });

  describe('GET /companies/invitations/accept', () => {
    it('should accept an invitation to join a company', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);
      const recruiter = await createRecruiter(prisma, {}, user.id);

      const company = await createCompany(prisma);

      const inviteToken = randomUUID();

      const payload = JSON.stringify({
        companyId: company.id,
        email: user.email,
      });

      await redis.setex(`${TokenType.INVITE}:${inviteToken}`, 3000, payload);

      await request(server)
        .get(`${baseUrl}/invitations/accept`)
        .set('Cookie', [`sid=${sid}`])
        .query(`token=${inviteToken}`)
        .expect(200);

      const updatedRecruiter = await prisma.recruiter.findUnique({
        where: { id: recruiter.id },
      });
      expect(updatedRecruiter).toMatchObject({
        companyId: company.id,
      });
    });

    it('should return 400 if the token is invalid', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);
      await createRecruiter(prisma, {}, user.id);

      const inviteToken = randomUUID();

      return request(server)
        .get(`${baseUrl}/invitations/accept`)
        .set('Cookie', [`sid=${sid}`])
        .query(`token=${inviteToken}`)
        .expect(400);
    });

    shouldFailWithoutAuth(() => server, 'get', `${baseUrl}/invitations/accept`);
    shouldFailIfRecruiterHasCompany(
      () => server,
      () => prisma,
      () => redis,
      'get',
      `${baseUrl}/invitations/accept`,
    );
  });

  describe('DELETE /companies/recruiters/:recruiterId', () => {
    it('should remove a recruiter from a company', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      const recruiterToRemove = await createRecruiter(prisma, {
        companyId: company.id,
      });

      await request(server)
        .delete(`${baseUrl}/recruiters/${recruiterToRemove.id}`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const firedRecruiter = await prisma.recruiter.findUnique({
        where: { id: recruiterToRemove.id },
      });
      expect(firedRecruiter).toMatchObject({
        companyId: null,
      });
    });

    it('should return 403 if the recruiter is not from your company', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      const recruiterToRemove = await createRecruiter(prisma, {});

      return request(server)
        .delete(`${baseUrl}/recruiters/${recruiterToRemove.id}`)
        .set('Cookie', [`sid=${sid}`])
        .expect(403);
    });

    it('should return 403 if the company admin tries to leave on their own', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      const recruiterToRemove = await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      return request(server)
        .delete(`${baseUrl}/recruiters/${recruiterToRemove.id}`)
        .set('Cookie', [`sid=${sid}`])
        .expect(403);
    });

    shouldFailWithoutAuth(
      () => server,
      'delete',
      `${baseUrl}/recruiters/${randomUUID()}`,
    );
    shouldFailWithoutCompanyAdminRole(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/recruiters/${randomUUID()}`,
    );
  });

  describe('PATCH /companies/my', () => {
    const body: UpdateCompanyDto = {
      name: 'Updated Company Name',
    };

    it('should update the company of the authenticated company admin', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      const res = await request(server)
        .patch(`${baseUrl}/my`)
        .set('Cookie', [`sid=${sid}`])
        .send(body)
        .expect(200);

      const resBody = res.body as Company;

      expect(resBody.name).toBe(body.name);
      expect(resBody.id).toBe(company.id);
      expect(resBody.updatedAt).not.toBe(company.updatedAt.toISOString());

      const updatedCompany = await prisma.company.findUnique({
        where: { id: company.id },
      });
      expect(updatedCompany).toMatchObject({
        name: body.name,
      });
    });

    shouldFailWithoutAuth(() => server, 'patch', `${baseUrl}/my`);
    shouldFailWithoutCompanyAdminRole(
      () => server,
      () => prisma,
      () => redis,
      'patch',
      `${baseUrl}/my`,
    );
  });

  describe('DELETE /companies/my', () => {
    it('should delete the company of the authenticated company admin', async () => {
      const { user, sid } = await createAuthenticatedUser(prisma, redis);

      const company = await createCompany(prisma);

      const recruiter = await createRecruiter(
        prisma,
        { companyId: company.id, role: CompanyRole.ADMIN },
        user.id,
      );

      await request(server)
        .delete(`${baseUrl}/my`)
        .set('Cookie', [`sid=${sid}`])
        .expect(200);

      const deletedCompany = await prisma.company.findUnique({
        where: { id: company.id },
      });
      expect(deletedCompany).toBeNull();

      const exCompanyAdmin = await prisma.recruiter.findUnique({
        where: { id: recruiter.id },
      });
      expect(exCompanyAdmin).toMatchObject({
        companyId: null,
        role: CompanyRole.MEMBER,
      });
    });

    shouldFailWithoutAuth(() => server, 'delete', `${baseUrl}/my`);
    shouldFailWithoutCompanyAdminRole(
      () => server,
      () => prisma,
      () => redis,
      'delete',
      `${baseUrl}/my`,
    );
  });
});
