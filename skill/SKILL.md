---
name: knowledge-vault
description: "Lưu trữ, phân loại, tìm kiếm và dọn dẹp các tài liệu, bookmark online vào An's Bookmark Vault. Hoạt động trên mọi AI CLI (Claude Code, Antigravity, OpenCode, Cursor...)."
---

# Knowledge Vault Skill (An's Bookmark Vault)

Skill chuẩn hóa việc lưu trữ, phân loại, tìm kiếm và dọn dẹp bookmark/tài liệu nghiên cứu. 
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
   - Sử dụng công cụ web có sẵn của agent (ví dụ: `WebFetch` trên Claude Code, `read_url_content` trên Antigravity, hoặc chạy lệnh qua shell) để trích xuất tiêu đề và nội dung bài viết.
2. **Tóm tắt & Context Note**:
   - Viết tóm tắt ngắn gọn 1-2 câu (`summary`) về nội dung chính của tài liệu.
   - Viết ghi chú ngắn (`notes`) giúp hiểu rõ ngữ cảnh (context), bối cảnh kỹ thuật và lý do lưu trữ.
   - Đọc file `_tags.json` để chọn hoặc đề xuất tags phù hợp. 
   - **Quy tắc Tag**: Tối đa 2 cấp dạng `category/topic` (ví dụ: `engineering/ai-agent`, `platform/anthropic`). Không dùng quá 2 dấu gạch chéo.
   - Xác định `source_type`: `blog` | `course` | `paper` | `docs` | `video` | `tool` | `repo` | `thread`.
3. **Xác nhận với người dùng**:
   - Hiển thị nhanh tóm tắt dự kiến: Title, Summary, Context Notes, Tags, Source Type.
4. **Tạo file Markdown**:
   - Đặt tên file: `YYYY-MM-DD-slug.md` trong thư mục `entries/`.
   - Định dạng Frontmatter YAML (không viết thêm nội dung tóm tắt/body dài dòng bên dưới `---`):
     ```yaml
     ---
     id: "YYYY-MM-DD-slug"
     url: "https://..."
     title: "Tiêu đề bài viết"
     summary: "Tóm tắt 1-2 câu về ý chính của tài liệu..."
     tags:
       - "category/topic"
     source_type: "blog"
     language: "en"
     saved_at: "YYYY-MM-DD"
     notes: "Ghi chú ngắn giúp hiểu rõ context và lý do lưu trữ..."
     ---
     ```
5. **Tự động cập nhật Index**:
   - Chạy lệnh: `node <path-to-script>/rebuild-index.js`.
6. **Đồng bộ GitHub (tùy chọn)**:
   - Gợi ý hoặc hỏi người dùng có muốn commit và push lên GitHub để Web UI GitHub Pages tự động cập nhật hay không:
     `git add . && git commit -m "Add bookmark: <title>" && git push`

---

### 2. Xóa & Dọn dẹp tài liệu (`delete` / `cleanup`)
Khi người dùng yêu cầu: *"xóa link này"*, *"remove doc <slug/tên/id>"*, *"xóa bài viết khỏi thư viện"*, *"clean up vault"*:

1. **Xác định tài liệu cần xóa**:
   - Tìm kiếm file theo slug ID, tiêu đề hoặc URL trong thư mục `entries/` (hoặc kiểm tra qua `entries/_index.json`).
2. **Xóa file Markdown**:
   - Xóa file `.md` tương ứng trong thư mục `entries/` (dùng `git rm` nếu đang trong git repository để theo dõi lịch sử).
3. **Tự động cập nhật Index**:
   - Chạy lệnh: `node <path-to-script>/rebuild-index.js`.
4. **Dọn dẹp Tag không còn sử dụng (Tùy chọn)**:
   - Quét danh sách tags trong `_tags.json` so với các entry thực tế trong `_index.json`. Nếu có tag con (topic) không còn bất kỳ entry nào sử dụng và người dùng muốn clean up, loại bỏ topic đó khỏi `_tags.json` và rebuild lại index.
5. **Đồng bộ GitHub (tùy chọn)**:
   - Gợi ý commit và push lên GitHub để Web UI GitHub Pages tự động cập nhật:
     `git commit -m "Remove bookmark: <title>" && git push`

---

### 3. Xây dựng lại index (`rebuild-index`)
Khi người dùng yêu cầu: *"rebuild index"*, *"cập nhật lại vault"*:
1. Chạy lệnh: `node <path-to-script>/rebuild-index.js`.
2. Báo cáo số lượng entries và danh mục đã được index.

---

### 4. Tìm kiếm tài liệu (`search`)
Khi người dùng hỏi: *"tìm tài liệu về ..."*, *"trong vault có bài nào về ..."*:
1. Đọc nội dung file `entries/_index.json`.
2. Tìm kiếm theo từ khóa trong `title`, `notes`, `tags`, `body`.
3. Trả về kết quả kèm link gốc và context notes ngắn.
