# Web Knowledge Bookmark

Một công cụ hỗ trợ lưu trữ và tổ chức tài liệu online (knowledge vault), sử dụng markdown làm source of truth, tự động generate index và hiển thị trên Web UI (GitHub Pages).

## Tính năng
- Lưu URL, tóm tắt tự động, gắn thẻ phân cấp (category/topic)
- Search và filter thông minh qua Web UI tĩnh
- Sync dữ liệu thông qua Git và xem trên GitHub Pages
- Tích hợp Antigravity skill để nhập liệu nhanh từ terminal/chat

## Quick Start
```bash
# 1. Clone repo
git clone git@github.com:<user>/web-knowledge-bookmark.git
cd web-knowledge-bookmark

# 2. Install skill vào Antigravity workspace
#    Option A: Symlink (khuyến nghị — luôn sync với repo)
#    Windows (nhớ mở PowerShell với quyền admin):
mklink /D "<workspace>\.agents\skills\knowledge-vault" "%cd%\skill"

#    macOS/Linux:
ln -s "$(pwd)/skill" "<workspace>/.agents/skills/knowledge-vault"

#    Option B: Copy (không tự động sync)
cp -r skill/ <workspace>/.agents/skills/knowledge-vault/

# 3. Xong! Dùng skill trong Antigravity chat:
#    "lưu link https://... vào knowledge base"
```

## Usage
- **Thêm entry**: Paste URL trong Antigravity chat
- **Xem Web UI**: Truy cập `https://<user>.github.io/web-knowledge-bookmark/`
- **Sync**: `git pull` trước khi thêm, `git push` sau khi thêm
- **Rebuild index**: `node skill/scripts/rebuild-index.js`
