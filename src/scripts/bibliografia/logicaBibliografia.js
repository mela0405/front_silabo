import { BIBLIOGRAFIA_API } from '@/config/constants'

export default {
  name: 'BibliografiaComponent',
  data() {
    return {
      bibliografias: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        autor: '',
        libro: '',
        fecha: '',
        link: '',
        nombre: '',
        activo: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredBibliografias: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredBibliografias.length;
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
    paginatedBibliografias() {
      return this.filteredBibliografias.slice(this.startIndex, this.endIndex);
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
    bibliografias() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchBibliografias();
  },
  methods: {
    async fetchBibliografias() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(BIBLIOGRAFIA_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las bibliografías');
        this.bibliografias = await response.json();
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
          ? BIBLIOGRAFIA_API.DETAIL(this.editingItem.id)
          : BIBLIOGRAFIA_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          autor: this.formData.autor,
          libro: this.formData.libro,
          fecha: this.formData.fecha,
          link: this.formData.link,
          nombre: this.formData.nombre,
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

        await this.fetchBibliografias();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(item) {
      if (!confirm(`¿Está seguro de eliminar la bibliografía "${item.nombre}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(BIBLIOGRAFIA_API.DETAIL(item.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar la bibliografía');

        await this.fetchBibliografias();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(item) {
      this.editingItem = item;
      this.formData = {
        autor: item.autor,
        libro: item.libro,
        fecha: item.fecha,
        link: item.link,
        nombre: item.nombre,
        activo: item.activo
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        autor: '',
        libro: '',
        fecha: '',
        link: '',
        nombre: '',
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
      const term = this.searchTerm.toLowerCase();
      if (!term) {
        this.filteredBibliografias = [...this.bibliografias];
      } else {
        this.filteredBibliografias = this.bibliografias.filter(item =>
          item.nombre.toLowerCase().includes(term) ||
          item.autor.toLowerCase().includes(term) ||
          item.libro.toLowerCase().includes(term) ||
          item.id.toString().includes(term)
        );
      }
    }
  }
};
