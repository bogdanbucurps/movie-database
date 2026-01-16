import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ping', () => {
    it('should return "Movie Database API"', () => {
      const result = service.ping();
      expect(result).toBe('Movie Database API');
    });

    it('should return a string', () => {
      const result = service.ping();
      expect(typeof result).toBe('string');
    });

    it('should return the same value on multiple calls', () => {
      const result1 = service.ping();
      const result2 = service.ping();
      expect(result1).toBe(result2);
    });
  });
});
