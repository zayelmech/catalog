(function () {
  const app = document.getElementById("app");
  const state = {
    catalog: null,
    selectedCategory: "Todos",
    search: "",
    sourceLabel: ""
  };

  function decodeBase64Url(value) {
    const normalized = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );

    return decodeURIComponent(
      Array.prototype.map.call(atob(padded), function (char) {
        return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
      }).join("")
    );
  }

  function validateRemoteCatalogUrl(catalogUrl) {
    const candidate = String(catalogUrl || "").trim();

    if (!candidate) {
      throw new Error("Missing catalog URL");
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(candidate);
    } catch (error) {
      throw new Error("Invalid catalog URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid catalog URL");
    }

    return candidate;
  }

  function resolveCatalogUrl() {
    const params = new URLSearchParams(window.location.search);
    const encodedUrlParam = params.get("url");
    const catalogParam = params.get("catalog");

    if (encodedUrlParam) {
      let decodedUrl;
      try {
        decodedUrl = decodeBase64Url(encodedUrlParam);
      } catch (error) {
        throw new Error("Invalid catalog URL");
      }

      return {
        url: validateRemoteCatalogUrl(decodedUrl),
        mode: "remote",
        label: "Catálogo cargado desde URL codificada"
      };
    }

    if (!catalogParam) {
      return { url: "./catalog.json", mode: "local", label: "Catálogo demo local" };
    }

    return {
      url: validateRemoteCatalogUrl(catalogParam),
      mode: "remote",
      label: "Catálogo cargado desde Firebase Storage"
    };
  }

  function formatPrice(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: state.catalog?.store?.currency || "MXN"
    }).format(amount);
  }

  function normalizeCategories(catalog) {
    const set = new Set((catalog.categories || []).filter(Boolean));
    set.add("Todos");
    return Array.from(set);
  }

  function getFilteredProducts() {
    const search = state.search.trim().toLowerCase();
    return state.catalog.products.filter((product) => {
      const inCategory = state.selectedCategory === "Todos" || product.category === state.selectedCategory;
      if (!inCategory) return false;
      if (!search) return true;

      const blob = `${product.name || ""} ${product.description || ""} ${product.category || ""}`.toLowerCase();
      return blob.includes(search);
    });
  }

  function categoriesHtml(categories) {
    return `<section class="chips" aria-label="Categorías">${categories.map((category) => `
      <button class="chip ${category === state.selectedCategory ? "active" : ""}" data-category="${CatalogTemplates.escapeHtml(category)}">${CatalogTemplates.escapeHtml(category)}</button>
    `).join("")}</section>`;
  }

  function productsHtml(products) {
    if (!products.length) {
      return `<section class="message-card"><h2>Sin resultados</h2><p>No encontramos productos con los filtros actuales. Prueba con otra categoría o limpia la búsqueda.</p></section>`;
    }
    return `<section class="grid">${products.map((product) => CatalogTemplates.productCard(product, formatPrice)).join("")}</section>`;
  }

  function controlsHtml() {
    const wa = state.catalog.store.whatsapp
      ? `<a class="btn btn-ghost btn-whatsapp" target="_blank" rel="noopener noreferrer" href="https://wa.me/${encodeURIComponent(state.catalog.store.whatsapp)}">Contactar por WhatsApp</a>`
      : "";

    return `
      <div class="toolbar">
        <input id="searchInput" class="search-input" type="search" placeholder="Buscar por nombre, descripción o categoría" value="${CatalogTemplates.escapeHtml(state.search)}" />
        <button id="copyLinkBtn" class="btn btn-primary" type="button">Copiar link</button>
        ${wa}
      </div>
      <p class="source-note">${CatalogTemplates.escapeHtml(state.sourceLabel)}</p>
    `;
  }

  function bindEvents() {
    document.querySelectorAll(".chip").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedCategory = button.dataset.category || "Todos";
        render();
      });
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        state.search = event.target.value;
        render();
      });
    }

    const copyBtn = document.getElementById("copyLinkBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = "¡Link copiado!";
          setTimeout(() => (copyBtn.textContent = "Copiar link"), 1600);
        } catch (error) {
          copyBtn.textContent = "No se pudo copiar";
          setTimeout(() => (copyBtn.textContent = "Copiar link"), 1600);
        }
      });
    }
  }

  function renderExpired() {
    app.innerHTML = `<main class="container"><section class="message-card"><h1>Este catálogo expiró</h1><p>El enlace ya no está activo. Solicita al comercio una versión actualizada para continuar.</p></section></main>`;
  }

  function render() {
    const activeElement = document.activeElement;
    const shouldRestoreSearchFocus = activeElement?.id === "searchInput";
    const searchSelectionStart = shouldRestoreSearchFocus ? activeElement.selectionStart : null;
    const searchSelectionEnd = shouldRestoreSearchFocus ? activeElement.selectionEnd : null;

    const categories = normalizeCategories(state.catalog);
    const filtered = getFilteredProducts();
    const templateName = CatalogLoader.ALLOWED_TEMPLATES.includes(state.catalog.template)
      ? state.catalog.template
      : "default-catalog";

    const renderer = CatalogTemplates.renderers[templateName] || CatalogTemplates.renderers["default-catalog"];
    app.innerHTML = renderer({
      catalog: state.catalog,
      categoriesHtml: categoriesHtml(categories),
      productsHtml: productsHtml(filtered),
      controlsHtml: controlsHtml()
    });

    bindEvents();

    if (shouldRestoreSearchFocus) {
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.focus();
        if (searchSelectionStart !== null && searchSelectionEnd !== null) {
          searchInput.setSelectionRange(searchSelectionStart, searchSelectionEnd);
        }
      }
    }
  }

  async function init() {
    let source;

    try {
      source = resolveCatalogUrl();
      const sourceLog = source.mode === "remote"
        ? `Fuente de catálogo remoto: ${source.url}`
        : "Fuente de catálogo local: ./catalog.json";
      console.info(sourceLog);

      const data = await CatalogLoader.loadCatalogJson(source.url);
      state.catalog = CatalogLoader.normalizeCatalog(data);
      state.sourceLabel = source.label;

      if (CatalogLoader.isCatalogExpired(state.catalog.expiresAt)) {
        renderExpired();
        return;
      }

      render();
    } catch (error) {
      console.error("Error al cargar catálogo", {
        source: source?.url || null,
        mode: source?.mode || null,
        error
      });
      app.innerHTML = `<main class="container"><section class="message-card error"><h1>No pudimos cargar el catálogo</h1><p>Ocurrió un problema al leer este catálogo. Verifica el enlace e inténtalo nuevamente.</p><p>${CatalogTemplates.escapeHtml(error.message)}</p></section></main>`;
    }
  }

  init();
})();
