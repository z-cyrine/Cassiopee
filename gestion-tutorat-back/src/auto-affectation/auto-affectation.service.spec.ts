import { Test, TestingModule } from '@nestjs/testing';
import { AutoAffectationService } from './auto-affectation.service';

describe('AutoAffectationService', () => {
  let service: AutoAffectationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoAffectationService],
    }).compile();

    service = module.get<AutoAffectationService>(AutoAffectationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
