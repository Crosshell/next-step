import {
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsBiggerThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          if (typeof value !== 'number') return false;

          const [relatedPropertyName] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          return typeof relatedValue === 'number' && value > relatedValue;
        },

        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints as [string];
          return `${args.property} must be greater than ${relatedPropertyName}`;
        },
      },
    });
  };
}
