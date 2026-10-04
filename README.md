# An's Bookmark Vault — Kho Tri Thức & Bookmark Cá Nhân

> Một công cụ lưu trữ, tổ chức tài liệu và bookmark thông minh cá nhân (Personal Smart Knowledge Vault). Sử dụng Markdown làm source of truth, tự động tạo JSON index và hiển thị trực quan qua Web UI trên GitHub Pages.

🌐 **Website Trực Tuyến**: [https://thanthanhan93.github.io/web-knowledge-bookmark/](https://thanthanhan93.github.io/web-knowledge-bookmark/)

---

## Tính năng nổi bật
- **Quản lý đa nền tảng**: Tương thích và hoạt động mượt mà trên nhiều AI Agent CLI (**Claude Code**, **Antigravity CLI**, **OpenCode**, **Cursor**, **Codex**...).
- **Tổ chức thẻ phân cấp thông minh**: Giới hạn tối đa 2 cấp (`category/topic`), dễ dàng lọc và mở rộng.
- **Web UI Dark Glassmorphism**: Tìm kiếm full-text tức thì, lọc đa chiều theo nguồn/chủ đề, xem chi tiết và biểu đồ Vault Analytics.
- **Zero-Backend**: Chạy hoàn toàn dưới dạng static site trên GitHub Pages (fetch trực tiếp file index JSON).
- **Markdown làm Source of Truth**: Mọi dữ liệu đều là file `.md` kèm frontmatter YAML chuẩn hóa, lưu trữ độc lập và dễ đọc bằng bất kỳ trình soạn thảo nào.

---

## Cài đặt nhanh (Quick Start)

### Cách 1: Sử dụng lệnh chuẩn `npx skills` (Khuyến nghị)
Bộ công cụ `npx skills` sẽ tự động nhận diện tất cả các AI CLI bạn đang sử dụng trên máy (**Claude Code**, **Antigravity**, **OpenCode**, **Cursor**...) và cài đặt skill vào đúng vị trí:

```bash
# Cài đặt trực tiếp từ GitHub repository:
npx skills add thanthanhan93/web-knowledge-bookmark -y

# Hoặc cài đặt từ thư mục local trong workspace:
npx skills add ./projects/web-knowledge-bookmark -y --copy
```

### Cách 2: Cài đặt thủ công theo từng CLI
Nếu muốn cài đặt thủ công vào agent cụ thể:

- **Claude Code**:
  ```bash
  # Project level:
  cp -r skill/ .claude/skills/knowledge-vault/
  # Hoặc User global level:
  cp -r skill/ ~/.claude/skills/knowledge-vault/
  ```

- **Antigravity CLI**:
  ```bash
  cp -r skill/ .agents/skills/knowledge-vault/
  ```

- **OpenCode**:
  ```bash
  cp -r skill/ .opencode/skills/knowledge-vault/
  ```

---

## Hướng dẫn sử dụng với AI CLI

1. **Thêm bookmark mới**:
   Chỉ cần dán link vào cửa sổ chat với AI agent bất kỳ:
   > *"Lưu link https://... vào knowledge base"*

   Agent sẽ tự động fetch nội dung, tóm tắt ý chính, gợi ý tags phân loại 2 cấp, tạo file Markdown trong `entries/` và tự động rebuild index.

2. **Xem và tra cứu trên Web**:
   Truy cập [https://thanthanhan93.github.io/web-knowledge-bookmark/](https://thanthanhan93.github.io/web-knowledge-bookmark/) trên điện thoại, máy tính bảng hoặc máy tính.

3. **Rebuild index thủ công (nếu cần)**:
   ```bash
   node skill/scripts/rebuild-index.js
   ```

4. **Đồng bộ giữa các thiết bị**:
   - `git pull` trước khi thêm nội dung mới.
   - `git push` sau khi thêm để GitHub Pages tự động cập nhật.
