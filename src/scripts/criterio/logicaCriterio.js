import { CRITERIO_API } from "@/config/constants";

export default {
  name: "CriterioComponent",
  data() {
    return {
      criterios: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        peso: 0,
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
        activo: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredCriterios: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredCriterios.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    },
    paginatedCriterios() {
      return this.filteredCriterios.slice(this.startIndex, this.endIndex);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;

      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 2);

        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) pages.push(i);

        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('...');
          pages.push(this.totalPages);
        }
      }

      return pages;
    }
  },
  watch: {
    criterios() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchCriterios();
  },
  methods: {
    async fetchCriterios() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(CRITERIO_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Error al cargar los criterios");

        this.criterios = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("access_token");
        const url = this.editingItem
          ? CRITERIO_API.DETAIL(this.editingItem.id)
          : CRITERIO_API.LIST;

        const method = this.editingItem ? "PUT" : "POST";

        const payload = { ...this.formData };

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(", "));
        }

        await this.fetchCriterios();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(criterio) {
      if (!confirm(`¿Está seguro de eliminar el criterio "${criterio.nombre}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(CRITERIO_API.DETAIL(criterio.id), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Error al eliminar el criterio");

        await this.fetchCriterios();
      } catch (error) {
        this.error = error.message;
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    editItem(criterio) {
      this.editingItem = criterio;
      this.formData = { ...criterio };
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        peso: 0,
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
        activo: true
      };
      this.error = null;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },

    changeItemsPerPage() {
      this.currentPage = 1;
    },

    handleSearch() {
      this.currentPage = 1;
      this.applyFilters();
    },

    applyFilters() {
      if (!this.searchTerm.trim()) {
        this.filteredCriterios = [...this.criterios];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredCriterios = this.criterios.filter(c =>
          c.nombre.toLowerCase().includes(term) ||
          c.descripcion.toLowerCase().includes(term) ||
          c.id.toString().includes(term)
        );
      }
    }
  }
};
