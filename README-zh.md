<h1 align="center">data-algo-skill</h1>

<p align="center">
  <a href="https://github.com/Fearvox/data-algo-skill"><img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill"></a>
  <a href="https://github.com/Fearvox/data-algo-skill"><img src="https://img.shields.io/badge/知识源-12-green" alt="12 Knowledge Sources"></a>
  <a href="https://github.com/Fearvox/data-algo-skill"><img src="https://img.shields.io/badge/算法-400%2B-orange" alt="400+ Algorithms"></a>
  <a href="https://github.com/Fearvox/data-algo-skill"><img src="https://img.shields.io/badge/Benchmark-100%25-brightgreen" alt="100% Benchmark"></a>
</p>

---

## 有一类问题，从来不缺答案。

你告诉 Claude："这段代码太慢了。"

它给你一个答案。也许是对的。

但一个真正的算法专家不会只给你答案——他会问你：瓶颈在哪里？你的数据规模是多少？你能接受多少空间换时间？然后他会给你两个方案，告诉你 tradeoff，让你选，替你实现，最后把这次决策记下来，因为下次还会遇到同样的问题。

data-algo-skill 就是这件事的实现。

---

## 从 57% 到 100%

这是唯一需要的数字。

基线通过率 57%。安装 data-algo-skill 之后：**100%**。+43%。

不是因为它记住了更多答案，而是因为它学会了正确的提问方式。

| 场景 | 基线 | data-algo |
|------|------|-----------|
| 性能诊断 | 60% (3/5) | **100%** (5/5) |
| 缓存实现 | 80% (4/5) | **100%** (5/5) |
| 档案复用 | 25% (1/4) | **100%** (4/4) |
| **整体** | **57%** | **100% (+43%)** |

---

## 核心猎杀流程

```
诊断 → 推荐 → 决策 → 交付
```

四步。没有废话。

1. **诊断** — 扫描代码，嗅出每一个 O(n^2) 的气息，定位复杂度瓶颈
2. **推荐** — 2-3 个方案并排，Big-O 对比，权衡说清楚
3. **决策** — 你选一个（或者瓶颈太明显，直接上 Express 模式跳过）
4. **交付** — 在你的代码库里实现，写入 `.algo-profile/` 归档

---

## 记忆，才是真正的护城河

`.algo-profile/` 目录。

每一次算法决策——你选了哪个方案，为什么，在什么场景下——都被持久化记录，跨 session 复用。

```
.algo-profile/
├── README.md                     # 自动生成索引
├── structures/
│   └── lru-cache.md
├── sorting/
│   └── timsort-engagement.md
└── optimization/
    └── sliding-window.md
```

三个月后同样的问题再次出现，Claude 不会重新分析。它会说：你上次做过这个选择，原因是 X，现在情况变了吗？

这不是搜索。这是积累。

---

## 五个技能分支

### data-algo — 主技能树

所有猎物的入口。317 个算法，32 种数据结构，5 个参考文件覆盖排序、搜索、图、动态规划、数据结构全谱。自适应深度——简单问题直接修，复杂问题走完整诊断流程。中英双语触发。

### data-algo-social — 社交平台猎场

Twitter/X 开源推荐系统（62K★）的六套狩猎策略：信号采集、SimClusters 聚类、两阶段排序管线、内容分类、PageRank 影响力、信任安全。如果你要碰推荐系统，你需要的模式在这里。

### data-algo-competitive — 竞赛战场

线段树、FFT/NTT、重链剖分、后缀自动机、凸包技巧。6 个参考文件。这个分支不适合普通猎手——如果你知道你需要它，你知道怎么用。

### data-algo-system — 系统设计领地

一致性哈希、限流（Token Bucket / Sliding Window）、缓存策略（LRU / LFU / ARC）、数据分片、Raft 共识、概率数据结构（Bloom Filter / HyperLogLog）。系统设计面试和生产级决策的共同语言。

### data-algo-viz — 决策可见

终端可视化（ink）、HTML 暗色报告、Playwright 截图归档。让算法选择的过程留下痕迹，而不是消失在对话历史里。

| 可视化类型 | 时机 | 输出 |
|-----------|------|------|
| 复杂度对比 | 推荐阶段 | 不同输入规模下的 Bar Chart |
| 优化前后 | 交付阶段 | 加速倍数进度条 |
| 算法档案 | 按需 | 项目所有算法卡片 |
| HTML 报告 | 完整分析后 | 暗色仪表盘 + PNG 截图 |

---

## 知识库

24 个参考文件，12 个知识源，400+ 算法/模式。

| 知识源 | Stars | 贡献 |
|--------|-------|------|
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | 219K+ | 几何、压缩、量子、图像处理 |
| [javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | 190K+ | 核心算法实现 + 复杂度数据 |
| [labuladong 算法笔记](https://github.com/labuladong/fucking-algorithm) | 133K+ | 思维框架与模式识别 |
| [ByteByteGo](https://github.com/ByteByteGoHq/system-design-101) | 81K+ | 系统设计可视化 |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | 生产级推荐系统 |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | 42K+ | 系统设计算法实现 |
| 其他 6 个源 | 100K+ | 图论、竞赛、字符串、流式处理 |

---

## 安装

```bash
git clone https://github.com/Fearvox/data-algo-skill.git

# 主技能（必选）
cp -r data-algo-skill/data-algo ~/.claude/commands/data-algo

# 可视化（推荐）
cp -r data-algo-skill/data-algo-viz ~/.claude/commands/data-algo-viz
cd ~/.claude/commands/data-algo-viz/scripts && npm install

# 专项分支（按需）
cp -r data-algo-skill/data-algo-social      ~/.claude/commands/data-algo-social
cp -r data-algo-skill/data-algo-competitive  ~/.claude/commands/data-algo-competitive
cp -r data-algo-skill/data-algo-system       ~/.claude/commands/data-algo-system
```

要求：[Claude Code](https://docs.anthropic.com/en/docs/claude-code) + Node.js 20+（可视化）

---

## 使用

在 Claude Code 中直接对话即可触发：

```
"这个搜索函数在 10 万条数据下很慢"       → 诊断 + 推荐 + 实现
"帮我用 SimClusters 做内容推荐"           → data-algo-social 接管
"线段树区间更新怎么写"                    → data-algo-competitive 响应
"optimize the recommendation feed"       → 中英双语，自动识别
"scan this project for algorithm opportunities" → 全项目健康度扫描
```

---

## 项目结构

```
data-algo-skill/
├── data-algo/              # 主技能 — 317 算法 + 32 数据结构
├── data-algo-social/       # 社交推荐 — Twitter 模式
├── data-algo-competitive/  # 竞赛编程 — 线段树/FFT/图论
├── data-algo-system/       # 系统设计 — 限流/缓存/共识
├── data-algo-viz/          # 可视化 — ink + HTML + 截图
├── evals/                  # Benchmark 测试套件
├── ROADMAP.md
└── README.md
```

---

## 贡献

欢迎提交知识源、参考文件或新技能分支。详见 [ROADMAP.md](ROADMAP.md)。

PR 要求：无重复条目，Big-O 用大写 `O`，注明来源，附适用分支。

---

## One more thing.

大多数工具让 AI 变得更快。data-algo-skill 试图让 AI 变得更正确。

速度可以被购买。判断力需要被培养。

---

MIT License
