<p align="center"><a href="README.md">English</a> | <strong>中文</strong></p>

<h1 align="center">data-algo-skill</h1>

<p align="center">
  <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> 算法顾问技能。<br>
  诊断瓶颈，推荐数据结构，实现修复，<br>
  将每次决策归档到项目级算法档案。
</p>

---

## 工作流程

```
诊断  →  推荐  →  决策  →  交付
```

| 阶段 | 做什么 |
|------|--------|
| **诊断** | 读代码，定位瓶颈，推断约束（输入规模、内存、读写比） |
| **推荐** | 2-3 个方案排列，附 Big-O 和 trade-off |
| **决策** | 问你选哪个——如果某个方案明显占优，直接上 |
| **交付** | 在你的代码库里实现，跑构建/测试，归档决策 |

两种模式：**Standard**（有 trade-off 时走完整流程）和 **Express**（只有一个明显解时直接实现）。

### 算法档案 `.algo-profile/`

每次非平凡的算法决策归档到项目目录，跨 session 持久化：

```
.algo-profile/
├── README.md              # 自动生成索引
├── structures/
│   └── lru-cache.md
├── sorting/
│   └── timsort-engagement.md
└── optimization/
    └── sliding-window.md
```

每张卡片记录：选了什么、为什么、备选方案、复杂度、用在哪里。同样的模式再次出现时，技能会复用已有方案。

---

## 安装

#### 全局安装（所有项目）

```bash
git clone https://github.com/Fearvox/data-algo-skill.git
cp -r data-algo-skill/data-algo ~/.claude/commands/data-algo
cp -r data-algo-skill/data-algo-viz ~/.claude/commands/data-algo-viz
```

#### 可选分支

```bash
# 竞赛编程（ICPC/OI/Codeforces）
cp -r data-algo-skill/data-algo-competitive ~/.claude/commands/data-algo-competitive

# 系统设计（负载均衡、限流、共识）
cp -r data-algo-skill/data-algo-system ~/.claude/commands/data-algo-system

# 社交平台模式（排序、信号、内容审核）
cp -r data-algo-skill/data-algo-social ~/.claude/commands/data-algo-social
```

#### 项目级安装

```bash
cp -r data-algo-skill/data-algo .claude/commands/data-algo
```

#### 可视化初始化

```bash
cd ~/.claude/commands/data-algo-viz/scripts && npm install
```

需要 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) + Node.js 20+（可视化用）。

---

## 使用

在 Claude Code 对话中自动触发：

| 你说 | 技能做什么 |
|------|-----------|
| "这个函数在 5000 条记录下太慢了" | 诊断 O(n²) 瓶颈，推荐 HashMap + sort，实现 |
| "需要缓存——最多 200 条，10 分钟 TTL" | 推荐 TTL-LRU Cache，实现，创建档案卡片 |
| "和之前的频率统计一样的模式" | 查 `.algo-profile/`，复用已有方案 |
| "优化这个嵌套循环" | 识别复杂度，提出替代方案 |

#### 触发关键词

| 语言 | 关键词 |
|------|--------|
| 中文 | `太慢了` · `优化` · `数据结构` · `排序` · `搜索` · `缓存` · `去重` · `遍历` |
| English | `optimize` · `bottleneck` · `Big-O` · `data structure` · `cache` · `sort` · `search` · `dedup` |
| 模式 | sliding window · two pointers · BFS/DFS · DP · greedy · backtracking |

---

## 技能分支

### data-algo（核心）

317 个算法，30 个领域，32 种数据结构，5 个参考文件。

| 文件 | 内容 |
|------|------|
| `data-structures.md` | 32 种数据结构——选择矩阵 + 适用/不适用场景 |
| `algorithms.md` | 317 个算法：排序、搜索、图、网络流、字符串、数学、DP、ML、密码学、几何、流式处理等 30 个领域 |
| `paradigms.md` | 暴力、贪心、分治、DP、回溯的决策流程图 + 常用模式 |
| `big-o.md` | 增长率表、DS 操作复杂度、排序对比、计算辅助工具 |
| `glossary-zh.md` | 89+ 中英术语映射 + 口语→算法查找（"太慢了" → 复杂度分析，"去重" → Hash Set） |

