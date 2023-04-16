import * as protobuf from 'protobufjs';
import { faker, } from '@faker-js/faker'

/**
 * 生成随机数据
 * @param field
 * @returns 
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
      return faker.random.words(5)
    case 'bytes':
      return new ArrayBuffer(8)
    default:
      return null;
  }
}
/**
 * 根据protobuf文件路径和message类型生成mock数据
 * @param protoFilePath
 * @param messageType
 * @param options
 * @returns
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

  function convertToUnderscore(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

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

  function generateMockDataRecursive(type: protobuf.Type): any {
    const mockData: any = {};

    type.fieldsArray.forEach((field) => {
      if (field.repeated) {
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = generateRepeatedMockData(field);
      } else if (field.resolvedType instanceof protobuf.Type) {
        const nestedMockData = generateMockDataRecursive(field.resolvedType as protobuf.Type);
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = nestedMockData;
      } else if (field.resolvedType instanceof protobuf.Enum) {
        const values = Object.values(field.resolvedType.values);
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = values[faker.datatype.number({ min: 0, max: values.length - 1 })];
      } else {
        mockData[keepCase ? convertToUnderscore(field.name) : field.name] = generateRandomData(field);
      }
    });

    return mockData;
  }

  return generateMockDataRecursive(type);
}
