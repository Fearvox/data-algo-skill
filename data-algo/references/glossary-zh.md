# 中英术语对照表 — Algorithm Glossary (CN/EN)

当用户用中文描述算法需求时，使用此表映射到对应的英文算法名和参考文件。

---

## 数据结构

| 中文 | English | Category | Reference |
|------|---------|----------|-----------|
| 数组 | Array | — | built-in |
| 链表 | Linked List | structures | data-structures.md |
| 双向链表 | Doubly Linked List | structures | data-structures.md |
| 队列 | Queue | structures | data-structures.md |
| 栈 | Stack | structures | data-structures.md |
| 哈希表 / 散列表 | Hash Table / Hash Map | structures | data-structures.md |
| 堆 | Heap (Min/Max) | structures | data-structures.md |
| 优先队列 | Priority Queue | structures | data-structures.md |
| 字典树 / 前缀树 | Trie / Prefix Tree | structures | data-structures.md |
| 二叉查找树 / 二叉搜索树 | Binary Search Tree (BST) | structures | data-structures.md |
| 平衡二叉树 / AVL 树 | AVL Tree | structures | data-structures.md |
| 红黑树 | Red-Black Tree | structures | data-structures.md |
| 线段树 | Segment Tree | structures | data-structures.md |
| 树状数组 / 二叉索引树 | Fenwick Tree / BIT | structures | data-structures.md |
| 图 | Graph | structures | data-structures.md |
| 并查集 | Disjoint Set / Union-Find | structures | data-structures.md |
| 布隆过滤器 | Bloom Filter | structures | data-structures.md |
| LRU 缓存 | LRU Cache | structures | data-structures.md |

## 排序算法

| 中文 | English | Reference |
|------|---------|-----------|
| 冒泡排序 | Bubble Sort | algorithms.md |
| 选择排序 | Selection Sort | algorithms.md |
| 插入排序 | Insertion Sort | algorithms.md |
| 希尔排序 | Shell Sort | algorithms.md |
| 归并排序 | Merge Sort | algorithms.md |
| 快速排序 / 快排 | Quick Sort | algorithms.md |
| 堆排序 | Heap Sort | algorithms.md |
| 计数排序 | Counting Sort | algorithms.md |
| 基数排序 | Radix Sort | algorithms.md |
| 桶排序 | Bucket Sort | algorithms.md |

## 搜索算法

| 中文 | English | Reference |
|------|---------|-----------|
| 线性搜索 / 顺序查找 | Linear Search | algorithms.md |
| 二分查找 / 二分搜索 | Binary Search | algorithms.md |
| 跳跃搜索 | Jump Search | algorithms.md |
| 插值搜索 | Interpolation Search | algorithms.md |
| 深度优先搜索 / DFS | Depth-First Search | algorithms.md |
| 广度优先搜索 / BFS | Breadth-First Search | algorithms.md |

## 图算法

| 中文 | English | Reference |
|------|---------|-----------|
| 最短路径 | Shortest Path | algorithms.md |
| 戴克斯特拉算法 | Dijkstra | algorithms.md |
| 贝尔曼-福特算法 | Bellman-Ford | algorithms.md |
| 弗洛伊德算法 | Floyd-Warshall | algorithms.md |
| 最小生成树 | Minimum Spanning Tree | algorithms.md |
| 克鲁斯卡尔算法 | Kruskal's | algorithms.md |
| 普里姆算法 | Prim's | algorithms.md |
| 拓扑排序 | Topological Sort | algorithms.md |
| 强连通分量 | Strongly Connected Components | algorithms.md |
| 关节点 / 割点 | Articulation Points | algorithms.md |
| 桥 | Bridges | algorithms.md |
| 欧拉路径 / 回路 | Eulerian Path/Circuit | algorithms.md |
| 哈密顿回路 | Hamiltonian Cycle | algorithms.md |
| 旅行商问题 | Travelling Salesman (TSP) | algorithms.md |
| 环检测 | Cycle Detection | algorithms.md |

## 字符串算法

| 中文 | English | Reference |
|------|---------|-----------|
| 汉明距离 | Hamming Distance | algorithms.md |
| 回文 / 回文串 | Palindrome | algorithms.md |
| 编辑距离 / 莱文斯坦距离 | Levenshtein Distance | algorithms.md |
| 模式匹配 | Pattern Matching (KMP/Z/Rabin-Karp) | algorithms.md |
| 最长公共子串 | Longest Common Substring | algorithms.md |
| 正则匹配 | Regular Expression Matching | algorithms.md |

## 数学算法

| 中文 | English | Reference |
|------|---------|-----------|
| 位运算 | Bit Manipulation | algorithms.md |
| 阶乘 | Factorial | algorithms.md |
| 斐波那契数 | Fibonacci | algorithms.md |
| 质数 / 素数检测 | Primality Test | algorithms.md |
| 埃拉托色尼筛法 | Sieve of Eratosthenes | algorithms.md |
| 欧几里得算法 / 辗转相除法 | Euclidean Algorithm (GCD) | algorithms.md |
| 最小公倍数 | LCM | algorithms.md |
| 快速幂 | Fast Powering | algorithms.md |
| 帕斯卡三角 / 杨辉三角 | Pascal's Triangle | algorithms.md |
| 矩阵运算 | Matrix Operations | algorithms.md |
| 离散傅里叶变换 | DFT / FFT | algorithms.md |

## 算法范式

| 中文 | English | Reference |
|------|---------|-----------|
| 暴力法 / 穷举法 | Brute Force | paradigms.md |
| 贪心算法 | Greedy | paradigms.md |
| 分治法 | Divide and Conquer | paradigms.md |
| 动态规划 / DP | Dynamic Programming | paradigms.md |
| 回溯法 | Backtracking | paradigms.md |
| 双指针 | Two Pointers | paradigms.md |
| 滑动窗口 | Sliding Window | paradigms.md |
| 单调栈 | Monotonic Stack | paradigms.md |
| 前缀和 | Prefix Sums | paradigms.md |
| 二分答案 | Binary Search on Answer | paradigms.md |

## 常见口语表达 → 算法映射

| 用户可能说 | 实际需要 |
|-----------|---------|
| "太慢了" / "跑不动" | 复杂度分析 → 算法优化 |
| "去重" | Hash Set / Hash Map dedup |
| "排序" / "按 XX 排" | Sorting algorithm selection |
| "找最大/最小的 K 个" | Heap / Quick Select (Top-K) |
| "缓存" / "存起来别重复请求" | LRU Cache / Hash Map + TTL |
| "有没有环" / "检测循环" | Cycle Detection (DFS / Union-Find) |
| "最短路" / "最快怎么走" | Dijkstra / BFS / Bellman-Ford |
| "依赖顺序" / "先做什么后做什么" | Topological Sort |
| "子串匹配" / "搜关键词" | KMP / Rabin-Karp / Trie |
| "前缀搜索" / "自动补全" | Trie |
| "区间查询" / "范围求和" | Segment Tree / Fenwick Tree / Prefix Sums |
| "频率统计" / "出现次数" | Hash Map counting |
| "连通性" / "分组" | Union-Find / BFS/DFS |
| "装满背包" / "预算内最大化" | Knapsack (DP) |
| "所有组合" / "所有排列" | Backtracking |
