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
    if (typeof window.docsData === 'undefined') {
      console.warn('No docsData found - make sure Jekyll is processing the page correctly');
      return;
    }

    docList.innerHTML = '';
    
    Object.keys(window.docsData).sort().forEach(category => {
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
      dropdown.className = 'dropdown'; // Starts without 'open' class = closed
      
      // Explicitly set initial closed state
      dropdown.style.visibility = 'hidden';
      dropdown.style.opacity = '0';
      dropdown.style.maxHeight = '0px';
      
      console.log('Created dropdown for', categoryName, 'with classes:', dropdown.className, 'and styles:', dropdown.style.visibility, dropdown.style.opacity, dropdown.style.maxHeight);
      
      // Sort documents by order
      const sortedDocs = window.docsData[category].sort((a, b) => (a.order || 999) - (b.order || 999));
      
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
        
        if (!isCurrentlyOpen) {
          // Opening: first set visibility and measure height
          dropdown.style.visibility = 'visible';
          dropdown.style.opacity = '1';
          const height = dropdown.scrollHeight;
          dropdown.style.maxHeight = height + 'px';
          
          // Add open classes
          dropdown.classList.add('open');
          categoryHeader.classList.add('open');
        } else {
          // Closing: first set max-height to 0, then hide
          dropdown.style.maxHeight = '0px';
          dropdown.style.opacity = '0';
          
          // Remove open classes and set visibility after animation
          dropdown.classList.remove('open');
          categoryHeader.classList.remove('open');
          
          setTimeout(() => {
            if (!dropdown.classList.contains('open')) {
              dropdown.style.visibility = 'hidden';
            }
          }, 300); // Match the CSS transition duration
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
  
  // Document loading functionality
  async function loadDocument(docPath) {
    try {
      // Use Jekyll URL if available, otherwise construct path
      const url = window.docsUrls && window.docsUrls[docPath] 
        ? window.docsUrls[docPath] 
        : docPath;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
      
      const html = await response.text();
      
      // Extract content from Jekyll layout or use as-is
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Try to find main content area, fallback to body
      const mainContent = doc.querySelector('main .content, .markdown-body, main') || doc.body;
      
      if (mainContent) {
        docContent.innerHTML = mainContent.innerHTML;
        generateTOC();
        
        // Update navigation highlighting
        document.querySelectorAll('.doc-link').forEach(link => {
          link.classList.remove('active');
          if (link.href.includes(docPath) || link.getAttribute('href') === url) {
            link.classList.add('active');
          }
        });
      }
    } catch (error) {
      console.error('Error loading document:', error);
      docContent.innerHTML = `<h1>Error Loading Document</h1><p>Failed to load: ${docPath}</p>`;
    }
  }

  // Generate Table of Contents for right sidebar
  function generateTOC() {
    if (!docToc) return;
    
    docToc.innerHTML = "";
    const headers = docContent.querySelectorAll("h2, h3, h4");

    const rightSidebar = document.querySelector(".right-sidebar");
    if (headers.length === 0) {
      if (rightSidebar) rightSidebar.style.display = "none";
      return;
    } else {
      if (rightSidebar) rightSidebar.style.display = "block";
    }

    headers.forEach(header => {
      if (!header.id) {
        header.id = header.textContent.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      }
      
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${header.id}`;
      a.textContent = header.textContent;
      a.className = header.tagName.toLowerCase();

      a.addEventListener("click", (e) => {
        e.preventDefault();

        // Get the target heading element
        const targetId = a.getAttribute("href").substring(1);
        const targetEl = document.getElementById(targetId);
        const scrollContainer = docContent;

        if (targetEl && scrollContainer) {
          const scrollOffset = 20;
          const targetScrollTop = targetEl.offsetTop - scrollOffset;

          scrollContainer.scrollTo({
            top: targetScrollTop,
            behavior: "smooth"
          });

          // Update the URL hash
          history.replaceState(null, "", `#${targetId}`);

          // Highlight active link
          document.querySelectorAll('#doc-toc a').forEach(el => el.classList.remove("active"));
          a.classList.add("active");
        }
      });

      li.appendChild(a);
      docToc.appendChild(li);
    });
  }
  
  // Handle document links
  document.addEventListener('click', function(e) {
    const docLink = e.target.closest('.doc-link');
    if (docLink) {
      e.preventDefault();
      const docPath = docLink.getAttribute('href');
      loadDocument(docPath);
    }
  });
  
  // If this is the main docs page (not an individual doc), redirect to Get Started
  if (window.location.pathname.endsWith('/docs.html') || window.location.pathname.endsWith('/docs/')) {
    // Redirect to the Get Started page
    const getStartedUrl = '/ben-worlds-documentation/docs/manuals-and-cheat-sheets/get-started/';
    window.location.href = getStartedUrl;
    return;
  }
});
