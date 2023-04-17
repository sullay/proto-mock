
proto-mock
==========

`proto-mock` is a Node.js library that generates random data for a given Protobuf message type.

Installation
------------

```bash
npm install proto-mock
```

Usage
-----

```typescript
import { generateMockData } from 'proto-mock';

const mockData = await generateMockData('path/to/proto/file.proto', 'MyMessageType');
console.log(mockData);
```

### `generateMockData(protoFilePath: string, messageType: string, options?: GenerateMockDataOptions): Promise<any>`

*   `protoFilePath` - Required. The path to the Protobuf file.
*   `messageType` - Required. The name of the message type.
*   `options` - Optional. Settings for generating random data.

Returns a Promise that asynchronously returns the generated random data.

### `GenerateMockDataOptions`

*   `maxRepeatedLength` - Optional. The maximum length of the generated arrays. Defaults to 3.
*   `keepCase` - Optional. Whether to keep the case of field names. Defaults to false (camelCase).

Example
-------

Assume there is a `person.proto` file that defines a `Person` message type:

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
// Outputs random data similar to the following:
// {
//   name: 'Lola Hudson',
//   age: -12713,
//   email: [ 'calvinkoch@example.com', 'jakefernandez@example.com' ]
// }
```