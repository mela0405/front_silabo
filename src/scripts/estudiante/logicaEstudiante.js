import { ESTUDIANTES_API } from "@/config/constants";

export default {
  name: 'EstudiantesComponent',
  data() {
    return {
      estudiantes: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: '',
        fecha_nacimiento: '',
        nacionalidad: '',
        email: ''
      },
      // Paginación
      currentPage: 1,
      itemsPerPage: 10,
      // Búsqueda
      searchTerm: '',
      filteredEstudiantes: []
    }
  },
  computed: {
    totalItems() {
      return this.filteredEstudiantes.length;
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
    paginatedEstudiantes() {
      return this.filteredEstudiantes.slice(this.startIndex, this.endIndex);
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
    estudiantes() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(ESTUDIANTES_API.LIST, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los estudiantes');
        }
        
        this.estudiantes = await response.json();
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
          ? ESTUDIANTES_API.DETAIL(this.editingItem.id)
          : ESTUDIANTES_API.LIST;
        
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
        
        await this.fetchEstudiantes();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(estudiante) {
      const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`;
      if (!confirm(`¿Está seguro de eliminar al estudiante "${nombreCompleto}"?`)) {
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(ESTUDIANTES_API.DETAIL(estudiante.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al eliminar el estudiante');
        }
        
        await this.fetchEstudiantes();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(estudiante) {
      this.editingItem = estudiante;
      this.formData = {
        nombre: estudiante.nombre,
        apellido_paterno: estudiante.apellido_paterno,
        apellido_materno: estudiante.apellido_materno,
        genero: estudiante.genero,
        fecha_nacimiento: estudiante.fecha_nacimiento,
        nacionalidad: estudiante.nacionalidad,
        email: estudiante.email
      };
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        genero: '',
        fecha_nacimiento: '',
        nacionalidad: '',
        email: ''
      };
      this.error = null;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
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
        this.filteredEstudiantes = [...this.estudiantes];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredEstudiantes = this.estudiantes.filter(estudiante => {
          const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`.toLowerCase();
          return nombreCompleto.includes(term) ||
                 estudiante.email.toLowerCase().includes(term) ||
                 estudiante.nacionalidad.toLowerCase().includes(term) ||
                 estudiante.id.toString().includes(term);
        });
      }
    }
  }
}