# pbmock

"根据proto文件定义，mock对应的json数据

## 要求

_Node 10+_

## 安装

```shell
npm install -D proto-mock
```

## 使用

```
import { getMockData } from 'proto-mock';

getMockData(path.resolve(__dirname, '../pb/test.pb'), 'XxxRsp');
```

### getMockData(file, rspName, { code, message, enumMap }, config)

参数说明：

- file \[string\] pb文件绝对路径
- rspName \[string\] 想要返回的结构体名称
- code \[number\] 响应状态码，默认值：0
- message \[string\] 自定义message
- enumMap \[Object\] enumMap中每个key值对应一个数组，如果响应中存在相同key值则从数组中随机进行赋值
- config \[Object\] 其他配置
  - keepCase \[boolen\] false-转驼峰(默认) true-保持原样
  - listLength \[number\] 自定义数组长度  默认值：10

例子：
```
const enumMap = {
    Color: [ 'RED', 'GREEN', 'YELLOW', 'ORANGE' ]
};

getMockData(file, 'XxxRsp', { enumMap });
```
### setGlobalConfig(config)

设置全局配置(优先使用getMockData方法中的配置)

参数说明：

- config getMockData中config相同


## 版本记录

<details>
<summary>点击展开</summary>

### v0.0.1 2023-04-16 sullay

-   首次发布

</details>
