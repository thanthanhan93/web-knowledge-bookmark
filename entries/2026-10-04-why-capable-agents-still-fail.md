---
id: "2026-10-04-why-capable-agents-still-fail"
url: "https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-01-why-capable-agents-still-fail/"
title: "Why Capable Agents Still Fail"
summary: "Bài lecture giải thích tại sao model AI mạnh vẫn thất bại trong thực tế — vấn đề cốt lõi nằm ở harness engineering chứ không phải model. Giới thiệu 5 lớp phòng vệ (defense layers) và diagnostic feedback loop."
tags:
  - "engineering/ai-agent"
  - "engineering/harness-engineering"
  - "platform/anthropic"
source_type: "course"
language: "en"
saved_at: "2026-10-04"
notes: "Rất quan trọng cho việc cấu hình AGENTS.md và agent autonomy. Cần xem tiếp lecture 02-14."
---

## Key Takeaways
- Khi AI agent thất bại, 80% nguyên nhân là do harness: context window pollution, ambiguous tools, thiếu guardrails.
- 5 Lớp phòng vệ gồm: Prompt contract, Context compression, Tool schema validation, Execution sandbox, và Runtime reflection.
- Cần xây dựng feedback loop liên tục thay vì chỉ đo benchmark một lần.
