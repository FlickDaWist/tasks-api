import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';

describe('Auth', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token = '';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, AppModule],
      providers: [JwtService],
    }).compile();

    jwtService = await moduleRef.resolve(JwtService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST login', () => {
    it('should login, get token, and verify token is for the user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'augioka',
          password: 'test123',
        })
        .expect(200)
        .then((response) => {
          const payload = jwtService.verify(response.body.access_token);
          token = response.body.access_token;
          expect(payload.username === 'augioka');
        });
    });
  });

  describe('/GET Task', () => {
    it('should be able to access tasks api with the token given', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .auth(token, { type: 'bearer' })
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
