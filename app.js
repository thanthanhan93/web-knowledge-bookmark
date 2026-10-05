/**
 * Knowledge Vault — Main Application Logic
 * Vanilla JavaScript (Zero Dependencies)
 */

(function () {
  'use strict';

  // Application State
  const state = {
    allEntries: [],
    filteredEntries: [],
    tagTree: {},
    selectedTag: null, // null | 'category' | 'category/topic'
    selectedSourceType: 'all',
    searchQuery: '',
    sortOrder: 'newest',
    viewMode: 'grid', // 'grid' | 'list'
    activeModal: null
  };

  // DOM Elements
  const elements = {
    // Inputs & Filters
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchKeyShortcut: document.getElementById('searchKeyShortcut'),
    sourceTypePills: document.getElementById('sourceTypePills'),
    tagHierarchyList: document.getElementById('tagHierarchyList'),
    activeFilterChips: document.getElementById('activeFilterChips'),
    resetAllFiltersBtn: document.getElementById('resetAllFiltersBtn'),
    clearAllFiltersFromEmpty: document.getElementById('clearAllFiltersFromEmpty'),
    sortOrder: document.getElementById('sortOrder'),
    
    // View Toggles
    viewGridBtn: document.getElementById('viewGridBtn'),
    viewListBtn: document.getElementById('viewListBtn'),
    entriesContainer: document.getElementById('entriesContainer'),
    emptyState: document.getElementById('emptyState'),
    resultsCount: document.getElementById('resultsCount'),
    viewTitle: document.getElementById('viewTitle'),
    tagsCountTotal: document.getElementById('tagsCountTotal'),
    sourceTypeCount: document.getElementById('sourceTypeCount'),

    // Modals
    detailModal: document.getElementById('detailModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalSourceBadge: document.getElementById('modalSourceBadge'),
    modalSavedDate: document.getElementById('modalSavedDate'),
    modalTitle: document.getElementById('modalTitle'),
    modalUrlLink: document.getElementById('modalUrlLink'),
    modalSummarySection: document.getElementById('modalSummarySection'),
    modalSummary: document.getElementById('modalSummary'),
    modalNotesSection: document.getElementById('modalNotesSection'),
    modalNotes: document.getElementById('modalNotes'),
    modalBodySection: document.getElementById('modalBodySection'),
    modalBody: document.getElementById('modalBody'),
    modalTagsRow: document.getElementById('modalTagsRow'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    copyMarkdownLinkBtn: document.getElementById('copyMarkdownLinkBtn'),
    modalVisitSiteBtn: document.getElementById('modalVisitSiteBtn'),

    // Stats Modal
    statsModal: document.getElementById('statsModal'),
    openStatsBtn: document.getElementById('openStatsBtn'),
    statsModalCloseBtn: document.getElementById('statsModalCloseBtn'),
    statTotalEntries: document.getElementById('statTotalEntries'),
    statTotalCategories: document.getElementById('statTotalCategories'),
    statTotalTopics: document.getElementById('statTotalTopics'),
    sourceDistributionBars: document.getElementById('sourceDistributionBars'),
    categoryDistributionBars: document.getElementById('categoryDistributionBars'),

    // Tag Tree Modal
    tagTreeModal: document.getElementById('tagTreeModal'),
    openTagsTreeBtn: document.getElementById('openTagsTreeBtn'),
    tagTreeModalCloseBtn: document.getElementById('tagTreeModalCloseBtn'),
    tagTreeFullView: document.getElementById('tagTreeFullView'),

    // Mobile Sidebar
    sidebar: document.getElementById('sidebar'),
    mobileFilterToggle: document.getElementById('mobileFilterToggle'),

    // Toast
    toastMessage: document.getElementById('toastMessage')
  };

  // Supported Source Types
  const SOURCE_TYPES = [
    { id: 'all', label: 'All Sources' },
    { id: 'course', label: 'Course', color: '#8b5cf6' },
    { id: 'blog', label: 'Blog', color: '#3b82f6' },
    { id: 'paper', label: 'Paper', color: '#10b981' },
    { id: 'docs', label: 'Docs', color: '#06b6d4' },
    { id: 'video', label: 'Video', color: '#f43f5e' },
    { id: 'tool', label: 'Tool', color: '#f59e0b' },
    { id: 'repo', label: 'Repo', color: '#a855f7' },
    { id: 'thread', label: 'Thread', color: '#ec4899' }
  ];

  let currentSelectedEntry = null;

  // Initialize
  async function init() {
    setupEventListeners();
    await loadIndexData();
    renderSourceTypePills();
    renderTagHierarchy();
    applyFilters();
  }

  // Load index data from relative JSON file
  async function loadIndexData() {
    try {
      const response = await fetch('./entries/_index.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      state.allEntries = data.entries || [];
      state.tagTree = data.tag_tree || {};
    } catch (err) {
      console.warn('Could not fetch ./entries/_index.json directly. Falling back or CORS warning:', err);
      // Fallback sample data in case loaded via file:// protocol
      state.allEntries = [
        {
          id: "2026-10-04-why-capable-agents-still-fail",
          url: "https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-01-why-capable-agents-still-fail/",
          title: "Why Capable Agents Still Fail",
          summary: "Bài lecture giải thích tại sao model AI mạnh vẫn thất bại trong thực tế — vấn đề cốt lõi nằm ở harness engineering chứ không phải model. Giới thiệu 5 lớp phòng vệ (defense layers) và diagnostic feedback loop.",
          tags: ["engineering/ai-agent", "engineering/harness-engineering", "platform/anthropic"],
          source_type: "course",
          language: "en",
          saved_at: "2026-10-04",
          notes: "Rất quan trọng cho việc cấu hình AGENTS.md và agent autonomy. Cần xem tiếp lecture 02-14.",
          body: "## Key Takeaways\n- Khi AI agent thất bại, 80% nguyên nhân là do harness: context window pollution, ambiguous tools, thiếu guardrails.\n- 5 Lớp phòng vệ gồm: Prompt contract, Context compression, Tool schema validation, Execution sandbox, và Runtime reflection.\n- Cần xây dựng feedback loop liên tục thay vì chỉ đo benchmark một lần."
        },
        {
          id: "2026-10-04-building-effective-agents-anthropic",
          url: "https://www.anthropic.com/research/building-effective-agents",
          title: "Building Effective Agents - Anthropic Research",
          summary: "Hướng dẫn thực chiến từ Anthropic về kiến trúc xây dựng AI agents. Phân loại agent patterns phổ biến: Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, và Evaluator-Optimizer.",
          tags: ["engineering/ai-agent", "concept/architecture", "platform/anthropic"],
          source_type: "blog",
          language: "en",
          saved_at: "2026-10-04",
          notes: "Tài liệu nền tảng khi thiết kế multi-agent workflow và subagent delegation.",
          body: "## Patterns Tổng Kết\n1. **Prompt Chaining**: Chia nhỏ chuỗi nhiệm vụ thành các bước tuần tự.\n2. **Routing**: Phân loại input và điều hướng sang prompt/tool chuyên biệt.\n3. **Parallelization**: Chạy đồng thời các tác vụ độc lập rồi tổng hợp kết quả.\n4. **Orchestrator-Workers**: LLM trung tâm điều phối và tổng hợp kết quả từ các worker subagents.\n5. **Evaluator-Optimizer**: Vòng lặp tự đánh giá và tinh chỉnh output dựa trên tiêu chí định sẵn."
        }
      ];
      state.tagTree = {
        engineering: {
          children: ["harness-engineering", "ai-agent", "prompt-engineering", "devops"],
          description: "Software engineering topics"
        },
        platform: {
          children: ["anthropic", "openai", "google", "github"],
          description: "AI platforms & services"
        },
        ops: {
          children: ["deployment", "monitoring", "ci-cd"],
          description: "Operations & infrastructure"
        },
        concept: {
          children: ["architecture", "design-pattern", "mental-model"],
          description: "Concepts & frameworks"
        }
      };
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search input
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      elements.clearSearchBtn.classList.toggle('hidden', !state.searchQuery);
      applyFilters();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');
      elements.searchInput.focus();
      applyFilters();
    });

    // Reset filters
    elements.resetAllFiltersBtn.addEventListener('click', resetAllFilters);
    elements.clearAllFiltersFromEmpty.addEventListener('click', resetAllFilters);

    // Sort order
    elements.sortOrder.addEventListener('change', (e) => {
      state.sortOrder = e.target.value;
      applyFilters();
    });

    // View mode switchers
    elements.viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    elements.viewListBtn.addEventListener('click', () => setViewMode('list'));

    // Mobile filter toggle
    elements.mobileFilterToggle.addEventListener('click', () => {
      elements.sidebar.classList.toggle('mobile-open');
    });

    // Modal Close buttons
    elements.modalCloseBtn.addEventListener('click', closeModal);
    elements.statsModalCloseBtn.addEventListener('click', closeModal);
    elements.tagTreeModalCloseBtn.addEventListener('click', closeModal);

    // Modal Outer click
    [elements.detailModal, elements.statsModal, elements.tagTreeModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    });

    // Open Stats & Tag Tree
    elements.openStatsBtn.addEventListener('click', openStatsModal);
    elements.openTagsTreeBtn.addEventListener('click', openTagTreeModal);

    // Copy Buttons
    elements.copyUrlBtn.addEventListener('click', () => {
      if (currentSelectedEntry && currentSelectedEntry.url) {
        copyToClipboard(currentSelectedEntry.url, 'URL copied to clipboard!');
      }
    });

    elements.copyMarkdownLinkBtn.addEventListener('click', () => {
      if (currentSelectedEntry) {
        const mdLink = `[${currentSelectedEntry.title}](${currentSelectedEntry.url})`;
        copyToClipboard(mdLink, 'Markdown link copied to clipboard!');
      }
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== elements.searchInput) {
        e.preventDefault();
        elements.searchInput.focus();
      } else if (e.key === 'Escape') {
        if (state.activeModal) {
          closeModal();
        } else if (state.searchQuery) {
          elements.searchInput.value = '';
          state.searchQuery = '';
          elements.clearSearchBtn.classList.add('hidden');
          applyFilters();
        }
      }
    });
  }

  // Set View Mode
  function setViewMode(mode) {
    state.viewMode = mode;
    elements.viewGridBtn.classList.toggle('active', mode === 'grid');
    elements.viewListBtn.classList.toggle('active', mode === 'list');
    elements.entriesContainer.classList.toggle('list-view', mode === 'list');
  }

  // Render Source Type Filter Pills
  function renderSourceTypePills() {
    elements.sourceTypePills.innerHTML = '';
    
    // Count per source type
    const counts = {};
    state.allEntries.forEach(entry => {
      const type = (entry.source_type || 'blog').toLowerCase();
      counts[type] = (counts[type] || 0) + 1;
    });

    SOURCE_TYPES.forEach(st => {
      const count = st.id === 'all' ? state.allEntries.length : (counts[st.id] || 0);
      if (st.id !== 'all' && count === 0) return; // Hide empty types

      const pill = document.createElement('div');
      pill.className = `source-filter-pill ${state.selectedSourceType === st.id ? 'active' : ''}`;
      
      let dotHtml = '';
      if (st.color) {
        dotHtml = `<span class="pill-dot" style="background-color: ${st.color}"></span>`;
      }

      pill.innerHTML = `${dotHtml}<span>${st.label}</span><span style="opacity: 0.65; font-size: 0.72rem;">(${count})</span>`;
      
      pill.addEventListener('click', () => {
        state.selectedSourceType = st.id;
        renderSourceTypePills();
        applyFilters();
      });

      elements.sourceTypePills.appendChild(pill);
    });
  }

  // Render Tag Hierarchy in Sidebar
  function renderTagHierarchy() {
    elements.tagHierarchyList.innerHTML = '';

    // Calculate tag counts
    const categoryCounts = {};
    const topicCounts = {};
    let totalUniqueTags = new Set();

    state.allEntries.forEach(entry => {
      if (Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => {
          totalUniqueTags.add(tag);
          const parts = tag.split('/');
          const cat = parts[0];
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          topicCounts[tag] = (topicCounts[tag] || 0) + 1;
        });
      }
    });

    elements.tagsCountTotal.textContent = totalUniqueTags.size;

    // Loop through defined tagTree categories
    const categories = Object.keys(state.tagTree);

    categories.forEach(cat => {
      const catData = state.tagTree[cat];
      const count = categoryCounts[cat] || 0;
      const isSelectedCat = state.selectedTag === cat;
      const isOpen = isSelectedCat || (state.selectedTag && state.selectedTag.startsWith(`${cat}/`));

      const groupEl = document.createElement('div');
      groupEl.className = `category-group ${isOpen ? 'open' : ''}`;

      // Header
      const headerEl = document.createElement('div');
      headerEl.className = `category-header ${isSelectedCat ? 'active' : ''}`;
      headerEl.innerHTML = `
        <div class="category-name-box">
          <svg class="category-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span>${cat}</span>
        </div>
        <span class="category-count">${count}</span>
      `;

      headerEl.addEventListener('click', (e) => {
        // Toggle expansion
        groupEl.classList.toggle('open');
        // Filter by category if clicked name
        if (state.selectedTag === cat) {
          state.selectedTag = null;
        } else {
          state.selectedTag = cat;
        }
        renderTagHierarchy();
        applyFilters();
      });

      groupEl.appendChild(headerEl);

      // Topic list
      const topicListEl = document.createElement('div');
      topicListEl.className = 'topic-list';

      if (catData.children && Array.isArray(catData.children)) {
        catData.children.forEach(sub => {
          const fullTag = `${cat}/${sub}`;
          const subCount = topicCounts[fullTag] || 0;
          const isSelectedTopic = state.selectedTag === fullTag;

          const topicEl = document.createElement('div');
          topicEl.className = `topic-item ${isSelectedTopic ? 'active' : ''}`;
          topicEl.innerHTML = `
            <span>${sub}</span>
            <span class="topic-count">${subCount}</span>
          `;

          topicEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.selectedTag === fullTag) {
              state.selectedTag = null;
            } else {
              state.selectedTag = fullTag;
            }
            renderTagHierarchy();
            applyFilters();
          });

          topicListEl.appendChild(topicEl);
        });
      }

      groupEl.appendChild(topicListEl);
      elements.tagHierarchyList.appendChild(groupEl);
    });
  }

  // Apply Search, Filters, and Sorting
  function applyFilters() {
    let results = [...state.allEntries];

    // 1. Source Type Filter
    if (state.selectedSourceType !== 'all') {
      results = results.filter(entry => (entry.source_type || 'blog').toLowerCase() === state.selectedSourceType);
    }

    // 2. Tag Filter (Hierarchy prefix matching)
    if (state.selectedTag) {
      if (state.selectedTag.includes('/')) {
        // Exact topic match
        results = results.filter(entry => Array.isArray(entry.tags) && entry.tags.includes(state.selectedTag));
      } else {
        // Category match: any tag that is "cat" or starts with "cat/"
        const catPrefix = `${state.selectedTag}/`;
        results = results.filter(entry => 
          Array.isArray(entry.tags) && 
          entry.tags.some(t => t === state.selectedTag || t.startsWith(catPrefix))
        );
      }
    }

    // 3. Search Query Filter
    if (state.searchQuery) {
      const q = state.searchQuery;
      results = results.filter(entry => {
        const titleMatch = entry.title && entry.title.toLowerCase().includes(q);
        const summaryMatch = entry.summary && entry.summary.toLowerCase().includes(q);
        const notesMatch = entry.notes && entry.notes.toLowerCase().includes(q);
        const tagsMatch = Array.isArray(entry.tags) && entry.tags.some(t => t.toLowerCase().includes(q));
        const bodyMatch = entry.body && entry.body.toLowerCase().includes(q);
        return titleMatch || summaryMatch || notesMatch || tagsMatch || bodyMatch;
      });
    }

    // 4. Sorting
    results.sort((a, b) => {
      if (state.sortOrder === 'newest') {
        return new Date(b.saved_at) - new Date(a.saved_at);
      } else if (state.sortOrder === 'oldest') {
        return new Date(a.saved_at) - new Date(b.saved_at);
      } else if (state.sortOrder === 'title-az') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    state.filteredEntries = results;
    renderResults();
    renderActiveFilterChips();
  }

  // Render Results Count and Cards
  function renderResults() {
    const total = state.filteredEntries.length;
    elements.resultsCount.textContent = `${total} ${total === 1 ? 'bookmark' : 'bookmarks'}`;

    if (state.selectedTag) {
      elements.viewTitle.textContent = state.selectedTag;
    } else if (state.searchQuery) {
      elements.viewTitle.textContent = `Search: "${state.searchQuery}"`;
    } else if (state.selectedSourceType !== 'all') {
      elements.viewTitle.textContent = `${state.selectedSourceType.toUpperCase()} Resources`;
    } else {
      elements.viewTitle.textContent = 'All Bookmarks';
    }

    if (total === 0) {
      elements.entriesContainer.innerHTML = '';
      elements.emptyState.classList.remove('hidden');
    } else {
      elements.emptyState.classList.add('hidden');
      renderCards(state.filteredEntries);
    }
  }

  // Render Active Filter Chips
  function renderActiveFilterChips() {
    elements.activeFilterChips.innerHTML = '';
    const hasFilters = state.selectedTag || state.selectedSourceType !== 'all' || state.searchQuery;
    elements.resetAllFiltersBtn.classList.toggle('hidden', !hasFilters);

    if (state.selectedTag) {
      const chip = createFilterChip(`Tag: ${state.selectedTag}`, () => {
        state.selectedTag = null;
        renderTagHierarchy();
        applyFilters();
      });
      elements.activeFilterChips.appendChild(chip);
    }

    if (state.selectedSourceType !== 'all') {
      const chip = createFilterChip(`Type: ${state.selectedSourceType}`, () => {
        state.selectedSourceType = 'all';
        renderSourceTypePills();
        applyFilters();
      });
      elements.activeFilterChips.appendChild(chip);
    }

    if (state.searchQuery) {
      const chip = createFilterChip(`Query: "${state.searchQuery}"`, () => {
        elements.searchInput.value = '';
        state.searchQuery = '';
        elements.clearSearchBtn.classList.add('hidden');
        applyFilters();
      });
      elements.activeFilterChips.appendChild(chip);
    }
  }

  function createFilterChip(text, onRemove) {
    const chip = document.createElement('div');
    chip.className = 'active-chip';
    chip.innerHTML = `
      <span>${escapeHtml(text)}</span>
      <span class="active-chip-remove" title="Remove filter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    `;
    chip.querySelector('.active-chip-remove').addEventListener('click', onRemove);
    return chip;
  }

  // Render Cards Grid
  function renderCards(entries) {
    elements.entriesContainer.innerHTML = '';

    entries.forEach(entry => {
      const card = document.createElement('article');
      card.className = 'entry-card';

      const sourceType = (entry.source_type || 'blog').toLowerCase();
      const tags = Array.isArray(entry.tags) ? entry.tags : [];

      // Tags HTML
      const tagsHtml = tags.map(tag => {
        const parts = tag.split('/');
        if (parts.length === 2) {
          return `<span class="tag-badge" data-tag="${escapeHtml(tag)}"><span class="tag-category">${escapeHtml(parts[0])}/</span>${escapeHtml(parts[1])}</span>`;
        }
        return `<span class="tag-badge" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`;
      }).join('');

      // Summary & Notes
      const summaryHtml = entry.summary 
        ? `<p class="entry-summary">${escapeHtml(entry.summary)}</p>` 
        : '';
      const notesHtml = entry.notes 
        ? `<div class="entry-notes-snippet">"${escapeHtml(entry.notes)}"</div>` 
        : '';

      card.innerHTML = `
        <div class="entry-header">
          <div class="badge-wrapper">
            <span class="source-badge ${escapeHtml(sourceType)}">${escapeHtml(sourceType)}</span>
            <span class="entry-date">${escapeHtml(entry.saved_at || '')}</span>
          </div>
          <div class="entry-actions-top">
            <button class="icon-btn copy-card-link-btn" title="Copy URL">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer" class="icon-btn" title="Open source in new tab" onclick="event.stopPropagation()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>

        <div class="entry-body-col">
          <h3 class="entry-title">${escapeHtml(entry.title || 'Untitled')}</h3>
          ${summaryHtml}
          ${notesHtml}
        </div>

        <div class="tags-row">
          ${tagsHtml}
        </div>

        <div class="entry-footer">
          <button class="details-btn-trigger">Details & Notes &rarr;</button>
          <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer" class="external-link-btn" onclick="event.stopPropagation()">
            <span>Visit Link</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      `;

      // Card click opens modal
      card.addEventListener('click', () => openDetailModal(entry));

      // Copy Link button in card
      const copyBtn = card.querySelector('.copy-card-link-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(entry.url, 'URL copied to clipboard!');
      });

      // Tag clicks inside card filter by that tag
      card.querySelectorAll('.tag-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          state.selectedTag = badge.getAttribute('data-tag');
          renderTagHierarchy();
          applyFilters();
        });
      });

      elements.entriesContainer.appendChild(card);
    });
  }

  // Open Detail Modal
  function openDetailModal(entry) {
    currentSelectedEntry = entry;
    state.activeModal = elements.detailModal;

    const sourceType = (entry.source_type || 'blog').toLowerCase();
    elements.modalSourceBadge.textContent = sourceType;
    elements.modalSourceBadge.className = `source-badge ${sourceType}`;
    elements.modalSavedDate.textContent = entry.saved_at || '';
    elements.modalTitle.textContent = entry.title || 'Untitled';
    elements.modalUrlLink.textContent = entry.url || '';
    elements.modalUrlLink.href = entry.url || '#';
    elements.modalVisitSiteBtn.href = entry.url || '#';
    // Summary
    if (entry.summary) {
      elements.modalSummarySection.classList.remove('hidden');
      elements.modalSummary.textContent = entry.summary;
    } else {
      elements.modalSummarySection.classList.add('hidden');
    }

    // Context & Notes
    if (entry.notes) {
      elements.modalNotesSection.classList.remove('hidden');
      elements.modalNotes.textContent = entry.notes;
    } else {
      elements.modalNotesSection.classList.add('hidden');
    }

    // Body (Markdown)
    if (entry.body) {
      elements.modalBodySection.classList.remove('hidden');
      elements.modalBody.innerHTML = simpleMarkdownParse(entry.body);
    } else {
      elements.modalBodySection.classList.add('hidden');
    }

    // Tags
    elements.modalTagsRow.innerHTML = '';
    const tags = Array.isArray(entry.tags) ? entry.tags : [];
    tags.forEach(tag => {
      const badge = document.createElement('span');
      badge.className = 'tag-badge';
      badge.textContent = tag;
      badge.addEventListener('click', () => {
        closeModal();
        state.selectedTag = tag;
        renderTagHierarchy();
        applyFilters();
      });
      elements.modalTagsRow.appendChild(badge);
    });

    elements.detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Open Stats Modal
  function openStatsModal() {
    state.activeModal = elements.statsModal;

    const totalEntries = state.allEntries.length;
    const catCounts = {};
    const sourceCounts = {};
    const uniqueTopics = new Set();

    state.allEntries.forEach(entry => {
      const src = (entry.source_type || 'blog').toLowerCase();
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;

      if (Array.isArray(entry.tags)) {
        entry.tags.forEach(t => {
          uniqueTopics.add(t);
          const cat = t.split('/')[0];
          catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
      }
    });

    elements.statTotalEntries.textContent = totalEntries;
    elements.statTotalCategories.textContent = Object.keys(state.tagTree).length;
    elements.statTotalTopics.textContent = uniqueTopics.size;

    // Render Source Bars
    elements.sourceDistributionBars.innerHTML = '';
    Object.keys(sourceCounts).forEach(src => {
      const count = sourceCounts[src];
      const pct = Math.round((count / (totalEntries || 1)) * 100);
      const barItem = document.createElement('div');
      barItem.className = 'stat-bar-item';
      barItem.innerHTML = `
        <div class="stat-bar-label-row">
          <span>${escapeHtml(src.toUpperCase())}</span>
          <span>${count} (${pct}%)</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width: ${pct}%;"></div>
        </div>
      `;
      elements.sourceDistributionBars.appendChild(barItem);
    });

    // Render Category Bars
    elements.categoryDistributionBars.innerHTML = '';
    Object.keys(catCounts).forEach(cat => {
      const count = catCounts[cat];
      const pct = Math.round((count / (totalEntries || 1)) * 100);
      const barItem = document.createElement('div');
      barItem.className = 'stat-bar-item';
      barItem.innerHTML = `
        <div class="stat-bar-label-row">
          <span>${escapeHtml(cat)}</span>
          <span>${count} entries</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width: ${Math.min(pct, 100)}%;"></div>
        </div>
      `;
      elements.categoryDistributionBars.appendChild(barItem);
    });

    elements.statsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Open Tag Tree Modal
  function openTagTreeModal() {
    state.activeModal = elements.tagTreeModal;
    elements.tagTreeFullView.innerHTML = '';

    Object.keys(state.tagTree).forEach(cat => {
      const data = state.tagTree[cat];
      const card = document.createElement('div');
      card.className = 'tag-tree-category-card';

      const topicsHtml = (data.children || []).map(child => {
        return `<span class="tag-tree-topic-pill">${escapeHtml(child)}</span>`;
      }).join('');

      card.innerHTML = `
        <div class="tag-tree-cat-title">
          <span>${escapeHtml(cat)}</span>
        </div>
        <div class="tag-tree-cat-desc">${escapeHtml(data.description || '')}</div>
        <div class="tag-tree-topic-pills">
          ${topicsHtml}
        </div>
      `;
      elements.tagTreeFullView.appendChild(card);
    });

    elements.tagTreeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Close Active Modal
  function closeModal() {
    if (state.activeModal) {
      state.activeModal.classList.add('hidden');
      state.activeModal = null;
      document.body.style.overflow = '';
      currentSelectedEntry = null;
    }
  }

  // Reset All Filters
  function resetAllFilters() {
    state.selectedTag = null;
    state.selectedSourceType = 'all';
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.clearSearchBtn.classList.add('hidden');
    renderSourceTypePills();
    renderTagHierarchy();
    applyFilters();
  }

  // Copy to Clipboard with Toast
  function copyToClipboard(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(message));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(message);
    }
  }

  function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toastMessage.classList.remove('hidden');
    setTimeout(() => {
      elements.toastMessage.classList.add('hidden');
    }, 2400);
  }

  // Markdown Parser
  function simpleMarkdownParse(md) {
    if (!md) return '';
    let html = escapeHtml(md);
    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>');
    return html;
  }

  // Utility to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Launch
  document.addEventListener('DOMContentLoaded', init);
})();
