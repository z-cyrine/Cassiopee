import { Test, TestingModule } from '@nestjs/testing';
import { AutoAffectationController } from './auto-affectation.controller';

describe('AutoAffectationController', () => {
  let controller: AutoAffectationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoAffectationController],
    }).compile();

    controller = module.get<AutoAffectationController>(AutoAffectationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
