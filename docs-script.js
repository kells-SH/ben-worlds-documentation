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
      // Ensure dropdown starts closed
      dropdown.style.maxHeight = '0px';
      
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
        const isCurrentlyOpen = dropdown.classList.contains('open');
        
        // Toggle classes
        dropdown.classList.toggle('open');
        categoryHeader.classList.toggle('open');
        
        // Handle smooth animation
        if (!isCurrentlyOpen) {
          // Opening: measure content height and set it
          dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
        } else {
          // Closing: set to 0
          dropdown.style.maxHeight = '0px';
        }
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
  
  // If this is the main docs page (not an individual doc), redirect to Get Started
  if (window.location.pathname.endsWith('/docs.html') || window.location.pathname.endsWith('/docs/')) {
    // Redirect to the Get Started page
    const getStartedUrl = '/ben-worlds-documentation/docs/manuals-and-cheat-sheets/get-started/';
    window.location.href = getStartedUrl;
    return;
  }
});
