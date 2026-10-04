# Knowledge Vault — Requirements

> Utility tool để lưu trữ & tổ chức tài liệu tìm được online.
> Mục đích: bookmark thông minh + tóm tắt ý chính để tìm lại nhanh.

---

## 1. Tổng quan hệ thống

| Thành phần | Vai trò |
|---|---|
| **Markdown files** (`entries/`) | Source of truth — mỗi entry là 1 file `.md` với YAML frontmatter |
| **JSON index** (`entries/_index.json`) | Auto-generated từ markdown — cho search/filter nhanh, rebuild được |
| **Antigravity skill** (`skill/`) | SKILL.md + scripts — thêm, phân loại, tìm kiếm tài liệu qua chat |
| **Web UI** (`index.html` + `style.css` + `app.js`) | Browse, search, filter trực quan trên trình duyệt |

> **Nguyên tắc**: Repo là **self-contained** — toàn bộ (data, skill, scripts, UI) nằm trong repo.
> Trên mỗi máy, chỉ cần clone repo + symlink (hoặc copy) `skill/` vào `.agents/skills/` của workspace.

---

## 2. Data Model

### 2.1 Entry Schema (Markdown frontmatter)

Mỗi entry là 1 file `.md` trong `projects/web-knowledge-bookmark/entries/` với YAML frontmatter:

```yaml
---
id: "2026-10-04-harness-engineering-lecture-01"
url: "https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-01-why-capable-agents-still-fail/"
title: "Why Capable Agents Still Fail"
summary: "Bài lecture giải thích tại sao model mạnh vẫn fail — vấn đề nằm ở harness, không phải model. Giới thiệu 5 defense layers và diagnostic loop."
tags:
  - "engineering/ai-agent"
  - "engineering/harness-engineering"
  - "platform/anthropic"
source_type: "course"
language: "en"
saved_at: "2026-10-04"
notes: "Rất relevant cho cách mình setup AGENTS.md. Xem thêm lecture 02-14."
---

<!-- Body (optional): extended notes, quotes, excerpts -->
```

#### Các field

| Field | Bắt buộc | Mô tả |
|---|---|---|
| `id` | ✅ | Unique ID, format: `YYYY-MM-DD-slug` |
| `url` | ✅ | URL gốc của tài liệu |
| `title` | ✅ | Tiêu đề — auto-extract từ page hoặc nhập tay |
| `summary` | ✅ | Tóm tắt ngắn 2-3 câu về nội dung chính (AI-friendly) |
| `tags` | ✅ | Mảng tags với hierarchy dùng `/` (ví dụ: `engineering/harness-engineering`) |
| `source_type` | ✅ | Loại tài liệu: `blog`, `course`, `paper`, `video`, `docs`, `tool`, `thread`, `repo` |
| `language` | ❌ | Ngôn ngữ nội dung: `en`, `vi`, ... Default: `en` |
| `saved_at` | ✅ | Ngày lưu, format `YYYY-MM-DD` |
| `notes` | ❌ | Ghi chú cá nhân — tại sao lưu, liên quan đến gì |

#### Body (phần dưới frontmatter)

Tùy chọn — có thể chứa:
- Extended notes
- Trích dẫn quan trọng từ bài viết
- Key takeaways dạng bullet points
- Liên kết đến các entries liên quan

### 2.2 Tag Hierarchy

Tags dùng `/` để biểu diễn quan hệ cha-con, **giới hạn tối đa 2 levels**: `category/topic`.

Khi cần chi tiết hơn → gắn **nhiều tags** thay vì nesting sâu.

```
engineering/
├── harness-engineering
├── ai-agent
├── prompt-engineering
└── devops
platform/
├── anthropic
├── openai
├── google
└── github
ops/
├── deployment
├── monitoring
└── ci-cd
concept/
├── architecture
├── design-pattern
└── mental-model
```

#### Constraint

