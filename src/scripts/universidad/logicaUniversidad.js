import {UNIVERSIDADES_API} from '@/config/constants'

export default {
  name: 'UniversidadComponent',
  data() {
    return {
      universidades: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: ''
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredUniversidades: []
    }
  },
  computed: {
    totalItems() {
      return this.filteredUniversidades.length;
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
    paginatedUniversidades() {
      return this.filteredUniversidades.slice(this.startIndex, this.endIndex);
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
    universidades() {
      this.applyFilters();
    }
  },
  mounted() {
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

    async submitForm() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem 
          ? UNIVERSIDADES_API.DETAIL(this.editingItem.id)
          : UNIVERSIDADES_API.LIST;
        
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
        
        await this.fetchUniversidades();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(universidad) {
      if (!confirm(`¿Está seguro de eliminar la universidad "${universidad.nombre}"?`)) {
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(UNIVERSIDADES_API.DETAIL(universidad.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al eliminar la universidad');
        }
        
        await this.fetchUniversidades();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(universidad) {
      this.editingItem = universidad;
      this.formData = {
        nombre: universidad.nombre
      };
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: ''
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
        this.filteredUniversidades = [...this.universidades];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredUniversidades = this.universidades.filter(universidad =>
          universidad.nombre.toLowerCase().includes(term) ||
          universidad.id.toString().includes(term)
        );
      }
    }
  }
}