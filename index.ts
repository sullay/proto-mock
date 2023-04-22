import * as protobuf from 'protobufjs';
import { faker } from '@faker-js/faker'
import { convertToUnderscore, generateRandomData } from './utils'

/**
 * Generates mock data for a given protobuf message type.
 * @param protoFilePath - The path to the protobuf file.
 * @param messageType - The name of the protobuf message type.
 * @param options - Optional settings for the mock data generation.
 * @returns The generated mock data.
 */
export async function generateMockData(
  protoFilePath: string,
  messageType: string,
  options: {
    maxRepeatedLength?: number;
    maxMapEntries?: number;
    keepCase?: boolean;
  } = {}
): Promise<any> {
  const root = await protobuf.load(protoFilePath);
  root.resolveAll();
  const type = root.lookupType(messageType);
  if (!type) {
    throw new Error(`Failed to lookup type ${messageType} in ${protoFilePath}`);
  }

  const { maxRepeatedLength = 3, maxMapEntries = 3, keepCase = false } = options;

  return generateMockDataRecursive(type);

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
 * Generates mock data for a map protobuf field.
 * @param field - The protobuf MapField.
 * @returns The generated mock data.
 */
  function generateMockMapData(field: protobuf.MapField): any {
    const keyType = field.keyType;
    const valueType = field.type;

    if (!keyType || !valueType) {
      return null;
    }

    const map: { [key: string]: any } = {};

    for (let i = 0; i < faker.datatype.number({ min: 1, max: maxMapEntries }); i++) {
      const key = generateRandomData({ type: keyType } as protobuf.Field);
      let value;

      if (field.resolvedType instanceof protobuf.Type) {
        value = generateMockDataRecursive(field.resolvedType as protobuf.Type);
      } else if (field.resolvedType instanceof protobuf.Enum) {
        const values = Object.values(field.resolvedType.values);
        value = values[faker.datatype.number({ min: 0, max: values.length - 1 })];
      } else {
        value = generateRandomData({ type: valueType } as protobuf.Field);
      }

      map[key] = value;
    }

    return map;
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
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = generateMockMapData(field);
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
      // If the field is a non-repeated non-nested field, generate a random value for it
      else {
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = generateRandomData(field);
      }
    }

    return mockData;
  }
}