import { PROFESION_API } from "@/config/constants";

export default {
  name: 'ProfesionComponent',
  data() {
    return {
      profesiones: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        descripcion: ''
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredProfesiones: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredProfesiones.length;
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
    paginatedProfesiones() {
      return this.filteredProfesiones.slice(this.startIndex, this.endIndex);
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
    profesiones() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchProfesiones();
  },
  methods: {
    async fetchProfesiones() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(PROFESION_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las profesiones');
        }

        this.profesiones = await response.json();
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
          ? PROFESION_API.DETAIL(this.editingItem.id)
          : PROFESION_API.LIST;

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

        await this.fetchProfesiones();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(profesion) {
      if (!confirm(`¿Está seguro de eliminar la profesión "${profesion.nombre}"?`)) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(PROFESION_API.DETAIL(profesion.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la profesión');
        }

        await this.fetchProfesiones();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(profesion) {
      this.editingItem = profesion;
      this.formData = {
        nombre: profesion.nombre,
        descripcion: profesion.descripcion
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        descripcion: ''
      };
      this.error = null;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
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
        this.filteredProfesiones = [...this.profesiones];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredProfesiones = this.profesiones.filter(profesion =>
          profesion.nombre.toLowerCase().includes(term) ||
          profesion.descripcion.toLowerCase().includes(term) ||
          profesion.id.toString().includes(term)
        );
      }
    }
  }
};
