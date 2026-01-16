import { ValidationError } from '@nestjs/common';

export const formatErrors = (
  errors: ValidationError[],
): Record<string, string> =>
  errors.reduce((acc, error) => {
    if (error.children?.length) {
      return {
        ...acc,
        [error.property]: formatErrors(error.children),
      };
    }

    const constraintMessage: string = Object.values(error.constraints || {})[0];

    return {
      ...acc,
      [error.property]: constraintMessage,
    };
  }, {});
