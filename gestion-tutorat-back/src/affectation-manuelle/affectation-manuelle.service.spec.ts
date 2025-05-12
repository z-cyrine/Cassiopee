import { Test, TestingModule } from '@nestjs/testing';
import { AffectationManuelleService } from './affectation-manuelle.service';

describe('AffectationManuelleService', () => {
  let service: AffectationManuelleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffectationManuelleService],
    }).compile();

    service = module.get<AffectationManuelleService>(AffectationManuelleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});