### data-algo-social

将 Twitter/X 开源推荐系统的模式应用到社交平台项目。6 个参考文件，附 TypeScript 实现和三级规模适配（hobby / growth / scale）。

| 文件 | 内容 |
|------|------|
| `signal-collection.md` | 12 种信号类型，采集架构，限流器 + 熔断器模式 |
| `candidate-generation.md` | SimClusters 社区检测，多源混合，热度检测 |
| `ranking-pipeline.md` | 两阶段排序（轻→重），~6000 特征分类，多样性混合 |
| `content-classification.md` | 倒排索引主题提取，CJK 分词器，SimHash 去重 |
| `graph-analysis.md` | PageRank 声誉评分，增长速度，Z-score 异常检测 |
| `trust-safety.md` | 多层内容过滤，质量评分，机器人检测，PII 脱敏 |

| 语言 | 关键词 |
|------|--------|
| 中文 | `采集` · `推荐算法` · `信号` · `内容分类` · `热度` · `信息流` · `粉丝` · `互动` |
| English | `collector` · `ranking` · `feed` · `timeline` · `signal` · `engagement` · `content quality` · `spam` |

### data-algo-competitive

竞赛编程模板，适用于 ICPC、Codeforces、OI。6 个参考文件，C++ 模板格式，附复杂度分析。

| 文件 | 内容 |
|------|------|
| `segment-trees.md` | 线段树、树状数组、根号分块、莫队算法 |
| `string-algorithms.md` | Aho-Corasick、后缀自动机、Z-function、KMP、Manacher |
| `number-theory.md` | FFT/NTT、模运算、Euler's totient、Miller-Rabin |
| `advanced-graphs.md` | 重链剖分、点分治、LCA、欧拉序 |
| `advanced-structures.md` | Li Chao 树、link-cut 树、可持久化线段树、小波树 |
| `geometry.md` | 凸包技巧、半平面交、Voronoi 图、Minkowski 和 |

| 语言 | 关键词 |
|------|--------|
| 中文 | `线段树` · `树状数组` · `快速傅里叶` · `后缀自动机` · `重链剖分` · `点分治` · `凸包` · `竞赛` |
| English | `segment tree` · `fenwick` · `FFT` · `NTT` · `suffix automaton` · `centroid decomposition` · `HLD` · `convex hull trick` |

### data-algo-system

生产级系统设计算法。6 个参考文件，附实现和三级规模适配（hobby / growth / scale）。

| 文件 | 内容 |
|------|------|
| `load-balancing.md` | 一致性哈希、虚拟节点、加权轮询、最少连接 |
| `rate-limiting.md` | Token bucket、滑动窗口、漏桶、分布式限流 |
| `caching-strategies.md` | Cache-aside、write-through、write-behind、LRU/LFU 驱逐、缓存雪崩防护 |
| `data-partitioning.md` | 哈希分片、范围分区、一致性哈希、再平衡策略 |
| `consensus-replication.md` | Raft、Paxos、leader 选举、日志复制、脑裂防护 |
| `probabilistic-structures.md` | Bloom filter、Count-Min Sketch、HyperLogLog、Skip List、布谷鸟过滤器 |

| 语言 | 关键词 |
|------|--------|
| 中文 | `负载均衡` · `限流` · `缓存策略` · `分片` · `一致性` · `副本` · `分布式` · `布隆过滤器` |
| English | `load balancer` · `rate limit` · `caching` · `sharding` · `consensus` · `replication` · `distributed` · `bloom filter` |

### data-algo-viz

