---
layout: null
---
// Auto-generated docs data from Jekyll collections
window.docsData = [
  {% for doc in site.docs %}
  {
    "title": "{{ doc.title | escape }}",
    "category": "{{ doc.category | escape }}",
    "path": "{{ doc.path }}",
    "url": "{{ doc.url | relative_url }}",
    "description": "{{ doc.description | escape }}",
    "order": {{ doc.order | default: 999 }}
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
];

// Convert to the format your script expects
if (window.docsData && window.docsData.length > 0) {
  const grouped = {};
  window.docsData.forEach(doc => {
    const category = doc.category || 'uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(doc);
  });
  
  // Sort by order within each category
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.order - b.order);
  });
  
  window.docs = grouped;
  console.log('Jekyll auto-discovery loaded:', window.docs);
} else {
  console.log('No Jekyll docs found, using fallback');
}
