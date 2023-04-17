import * as protobuf from 'protobufjs';
import { faker } from '@faker-js/faker'

/**
 * Generates random data for a given protobuf field.
 * @param field - The protobuf field.
 * @returns The generated random data.
 */
function generateRandomData(field: protobuf.Field): any {
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
 * Generates mock data for a given protobuf message type.
 * @param protoFilePath - The path to the protobuf file.
 * @param messageType - The name of the protobuf message type.
 * @param options - Optional settings for the mock data generation.
 * @returns The generated mock data.
 */
export function generateMockData(
  protoFilePath: string,
  messageType: string,
  options: {
    maxRepeatedLength?: number;
    keepCase?: boolean;
  } = {}
): any {
  const root = protobuf.loadSync(protoFilePath);
  root.resolveAll();
  const type = root.lookupType(messageType);
  if (!type) {
    throw new Error(`Failed to lookup type ${messageType} in ${protoFilePath}`);
  }

  const { maxRepeatedLength = 3, keepCase = false } = options;

  /**
   * Converts a string to snake_case.
   * @param str - The string to convert.
   * @returns The converted string.
   */
  function convertToUnderscore(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

  /**
   * Generates mock data for a repeated protobuf field.
   * @param field - The repeated protobuf field.
   * @returns The generated mock data.
   */
  function generateRepeatedMockData(field: protobuf.Field): any[] {
    const { resolvedType } = field;
    if (resolvedType instanceof protobuf.Type) {
      return Array.from({ length: faker.datatype.number({ min: 1, max: maxRepeatedLength }) }, () =>
        generateMockDataRecursive(resolvedType)
      );
    } else if (resolvedType instanceof protobuf.Enum) {
      const values = Object.values(resolvedType.values);
      return Array.from({ length: faker.datatype.number({ min: 1, max: maxRepeatedLength }) }, () =>
        values[faker.datatype.number({ min: 0, max: values.length - 1 })]
      );
    } else {
      return Array.from({ length: faker.datatype.number({ min: 1, max: maxRepeatedLength }) }, () => generateRandomData(field));
    }
  }

  /**
   * Generates mock data for a given protobuf message type.
   * @param type - The protobuf message type.
   * @returns The generated mock data.
   */
   function generateMockDataRecursive(type: protobuf.Type): any {
    const mockData: any = {};
  
    // Loop through each field in the protobuf message
    for (const field of type.fieldsArray) {
      // If the field is a map, generate a random key and value for it
      if (field.map && field instanceof protobuf.MapField) {
        const keyType = field.keyType;
        const valueType = field.type;
        if (keyType && valueType) {
          const key = generateRandomData({ type: keyType } as protobuf.Field);
          let value;
          if (field.resolvedType instanceof protobuf.Type) {
            value = generateMockDataRecursive(field.resolvedType as protobuf.Type)
          } else if (field.resolvedType instanceof protobuf.Enum) {
            const values = Object.values(field.resolvedType.values);
            value = values[faker.datatype.number({ min: 0, max: values.length - 1 })];
          } else {
            value = generateRandomData({ type: valueType } as protobuf.Field)
          }
          const map = { [key]: value };
          mockData[keepCase ? convertToUnderscore(field.name) : field.name] = map;
        }
      } 
      // If the field is repeated, generate an array of random values for it
      else if (field.repeated) {
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = generateRepeatedMockData(field);
      } 
      // If the field is a nested message, recursively generate mock data for it
      else if (field.resolvedType instanceof protobuf.Type) {
        const nestedMockData = generateMockDataRecursive(field.resolvedType as protobuf.Type);
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = nestedMockData;
      } 
      // If the field is an enum, generate a random value from its options
      else if (field.resolvedType instanceof protobuf.Enum) {
        const values = Object.values(field.resolvedType.values);
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = values[faker.datatype.number({ min: 0, max: values.length - 1 })];
      } 
      // Otherwise, generate a random value based on the field's type
      else {
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = generateRandomData(field);
      }
    }
  
    return mockData;
  }
  return generateMockDataRecursive(type);
}