将算法分析渲染为终端 UI（通过 [`@json-render/ink`](https://github.com/vercel-labs/json-render)）或自包含 HTML 报告 + Playwright 截图。

| 可视化 | 时机 | 输出 |
|--------|------|------|
| 复杂度对比 | 推荐阶段后 | 不同输入规模下的增长率 Bar Chart |
| 优化前后 | 交付后 | 加速倍数进度条 |
| 算法档案 | 按需 | 项目所有算法卡片表格 |
| Benchmark | Eval 后 | 通过率条形图 + 逐项分解 |
| HTML 报告 | 完整分析后 | 暗色仪表盘 + PNG 截图 |

```
data-algo — Benchmark
─────────────── Overall Pass Rate ───────────────
With Skill ████████████████████████████████████████ 100%
Baseline   ██████████████████████░░░░░░░░░░░░░░░░░  57%
  +43% pass rate  |  14/14 vs 8/14 assertions
```

---

## Benchmark

3 个测试场景，对比技能 vs. 基线（无技能）：

| 场景 | 有技能 | 基线 | 差异 |
|------|--------|------|------|
| 性能优化 | 100% (5/5) | 60% (3/5) | +40% |
| 缓存实现 | 100% (5/5) | 80% (4/5) | +20% |
| 档案复用 | 100% (4/4) | 25% (1/4) | +75% |
| **整体** | **100%** | **57%** | **+43%** |

主要差异：结构化推荐格式、`.algo-profile/` 创建和复用、复杂度标记准确性。

---

## 项目结构

```
data-algo-skill/
├── data-algo/                       # 核心技能 — 317 算法 + 32 数据结构
│   ├── SKILL.md
│   └── references/                  # 5 个文件
├── data-algo-social/                # 社交平台模式
│   ├── SKILL.md
│   └── references/                  # 6 个文件
├── data-algo-competitive/           # 竞赛编程
│   ├── SKILL.md
│   └── references/                  # 6 个文件
├── data-algo-system/                # 系统设计
│   ├── SKILL.md
│   └── references/                  # 6 个文件
├── data-algo-viz/                   # 可视化
│   ├── SKILL.md
│   ├── scripts/                     # render.mjs + package.json
│   ├── templates/                   # JSON spec + HTML 报告模板
│   └── references/                  # 1 个文件
├── evals/                           # Benchmark 测试套件
│   └── evals.json
├── data-algo.skill                  # 打包技能文件
├── data-algo-viz.skill              # 打包可视化技能文件
├── ROADMAP.md
├── README.md
└── README-zh.md
```

---

## 知识来源

24 个参考文件，从 12 个来源整理：

| 来源 | Stars | 提取内容 |
|------|-------|----------|
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | 219K+ | 几何、压缩、量子、图像处理算法 |
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | 190K+ | 核心算法实现 + 复杂度数据 |
| [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm) | 133K+ | 解题思维框架，中文原生讲解 |
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | 81K+ | 系统设计可视化 |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | 生产级社交平台推荐模式 |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | 42K+ | 系统设计算法实现 |
| [TheAlgorithms/JavaScript](https://github.com/TheAlgorithms/JavaScript) | 34K+ | 排序、几何、元胞自动机、哈希 |
| [TheAlgorithms/C++](https://github.com/TheAlgorithms/C-Plus-Plus) | 31K+ | 图算法、DP、数据结构 |
| [OI-wiki](https://oi-wiki.org) | 26K+ | 中文竞赛编程百科 |
| [keon/algorithms](https://github.com/keon/algorithms) | 25K+ | 图论、数论、压缩、流式处理 |
| [williamfiset/Algorithms](https://github.com/williamfiset/Algorithms) | 18K+ | 深度图论、网络流 |
| [cp-algorithms](https://cp-algorithms.com) | 10K+ | 竞赛编程参考（e-maxx.ru） |

可视化由 [vercel-labs/json-render](https://github.com/vercel-labs/json-render) 驱动。

---

## 贡献

详见 [ROADMAP.md](ROADMAP.md)。

| 做什么 | 怎么做 |
|--------|--------|
| **报告复杂度错误** | 开 issue，附正确 Big-O 和来源链接 |
| **添加技能分支** | 按现有分支结构创建 `data-algo-<domain>/` |
| **改进中文术语表** | 在 `glossary-zh.md` 中添加术语和口语映射 |
| **报告 Bug** | 描述：你说了什么、发生了什么、应该发生什么 |

#### PR 检查项

- [ ] 无重复条目（先查现有参考文件）
- [ ] Big-O 用大写 `O`，不是零
- [ ] 注明来源
- [ ] 如涉及中文术语，更新 glossary-zh.md

---

## License

MIT
