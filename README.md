# proto-mock

[English Version](./README.en.md)

`proto-mock` 是一个能够为给定的 Protobuf 消息类型生成随机数据的 Node.js 库。

## 安装

```bash
npm install proto-mock
```

## 使用

```typescript
import { generateMockData } from 'proto-mock';

const mockData = await generateMockData('path/to/proto/file.proto', 'MyMessageType');
console.log(mockData);
```

### `generateMockData(protoFilePath: string, messageType: string, options?: GenerateMockDataOptions): Promise<any>`

*   `protoFilePath` - 必选参数，Protobuf 文件的路径。
*   `messageType` - 必选参数，消息类型的名称。
*   `options` - 可选参数，生成随机数据的设置。

返回值：一个 Promise，用于异步返回生成的随机数据。

### `GenerateMockDataOptions`

*   `maxRepeatedLength` - 可选参数，指定生成的数组的最大长度，默认为 3。
*   `maxMapEntries` - 可选参数，指定生成的Map数据类型的最大长度，默认为 3。
*   `keepCase` - 可选参数，指定是否保留字段名的大小写，默认为 false（驼峰命名）。
*   `keyValueRange` - 可选参数，指定特定字段的取值范围，默认为 {}。

## 示例

假设有一个 `person.proto` 文件，定义了一个 `Person` 消息类型：

```protobuf
syntax = "proto3";

package example;

message Person {
  string name = 1;
  int32 age = 2;
  repeated string email = 3;
}
```

使用 `proto-mock` 可以为 `Person` 类型生成随机数据：

```typescript
import { generateMockData } from 'proto-mock';

const mockData = await generateMockData('path/to/person.proto', 'Person');
console.log(mockData);
// 输出类似如下的随机数据：
// {
//   name: 'Lola Hudson',
//   age: -12713,
//   email: [ 'calvinkoch@example.com', 'jakefernandez@example.com' ]
// }
```

通过 keyValueRange 可以控制特定字段的取值范围，确保生成的随机数据符合预期。

``` typescript
import { generateMockData } from 'proto-mock';

const options = {
  keyValueRange: {
    name: ['Alice', 'Bob'],
    age: [18, 21, 30]
  }
};

const mockData = await generateMockData('path/to/person.proto', 'Person', options);
console.log(mockData);
// 输出类似如下的随机数据：
// {
//   name: 'Alice',
//   age: 21,
//   email: [ 'calvinkoch@example.com', 'jakefernandez@example.com' ]
// }

```