const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const entriesDir = path.join(rootDir, 'entries');
const indexPath = path.join(entriesDir, '_index.json');
const tagsPath = path.join(entriesDir, '_tags.json');

// Hàm parser YAML frontmatter đơn giản (hỗ trợ cả LF và CRLF)
function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    
    const yaml = match[1];
    const data = {};
    
    yaml.split(/\r?\n/).forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) {
            if (line.trim().startsWith('- ')) {
                const val = line.trim().substring(2).replace(/^["']|["']$/g, '');
                if (data.__lastArrayKey) {
                    data[data.__lastArrayKey].push(val);
                }
            }
            return;
        }
        
        const key = line.substring(0, colonIdx).trim();
        let val = line.substring(colonIdx + 1).trim();
        
        if (!val) {
            data[key] = [];
            data.__lastArrayKey = key;
        } else {
            val = val.replace(/^["']|["']$/g, '');
            data[key] = val;
            data.__lastArrayKey = null;
        }
    });
    
    delete data.__lastArrayKey;
    return data;
}

function buildIndex() {
    console.log('Building index from markdown files...');
    
    if (!fs.existsSync(entriesDir)) {
        fs.mkdirSync(entriesDir, { recursive: true });
    }

    const files = fs.readdirSync(entriesDir).filter(f => f.endsWith('.md'));
    const entries = [];

    files.forEach(file => {
        const filePath = path.join(entriesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const meta = parseFrontmatter(content);
        
        if (meta && meta.id) {
            // Lưu relative path để dùng cho Web UI
            meta.file = `entries/${file}`;
            
            // Lấy phần markdown body nếu có
            const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
            if (body) {
                meta.body = body;
            }
            
            entries.push(meta);
        }
    });
    
    // Sort mới nhất lên đầu
    entries.sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));

    let tagTree = {};
    if (fs.existsSync(tagsPath)) {
        tagTree = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
    }

    const indexData = {
        version: 1,
        generated_at: new Date().toISOString(),
        entries: entries,
        tag_tree: tagTree
    };

    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
    console.log(`Successfully built index with ${entries.length} entries.`);
}

buildIndex();
