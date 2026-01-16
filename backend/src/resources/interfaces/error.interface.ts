import type { TErrorCode } from '../enums';

export interface IError {
  code: TErrorCode;
  message: string;
  errors?: Record<string, string>;
}
