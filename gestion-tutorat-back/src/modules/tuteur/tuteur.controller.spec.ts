import { Test, TestingModule } from '@nestjs/testing';
import { TuteurController } from './tuteur.controller';
import { TuteurService } from './tuteur.service';

describe('TuteurController', () => {
  let controller: TuteurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TuteurController],
      providers: [TuteurService],
    }).compile();

    controller = module.get<TuteurController>(TuteurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
