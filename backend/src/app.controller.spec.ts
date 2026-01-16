import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            ping: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ping', () => {
    it('should return the result from AppService.ping', () => {
      const expectedResult = 'Movie Database API';
      const pingSpy = jest
        .spyOn(service, 'ping')
        .mockReturnValue(expectedResult);

      const result = controller.ping();

      expect(pingSpy).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });

    it('should call AppService.ping exactly once', () => {
      const expectedResult = 'Movie Database API';
      const pingSpy = jest
        .spyOn(service, 'ping')
        .mockReturnValue(expectedResult);

      controller.ping();

      expect(pingSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a string', () => {
      const expectedResult = 'Movie Database API';
      jest.spyOn(service, 'ping').mockReturnValue(expectedResult);

      const result = controller.ping();

      expect(typeof result).toBe('string');
    });
  });
});
