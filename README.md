# Web Knowledge Bookmark

Một công cụ hỗ trợ lưu trữ và tổ chức tài liệu online (knowledge vault), sử dụng markdown làm source of truth, tự động generate index và hiển thị trên Web UI (GitHub Pages).

## Tính năng
- Lưu URL, tóm tắt tự động, gắn thẻ phân cấp (category/topic)
- Search và filter thông minh qua Web UI tĩnh
- Sync dữ liệu thông qua Git và xem trên GitHub Pages
- Tích hợp Antigravity skill để nhập liệu nhanh từ terminal/chat

## Quick Start

### Cách 1: Dùng lệnh chuẩn `npx skills` (Khuyến nghị)
`npx skills` tự động phát hiện Antigravity agent và cài đặt skill vào workspace:

```bash
# Nếu cài đặt từ GitHub:
npx skills add <username>/web-knowledge-bookmark -y

# Hoặc cài đặt trực tiếp từ thư mục local trong workspace:
npx skills add ./projects/web-knowledge-bookmark -y --copy
```

### Cách 2: Setup thủ công
```bash
# 1. Clone repo
git clone git@github.com:<user>/web-knowledge-bookmark.git
cd web-knowledge-bookmark

# 2. Copy skill vào workspace
cp -r skill/ <workspace>/.agents/skills/knowledge-vault/
```

## Usage
- **Thêm entry**: Paste URL trong Antigravity chat
- **Xem Web UI**: Truy cập `https://<user>.github.io/web-knowledge-bookmark/`
- **Sync**: `git pull` trước khi thêm, `git push` sau khi thêm
- **Rebuild index**: `node skill/scripts/rebuild-index.js`
