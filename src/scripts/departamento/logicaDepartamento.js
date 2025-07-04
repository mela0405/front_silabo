import { DEPARTAMENTOS_API, FACULTADES_API } from "@/config/constants";

export default {
  name: 'DepartamentoComponent',
  data() {
    return {
      departamentos: [],
      facultades: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        facultad_id: '',
        activo: true
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredDepartamentos: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredDepartamentos.length;
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
    paginatedDepartamentos() {
      return this.filteredDepartamentos.slice(this.startIndex, this.endIndex);
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
    departamentos() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchDepartamentos();
    this.fetchFacultades();
  },
  methods: {
    async fetchFacultades() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(FACULTADES_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las facultades');

        this.facultades = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDepartamentos() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(DEPARTAMENTOS_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
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

    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem
          ? DEPARTAMENTOS_API.DETAIL(this.editingItem.id)
          : DEPARTAMENTOS_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          nombre: this.formData.nombre,
          facultad: this.formData.facultad_id,
          activo: this.formData.activo
        };

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(', '));
        }

        await this.fetchDepartamentos();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(departamento) {
      if (!confirm(`¿Está seguro de eliminar el departamento "${departamento.nombre}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(DEPARTAMENTOS_API.DETAIL(departamento.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar el departamento');

        await this.fetchDepartamentos();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(departamento) {
      this.editingItem = departamento;
      this.formData = {
        nombre: departamento.nombre,
        facultad_id: departamento.facultad,
        activo: departamento.activo
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        facultad_id: '',
        activo: true
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
        this.filteredDepartamentos = [...this.departamentos];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredDepartamentos = this.departamentos.filter(dep =>
          dep.nombre.toLowerCase().includes(term) ||
          dep.id.toString().includes(term) ||
          (dep.facultad_detalle?.nombre?.toLowerCase().includes(term))
        );
      }
    }
  }
};
