// Dynamic documentation viewer with Jekyll integration
document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarClose = document.getElementById('sidebar-close');
  const docList = document.getElementById('doc-list');
  const docContent = document.getElementById('doc-content');
  const searchInput = document.getElementById('search-input');
  const docToc = document.getElementById('doc-toc');
  const themeToggle = document.getElementById('theme-toggle');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // Theme handling
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  // Sidebar handling
  function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarBackdrop.classList.toggle('open');
  }

  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarClose.addEventListener('click', toggleSidebar);
  sidebarBackdrop.addEventListener('click', toggleSidebar);

  // Build navigation from Jekyll data
  function buildNavigation() {
    if (typeof docsData === 'undefined') {
      console.warn('No docsData found - make sure Jekyll is processing the page correctly');
      return;
    }

    docList.innerHTML = '';
    
    Object.keys(docsData).sort().forEach(category => {
      const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Create category folder
      const categoryItem = document.createElement('li');
      categoryItem.className = 'category-folder';
      
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'folder-toggle';
      categoryHeader.innerHTML = `
        <span class="chevron-icon">▶</span>
        <span class="folder-name">${categoryName}</span>
      `;
      
      const dropdown = document.createElement('ul');
      dropdown.className = 'dropdown';
      
      // Sort documents by order
      const sortedDocs = docsData[category].sort((a, b) => (a.order || 999) - (b.order || 999));
      
      sortedDocs.forEach(doc => {
        const docItem = document.createElement('li');
        const docLink = document.createElement('a');
        docLink.href = doc.url;
        docLink.textContent = doc.title;
        docLink.className = 'doc-link';
        
        if (doc.description) {
          docLink.title = doc.description;
        }
        
        docItem.appendChild(docLink);
        dropdown.appendChild(docItem);
      });
      
      categoryItem.appendChild(categoryHeader);
      categoryItem.appendChild(dropdown);
      docList.appendChild(categoryItem);
      
      // Toggle functionality
      categoryHeader.addEventListener('click', () => {
        const chevron = categoryHeader.querySelector('.chevron-icon');
        dropdown.classList.toggle('open');
        chevron.style.transform = dropdown.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
      });
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const docLinks = document.querySelectorAll('.doc-link');
      
      docLinks.forEach(link => {
        const title = link.textContent.toLowerCase();
        const description = link.title.toLowerCase();
        const matches = title.includes(searchTerm) || description.includes(searchTerm);
        
        link.parentElement.style.display = matches ? 'block' : 'none';
      });
      
      // Show/hide categories based on visible docs
      const categories = document.querySelectorAll('.category-folder');
      categories.forEach(category => {
        const visibleDocs = category.querySelectorAll('.doc-link[style*="block"], .doc-link:not([style])');
        category.style.display = visibleDocs.length > 0 ? 'block' : 'none';
      });
    });
  }

  // Initialize
  buildNavigation();
  
  // If this is the main docs page (not an individual doc), show initial message
  if (window.location.pathname.endsWith('/docs.html') || window.location.pathname.endsWith('/docs/')) {
    if (docContent) {
      docContent.innerHTML = `
        <h1>Select a document to begin reading</h1>
        <p>Choose a document from the sidebar to get started, or browse the categories below:</p>
        <div class="category-overview">
          ${Object.keys(docsData || {}).map(category => {
            const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const docs = docsData[category] || [];
            return `
              <div class="category-card">
                <h3>${categoryName}</h3>
                <p>${docs.length} document${docs.length !== 1 ? 's' : ''}</p>
                <ul>
                  ${docs.slice(0, 3).map(doc => `<li><a href="${doc.url}">${doc.title}</a></li>`).join('')}
                  ${docs.length > 3 ? `<li><em>...and ${docs.length - 3} more</em></li>` : ''}
                </ul>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }
});
