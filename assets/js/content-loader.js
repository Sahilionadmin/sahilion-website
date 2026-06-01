document.addEventListener("DOMContentLoaded", () => {
  // Anzisha upakiaji wa picha ukurasa ukifunguka
  loadGalleryPhotos();
});

async function loadGalleryPhotos() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  try {
    // 1. Vuta data kutoka kwenye faili la JSON
    const response = await fetch("assets/data/content-photos.json");
    if (!response.ok) throw new Error("Failed to load JSON file");
    
    const photos = await response.json();
    let htmlContent = "";

    // 2. Jenga muundo wa HTML kwa kila picha
    photos.forEach(photo => {
      htmlContent += `
        <div class="col-xl-3 col-lg-4 col-md-6 gallery-item ${photo.category}">
          <div class="gallery-item-wrap">
            <a href="${photo.img_src}" class="glightbox" data-gallery="sahilion-gallery" data-i18n="[title]${photo.title_key}" title="">
              <img src="${photo.img_src}" class="img-fluid" alt="" data-i18n="[alt]${photo.title_key}" loading="lazy" width="800" height="600">
            </a>
            <div class="gallery-item-info">
              <h4 data-i18n="${photo.title_key}">---</h4>
              <p data-i18n="${photo.desc_key}">---</p>
            </div>
          </div>
        </div>
      `;
    });

    // 3. Weka maudhui yote kwenye HTML container
    container.innerHTML = htmlContent;

    // 4. Amsha tafsiri ya lugha (i18next) kwa picha zilizoingia
    if (window.i18next && typeof window.localizePage === "function") {
      window.localizePage();
    }

    // 5. Washa upya mfumo wa GLightbox (picha kufunguka kwa ukubwa)
    if (typeof GLightbox === "function") {
      GLightbox({ selector: '.glightbox' });
    }

    // 6. Anzisha mfumo wa vichujio (Filters)
    initGalleryFilters();

  } catch (error) {
    console.error("Error loading gallery photos:", error);
    container.innerHTML = `<div class="text-center col-12"><p class="text-danger">Failed to load content. Please try again later.</p></div>`;
  }
}

// Mfumo wa kuchuja picha (Zote, Vyakula Vikuu, Vitafunwa, Ufundi)
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", function() {
      // Badilisha muonekano wa button iliyobonyezwa (Active class)
      document.querySelector(".filter-btn.active")?.classList.remove("active");
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      // Ficha au onyesha picha kulingana na kundi lake
      galleryItems.forEach(item => {
        if (filterValue === "all" || item.classList.contains(filterValue)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

