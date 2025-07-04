import { PLAN_CURRICULAR_API, CARRERAS_API } from "@/config/constants";

export default {
  name: 'PlanCurricularComponent',
  data() {
    return {
      planes: [],
      carreras: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        tag: '',
        fecha_culminacion: '',
        carrera_id: '',
        en_vigor: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredPlanes: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredPlanes.length;
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
    paginatedPlanes() {
      return this.filteredPlanes.slice(this.startIndex, this.endIndex);
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
    planes() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchPlanes();
    this.fetchCarreras();
  },
  methods: {
    async fetchCarreras() {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(CARRERAS_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las carreras');

        this.carreras = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      }
    },

    async fetchPlanes() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(PLAN_CURRICULAR_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar los planes');

        this.planes = await response.json();
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
          ? PLAN_CURRICULAR_API.DETAIL(this.editingItem.id)
          : PLAN_CURRICULAR_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          tag: this.formData.tag,
          fecha_culminacion: this.formData.fecha_culminacion,
          en_vigor: this.formData.en_vigor,
          carrera: this.formData.carrera_id
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

        await this.fetchPlanes();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(plan) {
      if (!confirm(`¿Está seguro de eliminar el plan "${plan.tag}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(PLAN_CURRICULAR_API.DETAIL(plan.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar el plan');

        await this.fetchPlanes();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(plan) {
      this.editingItem = plan;
      this.formData = {
        tag: plan.tag,
        fecha_culminacion: plan.fecha_culminacion,
        carrera_id: plan.carrera,
        en_vigor: plan.en_vigor
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        tag: '',
        fecha_culminacion: '',
        carrera_id: '',
        en_vigor: true
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
        this.filteredPlanes = [...this.planes];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredPlanes = this.planes.filter(plan =>
          plan.tag.toLowerCase().includes(term) ||
          plan.id.toString().includes(term) ||
          plan.carrera_detalle?.nombre?.toLowerCase().includes(term)
        );
      }
    }
  }
};
