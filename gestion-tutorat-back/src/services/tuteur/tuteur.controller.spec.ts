import { Test, TestingModule } from '@nestjs/testing';
import { TuteurController } from './tuteur.controller';

describe('TuteurController', () => {
  let controller: TuteurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TuteurController],
    }).compile();

    controller = module.get<TuteurController>(TuteurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
