import { SEMESTRE_PLAN_API, PLAN_CURRICULAR_API } from '@/config/constants';

export default {
  name: 'SemestrePlanComponent',
  data() {
    return {
      semestres: [],
      planes: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        detalles: '',
        plan_id: ''
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredSemestres: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredSemestres.length;
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
    paginatedSemestres() {
      return this.filteredSemestres.slice(this.startIndex, this.endIndex);
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
    semestres() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchSemestres();
    this.fetchPlanes();
  },
  methods: {
    async fetchPlanes() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(PLAN_CURRICULAR_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar los planes curriculares');
        this.planes = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      }
    },

    async fetchSemestres() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(SEMESTRE_PLAN_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar los semestres');
        this.semestres = await response.json();
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
          ? SEMESTRE_PLAN_API.DETAIL(this.editingItem.id)
          : SEMESTRE_PLAN_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          nombre: this.formData.nombre,
          detalles: this.formData.detalles,
          plan: this.formData.plan_id
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

        await this.fetchSemestres();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(semestre) {
      if (!confirm(`¿Está seguro de eliminar el semestre "${semestre.nombre}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(SEMESTRE_PLAN_API.DETAIL(semestre.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar el semestre');

        await this.fetchSemestres();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(semestre) {
      this.editingItem = semestre;
      this.formData = {
        nombre: semestre.nombre,
        detalles: semestre.detalles,
        plan_id: semestre.plan
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        detalles: '',
        plan_id: ''
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
        this.filteredSemestres = [...this.semestres];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSemestres = this.semestres.filter(sem =>
          sem.nombre.toLowerCase().includes(term) ||
          sem.id.toString().includes(term) ||
          sem.plan_detalle?.tag?.toLowerCase().includes(term)
        );
      }
    }
  }
};
