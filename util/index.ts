import * as protobuf from 'protobufjs';
import { faker } from '@faker-js/faker';

/**
 * Generates random data for a given protobuf field.
 * @param field - The protobuf field.
 * @returns The generated random data.
 */
 export function generateRandomData(field: protobuf.Field): any {
  switch (field.type) {
    case 'double':
    case 'float':
      return faker.datatype.float();
    case 'int32':
    case 'uint32':
    case 'sint32':
    case 'fixed32':
    case 'sfixed32':
      return faker.datatype.number();
    case 'int64':
    case 'uint64':
    case 'sint64':
    case 'fixed64':
    case 'sfixed64':
      return faker.datatype.bigInt().toString();
    case 'bool':
      return faker.datatype.boolean();
    case 'string':
      return faker.random.words(5);
    case 'bytes':
      return Buffer.from(faker.random.word());
    default:
      return null;
  }
}

/**
   * Converts a string to snake_case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
export function convertToUnderscore(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
