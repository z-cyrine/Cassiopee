import { Test, TestingModule } from '@nestjs/testing';
import { TuteurService } from './tuteur.service';

describe('TuteurService', () => {
  let service: TuteurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TuteurService],
    }).compile();

    service = module.get<TuteurService>(TuteurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
