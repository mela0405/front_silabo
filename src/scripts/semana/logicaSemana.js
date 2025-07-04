import { SEMANA_API } from '@/config/constants'

export default {
  name: 'SemanaComponent',
  data() {
    return {
      semanas: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        numero: '',
        contenido: '',
        activo: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredSemanas: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredSemanas.length;
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
    paginatedSemanas() {
      return this.filteredSemanas.slice(this.startIndex, this.endIndex);
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
    semanas() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchSemanas();
  },
  methods: {
    async fetchSemanas() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(SEMANA_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las semanas');
        this.semanas = await response.json();
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
          ? SEMANA_API.DETAIL(this.editingItem.id)
          : SEMANA_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          numero: this.formData.numero,
          contenido: this.formData.contenido,
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

        await this.fetchSemanas();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(semana) {
      if (!confirm(`¿Está seguro de eliminar la semana con ID ${semana.id}?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(SEMANA_API.DETAIL(semana.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar la semana');

        await this.fetchSemanas();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(semana) {
      this.editingItem = semana;
      this.formData = {
        numero: semana.numero,
        contenido: semana.contenido,
        activo: semana.activo
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        numero: '',
        contenido: '',
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
        this.filteredSemanas = [...this.semanas];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSemanas = this.semanas.filter(item =>
          item.contenido.toLowerCase().includes(term) ||
          item.numero.toString().includes(term) ||
          item.id.toString().includes(term)
        );
      }
    }
  }
};
