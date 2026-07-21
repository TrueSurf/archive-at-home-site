# Archive-at-Home

Archive-at-Home 是一个 e-hentai 归档链接解析平台。

## 平台能做什么

- **统一入口**：用户通过 API 提交请求并获取归档链接。
- **稳定响应**：重复请求会尽量复用已有结果，减少等待与重复消耗。
- **成本可见**：返回结果包含关键成本信息，便于控制使用开销。
- **协作扩展**：支持志愿节点接入，提升整体服务能力。

## 你可以如何使用

### 普通用户

1. 注册账号并获取 API Key。
2. 使用 API 发起解析请求。
3. 根据返回结果处理归档链接。

完整接口说明见 [Server 文档](/api/server)。

### 节点贡献者

从 [Releases](https://github.com/Archive-At-Home/archive-at-home/releases) 下载对应平台的二进制，或使用 Docker：

```bash
cd node
# 先创建 config.yaml 配置文件
docker-compose up -d
```

详细配置和部署方式请参考 [节点部署文档](/node)。

### 开发者接入

示例请求：

```bash
# 解析归档链接（使用返回的 api_key）
curl -X POST https://api.archive-at-home.org/api/v1/parse \
  -H "Authorization: Bearer sk-xxxxxxxxxxxx" \
  -H "X-Client: bot/tg-official" \
  -H "Content-Type: application/json" \
  -d '{"gallery_id":"3858751","gallery_key":"d3de60e849"}'
```

## 服务流程

1. 用户提交解析请求。
2. 平台分发任务并执行处理。
3. 平台返回归档结果并记录关键消耗信息。

## 文档入口

- [Server 文档](/api/server)：API 文档与接入说明。
- [Node 文档](/node)：节点部署、配置与故障排查。

## 鸣谢

本项目的开发得到了以下工具的帮助：

- [Claude](https://claude.ai) - Anthropic 开发的 AI 助手，协助架构设计和代码实现
- [GitHub Copilot](https://github.com/features/copilot) - AI 代码补全工具，提升开发效率
