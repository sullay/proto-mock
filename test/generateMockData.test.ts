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
    });
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
    });
  });

  test('throws an error when invalid message type is provided', async () => {
    await expect(
      generateMockData(path.resolve(__dirname, './fixtures/person.proto'), 'InvalidMessageType')
    ).rejects.toThrow('no such type: InvalidMessageType');
  });
});
