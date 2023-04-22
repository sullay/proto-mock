# proto-mock

`proto-mock` is a Node.js library that generates random data for given Protobuf message types.

## Installation

```bash
npm install proto-mock
```

## Usage

```typescript
import { generateMockData } from 'proto-mock';

const mockData = await generateMockData('path/to/proto/file.proto', 'MyMessageType');
console.log(mockData);
```

### `generateMockData(protoFilePath: string, messageType: string, options?: GenerateMockDataOptions): Promise<any>`

*   `protoFilePath` - Required. The path to the Protobuf file.
*   `messageType` - Required. The name of the message type.
*   `options` - Optional. The settings for generating random data.

Return value: A Promise that asynchronously returns the generated random data.

### `GenerateMockDataOptions`

*   `maxRepeatedLength` - Optional. Specifies the maximum length of generated arrays. Defaults to 3.
*   `maxMapEntries` - Optional. Specifies the maximum number of entries in generated maps. Defaults to 3.
*   `keepCase` - Optional. Specifies whether to preserve the case of field names. Defaults to false (camel case).

## Example

Suppose there is a `person.proto` file defining a `Person` message type:

```protobuf
syntax = "proto3";

package example;

message Person {
  string name = 1;
  int32 age = 2;
  repeated string email = 3;
}
```

Using `proto-mock`, random data can be generated for the `Person` type:

```typescript
import { generateMockData } from 'proto-mock';

const mockData = await generateMockData('path/to/person.proto', 'Person');
console.log(mockData);
// Outputs randomly generated data similar to:
// {
//   name: 'Lola Hudson',
//   age: -12713,
//   email: [ 'calvinkoch@example.com', 'jakefernandez@example.com' ]
// }
```