- **Max 2 levels**: `category/topic` — không cho phép `a/b/c`
- Khi cần chi tiết hơn, gắn nhiều tags. Ví dụ: thay vì `engineering/ai-agent/harness-engineering`, gắn:
  - `engineering/harness-engineering`
  - `engineering/ai-agent`
- Skill sẽ validate và từ chối tag có > 2 levels

#### Cách filter theo hierarchy (prefix matching)

| Filter query | Match logic | Kết quả |
|---|---|---|
| `engineering` | `tag === "engineering" \|\| tag.startsWith("engineering/")` | Tất cả entries thuộc engineering |
| `engineering/harness-engineering` | exact match | Chỉ entries gắn tag chính xác |
| `platform` | `tag.startsWith("platform/")` | Tất cả entries liên quan platform |

**Ví dụ thực tế**: Bài "Why Capable Agents Still Fail" có tags:
```yaml
tags:
  - "engineering/harness-engineering"
  - "engineering/ai-agent"
  - "platform/anthropic"
```
→ Filter `engineering` ✅, filter `engineering/ai-agent` ✅, filter `platform` ✅, filter `ops` ❌

#### Tag tree file (`entries/_tags.json`)

File `projects/web-knowledge-bookmark/entries/_tags.json` lưu tag tree:

```json
{
  "engineering": {
    "children": ["harness-engineering", "ai-agent", "prompt-engineering", "devops"],
    "description": "Software engineering topics"
  },
  "platform": {
    "children": ["anthropic", "openai", "google", "github"],
    "description": "AI platforms & services"
  },
  "ops": {
    "children": ["deployment", "monitoring", "ci-cd"],
    "description": "Operations & infrastructure"
  },
  "concept": {
    "children": ["architecture", "design-pattern", "mental-model"],
    "description": "Concepts & frameworks"
  }
}
```

> Với 2 levels, `children` quay lại dạng flat array — đơn giản, dễ maintain.

Tag tree phát triển dần — khi thêm tag mới, skill gợi ý vị trí trong hierarchy hoặc tạo category mới.

### 2.3 JSON Index (`_index.json`)

Auto-generated từ tất cả markdown files. Mục đích: search/filter nhanh mà không cần parse từng file.

```json
{
  "version": 1,
  "generated_at": "2026-10-04T21:00:00+02:00",
  "entries": [
    {
      "id": "2026-10-04-harness-engineering-lecture-01",
      "url": "https://...",
      "title": "Why Capable Agents Still Fail",
      "summary": "...",
      "tags": ["engineering/ai-agent", "engineering/harness-engineering"],
      "source_type": "course",
      "language": "en",
      "saved_at": "2026-10-04",
      "file": "entries/2026-10-04-harness-engineering-lecture-01.md"
    }
  ],
  "tag_tree": { "...see _tags.json..." }
}
```

> `_index.json` cũng embed tag_tree để Web UI chỉ cần fetch 1 file duy nhất.

---

## 3. Antigravity Skill: `knowledge-vault`

### 3.1 Vị trí

`.agents/skills/knowledge-vault/SKILL.md` (symlink hoặc copy từ `<repo>/skill/SKILL.md`)

File gốc nằm trong repo: `skill/SKILL.md`

### 3.2 Các thao tác (operations)

#### `add` — Thêm entry mới

Trigger: user gửi URL hoặc nói "lưu link này", "bookmark này"

Workflow:
1. Nhận URL từ user
2. Fetch page → auto-extract title
3. AI tóm tắt nội dung (summary)
4. Gợi ý tags dựa trên nội dung + tag tree hiện có (`_tags.json`)
5. Hỏi user xác nhận/chỉnh sửa tags & notes
6. Tạo file markdown trong `data/knowledge/`
7. Rebuild `_index.json`

#### `search` — Tìm kiếm

Trigger: user nói "tìm ...", "search ...", "có gì về ..."

Workflow:
1. Nhận query từ user
2. Search trong `_index.json` — match theo title, summary, tags, notes
3. Trả về danh sách kết quả, sắp xếp theo relevance
4. Nếu user cần chi tiết → đọc file markdown tương ứng

