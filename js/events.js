document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.altKey && event.key === 'x') {
      window.open('/dev-tools/directory.html', '_blank');
    }
  });
  
  const searchInput = document.getElementById("searchInput");
  const eventsGrid = document.querySelectorAll(".events-grid .event-item");
  const filterCheckboxes = document.querySelectorAll(".filter");
  
  searchInput.addEventListener("input", filterEvents);
  filterCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", filterEvents));
  
  function filterEvents() {
    const searchText = searchInput.value.toLowerCase();
    const selectedFilters = Array.from(filterCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  
    eventsGrid.forEach((event) => {
      const matchesSearch = event.textContent.toLowerCase().includes(searchText);
      const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.dataset.category);
  
      event.style.display = matchesSearch && matchesFilter ? "block" : "none";
    });
  }
  