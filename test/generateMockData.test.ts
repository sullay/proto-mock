import * as path from 'path';
import { generateMockData } from '../index';

describe('generateMockData', () => {
  test('returns mocked data for Person message type', async () => {
    const mockData = await generateMockData(
      path.resolve(__dirname, './fixtures/person.proto'),
      'Person'
    );
    expect(mockData).toMatchObject({
      name: expect.any(String),
      age: expect.any(Number),
      email: expect.any(Array),
      emailAddress: expect.any(String),
      phoneNumbers: expect.any(Object),
      gender: expect.any(Number),
    });
    // 验证map类型的key和value
    Object.keys(mockData.phoneNumbers).forEach((key) => {
      expect(Number.isInteger(parseInt(key, 10))).toBe(true);
      expect(typeof mockData.phoneNumbers[key]).toBe('string');
    });
    // 验证枚举类型
    expect(mockData.gender).toBeGreaterThanOrEqual(0);
    expect(mockData.gender).toBeLessThanOrEqual(2);
  });

  test('returns mocked data with specified maxRepeatedLength', async () => {
    const mockData = await generateMockData(
      path.resolve(__dirname, './fixtures/person.proto'),
      'Person',
      { maxRepeatedLength: 5 }
    );
    expect(mockData.email.length).toBeLessThanOrEqual(5);
  });

  test('returns mocked data with specified keepCase option', async () => {
    const mockData = await generateMockData(
      path.resolve(__dirname, './fixtures/person.proto'),
      'Person',
      { keepCase: true }
    );
    expect(mockData).toMatchObject({
      name: expect.any(String),
      age: expect.any(Number),
      email: expect.any(Array),
      email_address: expect.any(String),
      phone_numbers: expect.any(Object),
      gender: expect.any(Number),
    });
    // 验证map类型的key和value
    Object.keys(mockData.phone_numbers).forEach((key) => {
      expect(Number.isInteger(parseInt(key, 10))).toBe(true);
      expect(typeof mockData.phone_numbers[key]).toBe('string');
    });
    // 验证枚举类型
    expect(mockData.gender).toBeGreaterThanOrEqual(0);
    expect(mockData.gender).toBeLessThanOrEqual(2);
  });

  test('throws an error when invalid message type is provided', async () => {
    await expect(
      generateMockData(path.resolve(__dirname, './fixtures/person.proto'), 'InvalidMessageType')
    ).rejects.toThrow('no such type: InvalidMessageType');
  });
});