#### `list` — Liệt kê

Trigger: user nói "list tất cả", "xem theo tag ...", "filter ..."

Workflow:
1. Đọc `_index.json`
2. Filter theo tags, source_type, date range
3. Hiển thị dạng bảng/list

#### `tag-tree` — Xem/quản lý tag hierarchy

Trigger: user nói "xem tag tree", "thêm category mới"

Workflow:
1. Đọc `_tags.json`
2. Hiển thị tree structure
3. Thêm/sửa/xóa tags nếu user yêu cầu

#### `rebuild-index` — Rebuild JSON index

Trigger: user nói "rebuild index" hoặc khi phát hiện index outdated

Workflow:
1. Scan tất cả `.md` files trong `projects/web-knowledge-bookmark/entries/`
2. Parse frontmatter
3. Generate `_index.json` mới

---

## 4. Web UI

### 4.1 Tổng quan

Static HTML app (single page) — chạy local, đọc trực tiếp từ `_index.json`.

### 4.2 Tính năng

#### Search bar
- Full-text search qua title, summary, tags, notes
- Instant filtering khi gõ (client-side)

#### Filter panel
- Filter theo tag hierarchy (tree view, expandable)
- Filter theo source_type (checkbox group)
- Filter theo date range
- Kết hợp nhiều filters

#### Entry list
- Card-based layout — mỗi card hiển thị: title, summary snippet, tags (badges), source_type icon, date
- Click card → mở URL gốc (new tab)
- Hover card → xem full summary + notes

#### Tag cloud / Tag tree
- Hiển thị tất cả tags dạng tree hoặc cloud
- Click tag → filter entries theo tag đó
- Hiển thị count entries per tag

#### Stats
- Tổng số entries
- Entries theo tháng (mini chart)
- Top tags

### 4.3 Tech stack

