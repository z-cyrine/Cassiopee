import { Test, TestingModule } from '@nestjs/testing';
import { AffectationManuelleController } from './affectation-manuelle.controller';

describe('AffectationManuelleController', () => {
  let controller: AffectationManuelleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffectationManuelleController],
    }).compile();

    controller = module.get<AffectationManuelleController>(AffectationManuelleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});