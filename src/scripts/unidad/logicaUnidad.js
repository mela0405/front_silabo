import { UNIDAD_API, SEMANA_API, METODOLOGIA_API, BIBLIOGRAFIA_API } from '@/config/constants';

export default {
  name: 'UnidadComponent',
  data() {
    return {
      unidades: [],
      semanas: [],
      metodologias: [],
      bibliografias: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        inicio: '',
        final: '',
        descripcion: '',
        activo: true,
        semana_id: '',
        metodologia_id: '',
        bibliografia_id: ''
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredUnidades: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredUnidades.length;
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
    paginatedUnidades() {
      return this.filteredUnidades.slice(this.startIndex, this.endIndex);
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
    unidades() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchUnidades();
    this.fetchSemanas();
    this.fetchMetodologias();
    this.fetchBibliografias();
  },
  methods: {
    async fetchUnidades() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(UNIDAD_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Error al cargar unidades');
        this.unidades = await res.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchSemanas() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SEMANA_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar semanas');
        this.semanas = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },
    async fetchMetodologias() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(METODOLOGIA_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar metodologías');
        this.metodologias = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },
    async fetchBibliografias() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(BIBLIOGRAFIA_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar bibliografías');
        this.bibliografias = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },
    async submitForm() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem ? UNIDAD_API.DETAIL(this.editingItem.id) : UNIDAD_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          inicio: this.formData.inicio,
          final: this.formData.final,
          descripcion: this.formData.descripcion,
          activo: this.formData.activo,
          semana: this.formData.semana_id,
          metodologia: this.formData.metodologia_id,
          bibliografia: this.formData.bibliografia_id
        };

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(Object.values(errorData).flat().join(', '));
        }

        await this.fetchUnidades();
        this.cancelForm();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    editItem(unidad) {
      this.editingItem = unidad;
      this.formData = {
        inicio: unidad.inicio,
        final: unidad.final,
        descripcion: unidad.descripcion,
        activo: unidad.activo,
        semana_id: unidad.semana,
        metodologia_id: unidad.metodologia,
        bibliografia_id: unidad.bibliografia
      };
      this.showCreateForm = true;
    },
    async deleteItem(unidad) {
      if (!confirm(`¿Está seguro de eliminar la unidad con ID ${unidad.id}?`)) return;
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(UNIDAD_API.DETAIL(unidad.id), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al eliminar la unidad');
        await this.fetchUnidades();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    cancelForm() {
      this.editingItem = null;
      this.showCreateForm = false;
      this.formData = {
        inicio: '',
        final: '',
        descripcion: '',
        activo: true,
        semana_id: '',
        metodologia_id: '',
        bibliografia_id: ''
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
        this.filteredUnidades = [...this.unidades];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredUnidades = this.unidades.filter(u =>
          u.descripcion.toLowerCase().includes(term) ||
          u.id.toString().includes(term) ||
          u.semana_detalle?.numero?.toString().includes(term) ||
          u.metodologia_detalle?.tipo?.toLowerCase().includes(term) ||
          u.bibliografia_detalle?.nombre?.toLowerCase().includes(term)
        );
      }
    }
  }
};
