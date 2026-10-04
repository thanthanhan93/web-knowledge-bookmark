---
name: knowledge-vault
description: "Lưu trữ, phân loại và tìm kiếm các tài liệu, bookmark online vào An's Bookmark Vault. Hoạt động trên mọi AI CLI (Claude Code, Antigravity, OpenCode, Cursor...)."
---

# Knowledge Vault Skill (An's Bookmark Vault)

Skill chuẩn hóa việc lưu trữ, phân loại và tìm kiếm bookmark/tài liệu nghiên cứu. 
Hoạt động tương thích trên mọi AI Agent CLI: **Claude Code**, **Antigravity CLI**, **OpenCode**, **Cursor**, **Codex**, **Gemini CLI**,...

---

## Cấu trúc dữ liệu & Vị trí thư mục

Agent tự động phát hiện đường dẫn dữ liệu theo thứ tự ưu tiên:
1. Nếu đang ở thư mục gốc của repository `web-knowledge-bookmark`:
   - Thư mục dữ liệu: `entries/`
   - File thẻ phân cấp: `entries/_tags.json`
   - File index: `entries/_index.json`
   - Script rebuild: `skill/scripts/rebuild-index.js`
2. Nếu đang ở workspace tổng hợp:
   - Thư mục dữ liệu: `projects/web-knowledge-bookmark/entries/`
   - Script rebuild: `projects/web-knowledge-bookmark/skill/scripts/rebuild-index.js` (hoặc trong thư mục skill cài đặt).

---

## Các thao tác hỗ trợ

### 1. Thêm mới tài liệu (`add`)
Khi người dùng yêu cầu: *"lưu link này"*, *"bookmark URL https://..."*, *"thêm bài viết vào knowledge base"*:

1. **Đọc nội dung web**:
   - Sử dụng công cụ web có sẵn của agent (ví dụ: `WebFetch` trên Claude Code, `read_url_content` trên Antigravity, hoặc chạy lệnh `curl` qua shell) để trích xuất tiêu đề và nội dung bài viết.
2. **Tóm tắt & Phân loại**:
   - Tóm tắt 2-3 câu ngắn gọn, súc tích về ý chính (`summary`).
   - Đọc file `_tags.json` để chọn hoặc đề xuất tags phù hợp. 
   - **Quy tắc Tag**: Tối đa 2 cấp dạng `category/topic` (ví dụ: `engineering/ai-agent`, `platform/anthropic`). Không dùng quá 2 dấu gạch chéo.
   - Xác định `source_type`: `blog` | `course` | `paper` | `docs` | `video` | `tool` | `repo` | `thread`.
3. **Xác nhận với người dùng**:
   - Hiển thị nhanh tóm tắt dự kiến: Title, Summary, Tags, Source Type, và Personal Notes (nếu có).
4. **Tạo file Markdown**:
   - Đặt tên file: `YYYY-MM-DD-slug.md` trong thư mục `entries/`.
   - Định dạng Frontmatter YAML:
     ```yaml
     ---
     id: "YYYY-MM-DD-slug"
     url: "https://..."
     title: "Tiêu đề bài viết"
     summary: "Tóm tắt 2-3 câu..."
     tags:
       - "category/topic"
     source_type: "blog"
     language: "en"
     saved_at: "YYYY-MM-DD"
     notes: "Ghi chú cá nhân..."
     ---

     ## Key Highlights (tùy chọn)
     - Điểm nổi bật 1
     - Điểm nổi bật 2
     ```
5. **Tự động cập nhật Index**:
   - Chạy lệnh: `node <path-to-script>/rebuild-index.js`.
6. **Đồng bộ GitHub (tùy chọn)**:
   - Gợi ý hoặc hỏi người dùng có muốn commit và push lên GitHub để Web UI GitHub Pages tự động cập nhật hay không:
     `git add . && git commit -m "Add bookmark: <title>" && git push`

---

### 2. Xây dựng lại index (`rebuild-index`)
Khi người dùng yêu cầu: *"rebuild index"*, *"cập nhật lại vault"*:
1. Chạy lệnh: `node <path-to-script>/rebuild-index.js`.
2. Báo cáo số lượng entries và danh mục đã được index.

---

### 3. Tìm kiếm tài liệu (`search`)
Khi người dùng hỏi: *"tìm tài liệu về ..."*, *"trong vault có bài nào về ..."*:
1. Đọc nội dung file `entries/_index.json`.
2. Tìm kiếm theo từ khóa trong `title`, `summary`, `tags`, `notes`, `body`.
3. Trả về kết quả kèm link gốc và tóm tắt ngắn.