- HTML + Vanilla CSS + Vanilla JavaScript
- Không framework, không build step
- Đọc `_index.json` qua fetch (cần chạy qua local server hoặc dùng file:// workaround)
- Dark mode by default, premium aesthetic

### 4.4 Responsive

- Desktop: sidebar filters + main content area
- Mobile: collapsible filter panel + stacked cards

---

## 5. Cấu trúc thư mục (repo root)

```
web-knowledge-bookmark/             # GitHub repo root
├── README.md                       # Setup & usage instructions
├── REQUIREMENTS.md                 # File này
│
├── entries/                        # Tất cả data nằm ở đây
│   ├── _index.json                 # Auto-generated index
│   ├── _tags.json                  # Tag hierarchy definition
│   └── *.md                        # Entry files
│
├── skill/                          # Antigravity skill (self-contained)
│   ├── SKILL.md                    # Skill instructions
│   └── scripts/
│       ├── add-entry.js            # Script tạo entry mới
│       ├── rebuild-index.js        # Script rebuild _index.json
│       └── search.js               # Script search (CLI fallback)
│
├── index.html                      # Web UI (GitHub Pages serves từ đây)
├── style.css                       # Styles
└── app.js                          # App logic
```

---

## 5.1 README.md — Nội dung cần có

README phục vụ việc setup trên máy mới. Cần có:

### Quick Start
```bash
# 1. Clone repo
git clone git@github.com:<user>/web-knowledge-bookmark.git
cd web-knowledge-bookmark

# 2. Install skill vào Antigravity workspace
#    Option A: Symlink (khuyến nghị — luôn sync với repo)
#    Windows:
mklink /D "<workspace>\.agents\skills\knowledge-vault" "%cd%\skill"
#    macOS/Linux:
ln -s "$(pwd)/skill" "<workspace>/.agents/skills/knowledge-vault"

#    Option B: Copy (không tự động sync)
cp -r skill/ <workspace>/.agents/skills/knowledge-vault/

# 3. Xong! Dùng skill trong Antigravity chat:
#    "lưu link https://... vào knowledge base"
```

### Usage
- **Thêm entry**: Paste URL trong Antigravity chat
- **Xem Web UI**: Truy cập `https://<user>.github.io/web-knowledge-bookmark/`
- **Sync**: `git pull` trước khi thêm, `git push` sau khi thêm
- **Rebuild index**: `node skill/scripts/rebuild-index.js`

---

## 6. Deployment: GitHub Repo + GitHub Pages

### 6.1 Tổng quan

| Thành phần | Giải pháp |
|---|---|
| **Data storage** | GitHub repo riêng (private hoặc public) |
| **Web UI hosting** | GitHub Pages — serve từ root của repo |
| **Sync giữa các máy** | `git pull` / `git push` |
| **Truy cập Web UI** | URL GitHub Pages — từ bất kỳ thiết bị nào |

### 6.2 Workflow cross-device

```
[PC / MacBook]
    │
    ├── Antigravity skill `add` → tạo .md file + rebuild index
    ├── git add + commit + push
    │
    └── GitHub repo (đã update)
           │
           ├── GitHub Pages → Web UI tự động cập nhật
           │   (fetch _index.json qua HTTPS)
           │
           └── Máy khác: git pull → có data mới
```

### 6.3 Web UI fetch data

Web UI sẽ fetch `_index.json` từ **cùng domain GitHub Pages** (relative path):

```js
// app.js
const response = await fetch('./entries/_index.json');
const data = await response.json();
```

Không cần API server, không cần CORS config — tất cả là static files.

### 6.4 Skill tự động commit & push (tùy chọn)

Sau khi `add` entry, skill có thể:
1. Tạo file markdown
2. Rebuild `_index.json`
3. Hỏi user: "Commit & push lên GitHub luôn?"
4. Nếu yes → `git add . && git commit -m "Add: <title>" && git push`

### 6.5 Lưu ý

- **Private repo**: Web UI chỉ truy cập được nếu GitHub Pages được bật (free với GitHub Pro/org cho private repos)
- **Public repo**: Web UI truy cập được từ bất kỳ đâu, nhưng data cũng public
- **Conflict**: Nếu sửa trên 2 máy cùng lúc mà không pull trước → git merge conflict. Giảm thiểu bằng cách luôn `git pull` trước khi `add`

---

## 7. Ưu tiên triển khai (phasing)

### Phase 1 — Core (MVP)
- [ ] GitHub repo setup + GitHub Pages config
- [ ] Entry schema & `entries/` directory structure
- [ ] `_tags.json` với initial categories
- [ ] Script `rebuild-index.js`
- [ ] Skill `knowledge-vault` — thao tác `add` và `rebuild-index`

### Phase 2 — Web UI
- [ ] Web UI: search bar, entry list, tag filter
- [ ] Dark mode, responsive layout, premium aesthetic
- [ ] Deploy lên GitHub Pages

### Phase 3 — Search & Polish
- [ ] Skill thao tác `search` và `list`
- [ ] Tag tree view trong Web UI
- [ ] Stats dashboard
- [ ] Skill thao tác `tag-tree`
- [ ] Auto-suggest tags khi thêm entry mới
- [ ] Skill tự động `git commit & push` sau khi add

---

## 8. Nguyên tắc thiết kế

1. **Markdown là source of truth** — index luôn rebuild được từ markdown files
2. **Tags 2 levels, nhiều tags** — `category/topic`, dùng nhiều tags thay vì nesting sâu
3. **AI-friendly metadata** — summary và notes viết đủ rõ để AI search ngữ nghĩa
4. **Minimal friction khi thêm** — chỉ cần paste URL, AI lo phần còn lại
5. **Human-readable storage** — mọi data đều đọc được bằng text editor thường
6. **Static-first** — không cần backend/API server, tất cả là static files trên GitHub Pages
7. **Cross-device** — git sync + Web UI truy cập từ bất kỳ đâu qua URL
