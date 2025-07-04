import { CARRERAS_API, DEPARTAMENTOS_API } from "@/config/constants";

export default {
  name: 'CarreraComponent',
  data() {
    return {
      carreras: [],
      departamentos: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        activa: true,
        departamento_id: ''
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredCarreras: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredCarreras.length;
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
    paginatedCarreras() {
      return this.filteredCarreras.slice(this.startIndex, this.endIndex);
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
    carreras() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchCarreras();
    this.fetchDepartamentos();
  },
  methods: {
    async fetchDepartamentos() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(DEPARTAMENTOS_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar los departamentos');

        this.departamentos = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCarreras() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(CARRERAS_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las carreras');

        this.carreras = await response.json();
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
          ? CARRERAS_API.DETAIL(this.editingItem.id)
          : CARRERAS_API.LIST;

        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          nombre: this.formData.nombre,
          activa: this.formData.activa,
          departamento: this.formData.departamento_id
        };

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(', '));
        }

        await this.fetchCarreras();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(carrera) {
      if (!confirm(`¿Está seguro de eliminar la carrera "${carrera.nombre}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(CARRERAS_API.DETAIL(carrera.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar la carrera');

        await this.fetchCarreras();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(carrera) {
      this.editingItem = carrera;
      this.formData = {
        nombre: carrera.nombre,
        activa: carrera.activa,
        departamento_id: carrera.departamento
      };
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        activa: true,
        departamento_id: ''
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
        this.filteredCarreras = [...this.carreras];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredCarreras = this.carreras.filter(carrera =>
          carrera.nombre.toLowerCase().includes(term) ||
          carrera.id.toString().includes(term) ||
          carrera.departamento_detalle?.nombre.toLowerCase().includes(term)
        );
      }
    }
  }
};
