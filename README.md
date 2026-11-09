# 九畹 · 国兰清赏

一个介绍中国兰花（国兰）的全栈网站，含 **用户端** 与 **管理后台**。国风中式视觉，模块化结构，接口简洁，便于后续扩展。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Nuxt 3（SSR，纯 JavaScript，无 TypeScript） |
| UI | Vant 4 + Tailwind CSS 3 |
| 数据库 | PostgreSQL（当前使用 Prisma Postgres 云端实例） |
| ORM | Prisma 6 |
| 图片 | 七牛云对象存储 + CDN（服务端 sharp 压缩，CDN 按需裁剪 / webp） |
| 鉴权 | HMAC 签名 Token + HttpOnly Cookie（无额外依赖） |

## 功能

**用户端**

- 首页：轮播、品类导航、精选品种、兰文推荐、站点介绍
- 兰谱：按品类 / 关键词筛选，分页浏览
- 品种详情：图集、产地 / 花期 / 香气 / 难度 / 光照、详细介绍、同类推荐
- 品类：七大品类总览与分类列表
- 兰文：分类筛选、搜索、头条、上下篇、相关推荐
- 关于：站点介绍、数据展示、联系方式
- 分享：兰花详情与文章详情均支持微信好友 / 朋友圈 / 抖音 / 复制链接 / 生成二维码海报
- 404 定制页

**管理后台**（`/admin`）

- 登录 / 退出、修改密码
- 仪表盘：品种、文章、品类、浏览量统计与最近更新
- 品种管理：增删改查、图集、标签、推荐、草稿 / 发布
- 品类管理：增删改查、启用状态、排序
- 文章管理：增删改查、置顶、发布日期、HTML 正文
- 轮播管理：图片、链接、排序、显隐
- 站点设置：站点名称、SEO、关于文案、联系方式、备案信息、分享配置（公众号 AppID）
- 图片上传：封面 / 图集 / 轮播图支持点击或拖拽上传，服务端自动压缩后存入七牛云

## 快速开始

```bash
# 1. 安装依赖（Node.js >= 20）
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env：DATABASE_URL、NUXT_AUTH_SECRET、NUXT_PUBLIC_SITE_URL、七牛云四项密钥

# 3. 建表
npm run db:push        # 开发期快速同步；正式环境可用 npm run db:migrate

# 4. 写入演示数据（含管理员与示例内容）
npm run db:seed

# 5. 启动
npm run dev            # http://localhost:3000
```

### 环境变量

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 连接串，云端库需带 `sslmode=require` |
| `NUXT_AUTH_SECRET` | 登录令牌签名密钥，生产环境必须替换 |
| `NUXT_PUBLIC_SITE_URL` | 站点线上地址，用于分享链接、海报二维码、`og:image` 绝对地址 |
| `NUXT_QINIU_ACCESS_KEY` / `NUXT_QINIU_SECRET_KEY` | 七牛云密钥（仅服务端可用） |
| `NUXT_QINIU_BUCKET` / `NUXT_QINIU_REGION` | 存储空间与区域（华东 `z0`） |
| `NUXT_QINIU_CDN_DOMAIN` | 上传时拼装图片地址的 CDN 域名 |
| `NUXT_PUBLIC_QINIU_CDN_DOMAIN` | 同上，暴露给前端用于拼接裁剪参数 |

> 站点地址也可以直接在后台「站点设置 → 分享与开放」里填写，优先级高于环境变量。

默认管理员：`admin` / `admin123`，登录后请在「站点设置 → 账号安全」中修改。

## 目录结构

```
├─ assets/css/main.css        # 宣纸 / 墨绿 / 朱砂主题、正文排版、后台表单样式
├─ components/
│  ├─ common/                 # 前台通用组件（页头、页脚、卡片、分页、分享面板…）
│  ├─ home/                   # 首页轮播
│  └─ admin/                  # 后台通用组件（侧栏、面板、分页、图片上传）
├─ composables/
│  ├─ useSite.js              # 站点配置（全局注入）
│  ├─ useAdmin.js             # 后台登录态
│  ├─ useImage.js             # 七牛 CDN 裁剪 / webp 拼参
│  └─ useShare.js             # 分享：微信 JS-SDK / 复制 / canvas 海报
├─ layouts/
│  ├─ default.vue             # 前台布局
│  └─ admin.vue               # 后台布局
├─ middleware/admin-auth.global.js   # /admin/** 路由守卫
├─ pages/                     # 前台页面 + admin/* 后台页面
├─ plugins/vant.js            # Vant 全量注册
├─ prisma/
│  ├─ schema.prisma           # 数据模型
│  └─ seed.js                 # 演示数据
├─ server/
│  ├─ api/                    # 接口（按资源分目录）
│  ├─ middleware/admin-auth.js # /api/admin/** 统一鉴权
│  ├─ utils/                  # prisma / auth / 分页 / 字段归一化 / 七牛 / sharp 压缩
└─ utils/                     # 日期、数字、提示等前端工具
```

## 接口约定

- 成功：直接返回 JSON 数据（对象或 `{ list, total, page, pageSize, totalPages }`）
- 失败：`createError({ statusCode, message })`，前端读取 `error.data.message` 提示
- 列表分页统一为 `?page=1&pageSize=12`
- 前台只读取 `status = 'published'` 且品类 `isActive = true` 的数据
- 后台接口统一前缀 `/api/admin`，由 `server/middleware/admin-auth.js` 校验登录 Cookie

