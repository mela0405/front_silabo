import { FACULTADES_API } from "@/config/constants";
import { UNIVERSIDADES_API } from '@/config/constants'

export default {
  name: 'FacultadComponent',
  data() {
    return {
      facultades: [],
      universidades: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        descripcion: '',
        universidad: '',
        activa: true
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredFacultades: []
    }
  },
  computed: {
    totalItems() {
      return this.filteredFacultades.length;
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
    paginatedFacultades() {
      return this.filteredFacultades.slice(this.startIndex, this.endIndex);
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
    facultades() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchFacultades();
    this.fetchUniversidades();
  },
  methods: {
    async fetchUniversidades() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(UNIVERSIDADES_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las universidades');
        }

        this.universidades = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchFacultades() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(FACULTADES_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las facultades');
        }

        this.facultades = await response.json();
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
          ? FACULTADES_API.DETAIL(this.editingItem.id)
          : FACULTADES_API.LIST;

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

        await this.fetchFacultades();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(facultad) {
      if (!confirm(`¿Está seguro de eliminar la facultad "${facultad.nombre}"?`)) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(FACULTADES_API.DETAIL(facultad.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la facultad');
        }

        await this.fetchFacultades();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(facultad) {
      this.editingItem = facultad;
      this.formData = {
        nombre: facultad.nombre,
        descripcion: facultad.descripcion,
        universidad: facultad.universidad,
        activa: facultad.activa
      };
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        descripcion: '',
        universidad: '',
        activa: true
      };
      this.error = null;
    },

    // Métodos de paginación
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    changeItemsPerPage() {
      this.currentPage = 1;
    },

    // Métodos de búsqueda
    handleSearch() {
      this.currentPage = 1;
      this.applyFilters();
    },

    applyFilters() {
      if (!this.searchTerm.trim()) {
        this.filteredFacultades = [...this.facultades];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredFacultades = this.facultades.filter(facultad =>
          facultad.nombre.toLowerCase().includes(term) ||
          facultad.descripcion.toLowerCase().includes(term) ||
          facultad.universidad.toLowerCase().includes(term) ||
          facultad.id.toString().includes(term)
        );
      }
    }
  }
}