---
name: knowledge-vault
description: "Lưu trữ, phân loại và tìm kiếm các tài liệu, URL vào knowledge base bookmark."
---

# Knowledge Vault Skill

Skill này hỗ trợ lưu các URL vào knowledge base. Tất cả dữ liệu được lưu tại `projects/web-knowledge-bookmark/entries/`.

## Lệnh hỗ trợ:

### 1. Thêm mới tài liệu (`add`)
Khi người dùng yêu cầu lưu 1 link/URL:
1. Sử dụng công cụ `read_url_content` để đọc nội dung từ URL.
2. Tóm tắt nội dung chính (2-3 câu) vào phần `summary`.
3. Đọc `projects/web-knowledge-bookmark/entries/_tags.json` để chọn tag phù hợp (có thể gợi ý tag mới theo định dạng `category/topic`, TỐI ĐA 2 levels).
4. Xác nhận với người dùng các thông tin: `title`, `summary`, `tags`, `source_type`, `notes`.
5. Khi người dùng đồng ý, tạo file định dạng Markdown có frontmatter YAML ở thư mục `projects/web-knowledge-bookmark/entries/YYYY-MM-DD-slug.md`.
6. Tự động gọi script `node projects/web-knowledge-bookmark/skill/scripts/rebuild-index.js` để cập nhật index.
7. (Tùy chọn) Gợi ý người dùng thực hiện commit và push lên GitHub.

### 2. Xây dựng lại index (`rebuild-index`)
Khi có yêu cầu cập nhật hoặc rebuild index:
1. Chạy lệnh: `node projects/web-knowledge-bookmark/skill/scripts/rebuild-index.js`

### 3. Tìm kiếm tài liệu (`search`)
1. Đọc nội dung file `projects/web-knowledge-bookmark/entries/_index.json`.
2. Lọc và hiển thị các entry phù hợp nhất dựa trên từ khóa tìm kiếm của người dùng.