### 主要接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/home` | 首页聚合数据 |
| GET | `/api/orchids` | 品种列表，支持 `category` `keyword` `featured` `page` |
| GET | `/api/orchids/:slug` | 品种详情（含同类推荐，浏览量 +1） |
| GET | `/api/categories` | 品类列表（含品种数） |
| GET | `/api/categories/:slug` | 品类详情 + 该品类品种 |
| GET | `/api/articles` | 文章列表，支持 `category` `keyword` |
| GET | `/api/articles/:slug` | 文章详情（含上下篇、相关） |
| GET | `/api/settings` | 站点配置（键值对象） |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前登录用户 |
| GET | `/api/admin/stats` | 后台统计 |
| GET/POST | `/api/admin/orchids` | 品种列表 / 新增 |
| PUT/DELETE | `/api/admin/orchids/:id` | 修改 / 删除 |
| GET/POST | `/api/admin/articles` | 文章列表 / 新增 |
| PUT/DELETE | `/api/admin/articles/:id` | 修改 / 删除 |
| GET/POST | `/api/admin/categories` | 品类列表 / 新增 |
| PUT/DELETE | `/api/admin/categories/:id` | 修改 / 删除 |
| GET/POST | `/api/admin/banners` | 轮播列表 / 新增 |
| PUT/DELETE | `/api/admin/banners/:id` | 修改 / 删除 |
| PUT | `/api/admin/settings` | 批量保存站点配置 |
| PUT | `/api/admin/password` | 修改密码 |
| POST | `/api/admin/upload` | 图片上传（压缩后入七牛，返回 `url/key/width/height/size`） |
| GET | `/api/qrcode` | 二维码 PNG，`?text=链接&size=320` |
| GET | `/api/image-proxy` | 图片同源代理（海报 canvas 取图，仅放行本站与 CDN） |
| GET | `/api/wechat/signature` | 公众号 JS-SDK 签名，未配置时返回 `{ enabled: false }` |

## 数据模型

- `User` 管理员账号
- `Category` 品类（春兰 / 蕙兰 / 建兰 / 墨兰 / 寒兰 / 春剑 / 莲瓣兰）
- `Orchid` 品种（关联品类，含图集、标签、结构化属性、草稿状态）
- `Article` 文章（分类、置顶、发布时间）
- `Banner` 首页轮播
- `Setting` 站点配置键值对

## 二次开发

新增一个内容模块（例如「兰展」）：

1. `prisma/schema.prisma` 增加模型 → `npm run db:push`
2. `server/api/<模块>/` 增加前台读取接口
3. `server/api/admin/<模块>/` 增加后台 CRUD（复用 `server/utils/api.js` 的 `getPaging` `pagedList` `guard`）
4. `server/utils/payloads.js` 增加字段白名单函数
5. `pages/` 与 `pages/admin/` 增加页面，后台侧栏在 `components/admin/AdminNav.vue` 注册

## 图片与 CDN

上传链路：后台选择图片 → `POST /api/admin/upload` → **sharp 压缩**（按用途限制长边 1200～1920，JPEG q82、渐进式、去 EXIF、透明底压宣纸色）→ 七牛云 → 返回 CDN 地址。

访问链路：`composables/useImage.js` 对七牛图片自动追加 `?imageView2/2/w/{宽度}/format/webp/q/82`，列表缩略图只下载几十 KB；`composables/useShare.js` 对分享图改用 `format/jpg`（微信 / 抖音爬虫对 webp 支持一般）。

- 实测：1.7MB 原图 → 上传后 114KB；同一张图 440px webp 仅 16KB。
- 种子数据已指向七牛 CDN（`wubugimg.orchids.com.cn`），本地 `public/images/` 仍保留作为备份素材。
- 图片缺失或加载失败时，`SmartImage` 自动降级为水墨底纹。

## 分享

`components/common/ShareSheet.vue` + `composables/useShare.js`：

- **微信**：公众号 AppID / AppSecret 配置齐全时，自动加载 JS-SDK（`updateAppMessageShareData` / `updateTimelineShareData`），分享卡片显示标题、摘要与封面；未配置时弹「右上角 ··· 」引导蒙层。
- **抖音**：检测抖音内置浏览器 UA，给出「右上角分享」引导；其他环境复制链接提示粘贴，海报可直接发布为图文。
- **海报**：canvas 生成 750×1180 竖版海报（封面 + 标题 + 摘要 + 二维码 + 印章），支持下载 / 长按保存。图片经 `/api/image-proxy` 同源取用，避免画布跨域污染。
- **SEO**：详情页输出 `og:title` `og:description` `og:image` `og:url` `og:type`，微信、抖音、搜索引擎抓取链接时都有完整卡片信息。

## 部署

```bash
npm run build
node .output/server/index.mjs   # 环境变量写在 .env 或进程环境里
```

> 七牛 CDN 域名需在「域名管理」中开启 HTTPS 与图片处理（`imageView2`）；本项目已实测 `?imageView2/2/w/440/format/webp` 可用。
> 微信分享需把站点域名加入公众号「JS 接口安全域名」，否则 JS-SDK 会报 `invalid signature`。

- 生产环境务必设置 `NUXT_AUTH_SECRET`，并使用独立的数据库账号（仅授予该库权限）。
- 建议用 Nginx / Caddy 反向代理并启用 HTTPS，Cookie 在 `NODE_ENV=production` 下自动加 `Secure`。
- 首次部署执行 `npx prisma migrate deploy`（或 `db:push`）+ `npm run db:seed`。
