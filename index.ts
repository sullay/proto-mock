import { faker } from '@faker-js/faker';
import * as protobuf from 'protobufjs';
import { convertToUnderscore, generateRandomData } from './utils';

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
    keyValueRange?: { [key: string]: any[] };
  } = {}
): Promise<any> {
  const root = await protobuf.load(protoFilePath);
  root.resolveAll();
  const type = root.lookupType(messageType);
  if (!type) {
    throw new Error(`Failed to lookup type ${messageType} in ${protoFilePath}`);
  }

  const {
    maxRepeatedLength = 3,
    maxMapEntries = 3,
    keepCase = false,
    keyValueRange = {},
  } = options;

  return generateMockDataRecursive(type);

  /**
   * Generates mock data for a repeated protobuf field.
   * @param field - The repeated protobuf field.
   * @returns The generated mock data.
   */
  function generateRepeatedMockData(field: protobuf.Field): any[] {
    const { resolvedType } = field;
    if (resolvedType instanceof protobuf.Type) {
      return Array.from(
        { length: faker.datatype.number({ min: 1, max: maxRepeatedLength }) },
        () => generateMockDataRecursive(resolvedType)
      );
    } else if (resolvedType instanceof protobuf.Enum) {
      return faker.helpers.arrayElements(
        Object.values(resolvedType.values),
        faker.datatype.number({ min: 1, max: maxRepeatedLength })
      );
    } else {
      return Array.from(
        { length: faker.datatype.number({ min: 1, max: maxRepeatedLength }) },
        () => generateRandomData(field)
      );
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
        value = faker.helpers.arrayElement(values);
      } else {
        value = generateRandomData({ type: valueType } as protobuf.Field);
      }
      map[key] = value;
    }

    return map;
  }

  /**
  
  Generates mock data for a given protobuf message type.
  
  @param type - The protobuf message type.
  
  @returns The generated mock data.
  */
  function generateMockDataRecursive(type: protobuf.Type): any {
    const mockData: any = {};
    // Loop through each field in the protobuf message
    for (const field of type.fieldsArray) {
      const fieldName = keepCase ? convertToUnderscore(field.name) : field.name;
      // If keyValueRange is defined for the current field, generate data based on the specified range
      if (keyValueRange[field.name]) {
        mockData[fieldName] = field.repeated
          ? faker.helpers.arrayElements(
            keyValueRange[field.name],
            faker.datatype.number({ min: 1, max: maxRepeatedLength })
          )
          : faker.helpers.arrayElement(keyValueRange[field.name]);
      }
      // If the field is a map, generate a random key and value for it
      else if (field.map && field instanceof protobuf.MapField) {
        mockData[fieldName] = generateMockMapData(field);
      }
      // If the field is repeated, generate an array of random values for it
      else if (field.repeated) {
        mockData[fieldName] = generateRepeatedMockData(field);
      }
      // If the field is a nested message, recursively generate mock data for it
      else if (field.resolvedType instanceof protobuf.Type) {
        const nestedMockData = generateMockDataRecursive(
          field.resolvedType as protobuf.Type
        );
        mockData[fieldName] = nestedMockData;
      }
      // If the field is an enum, generate a random value from its options
      else if (field.resolvedType instanceof protobuf.Enum) {
        const values = Object.values(field.resolvedType.values);
        mockData[fieldName] = faker.helpers.arrayElement(values);
      }
      // If the field is a non-repeated non-nested field, generate a random value for it
      else {
        mockData[fieldName] = generateRandomData(field);
      }
    }
    return mockData;
  }
}