---
id: "2026-10-04-building-effective-agents-anthropic"
url: "https://www.anthropic.com/research/building-effective-agents"
title: "Building Effective Agents - Anthropic Research"
summary: "Hướng dẫn thực chiến từ Anthropic về kiến trúc xây dựng AI agents. Phân loại agent patterns phổ biến: Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, và Evaluator-Optimizer."
tags:
  - "engineering/ai-agent"
  - "concept/architecture"
  - "platform/anthropic"
source_type: "blog"
language: "en"
saved_at: "2026-10-04"
notes: "Tài liệu nền tảng khi thiết kế multi-agent workflow và subagent delegation."
---

## Patterns Tổng Kết
1. **Prompt Chaining**: Chia nhỏ chuỗi nhiệm vụ thành các bước tuần tự.
2. **Routing**: Phân loại input và điều hướng sang prompt/tool chuyên biệt.
3. **Parallelization**: Chạy đồng thời các tác vụ độc lập rồi tổng hợp kết quả.
4. **Orchestrator-Workers**: LLM trung tâm điều phối và tổng hợp kết quả từ các worker subagents.
5. **Evaluator-Optimizer**: Vòng lặp tự đánh giá và tinh chỉnh output dựa trên tiêu chí định sẵn.
