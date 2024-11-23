import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TransactionDTO } from '../src/service/dto/transaction.dto';
import { TransactionService } from '../src/service/transaction.service';

describe('Transaction Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(TransactionService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all transactions ', async () => {
    const getEntities: TransactionDTO[] = (await request(app.getHttpServer()).get('/api/transactions').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET transactions by id', async () => {
    const getEntity: TransactionDTO = (
      await request(app.getHttpServer())
        .get('/api/transactions/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create transactions', async () => {
    const createdEntity: TransactionDTO = (await request(app.getHttpServer()).post('/api/transactions').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update transactions', async () => {
    const updatedEntity: TransactionDTO = (await request(app.getHttpServer()).put('/api/transactions').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update transactions from id', async () => {
    const updatedEntity: TransactionDTO = (
      await request(app.getHttpServer())
        .put('/api/transactions/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE transactions', async () => {
    const deletedEntity: TransactionDTO = (
      await request(app.getHttpServer())
        .delete('/api/transactions/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
