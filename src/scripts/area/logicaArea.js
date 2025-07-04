import { AREA_API } from "@/config/constants";

export default {
  name: 'AreaComponent',
  data() {
    return {
      areas: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        codigo: '',
        nombre: ''
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredAreas: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredAreas.length;
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
    paginatedAreas() {
      return this.filteredAreas.slice(this.startIndex, this.endIndex);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;

      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 2);

        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('...');
          pages.push(this.totalPages);
        }
      }

      return pages;
    }
  },
  watch: {
    areas() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchAreas();
  },
  methods: {
    async fetchAreas() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(AREA_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las áreas');
        }

        this.areas = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem 
          ? AREA_API.DETAIL(this.editingItem.id)
          : AREA_API.LIST;

        const method = this.editingItem ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(', '));
        }

        await this.fetchAreas();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(area) {
      if (!confirm(`¿Está seguro de eliminar el área "${area.nombre}"?`)) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(AREA_API.DETAIL(area.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el área');
        }

        await this.fetchAreas();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(area) {
      this.editingItem = area;
      this.formData = {
        codigo: area.codigo,
        nombre: area.nombre
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        codigo: '',
        nombre: ''
      };
      this.error = null;
    },

    // Paginación
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    changeItemsPerPage() {
      this.currentPage = 1;
    },

    // Búsqueda
    handleSearch() {
      this.currentPage = 1;
      this.applyFilters();
    },

    applyFilters() {
      if (!this.searchTerm.trim()) {
        this.filteredAreas = [...this.areas];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredAreas = this.areas.filter(area =>
          area.nombre.toLowerCase().includes(term) ||
          area.codigo.toLowerCase().includes(term) ||
          area.id.toString().includes(term)
        );
      }
    }
  }
};
