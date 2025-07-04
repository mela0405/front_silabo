<template>
  <div class="general-component">
    <!-- Encabezado -->
    <div class="component-header">
      <h2>Gestión de Unidades</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">Nueva Unidad</button>
    </div>

    <!-- Formulario -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Unidad' : 'Nueva Unidad' }}</h3>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Número</label>
            <input v-model="formData.numero" type="number" class="form-input" />
          </div>

          <div class="form-group">
            <label>Inicio *</label>
            <input v-model="formData.inicio" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Final *</label>
            <input v-model="formData.final" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Descripción *</label>
            <textarea v-model="formData.descripcion" required class="form-input"></textarea>
          </div>

          <div class="form-group">
            <label>Metodología *</label>
            <textarea v-model="formData.metodologia" required class="form-input"></textarea>
          </div>

          <!-- SELECT de Sílabos -->
          <div class="form-group">
            <label>Sílabo *</label>
            <select v-model="formData.silabo" required class="form-input">
              <option disabled value="">Seleccione un sílabo</option>
              <option v-for="s in silabos" :key="s.id" :value="s.id">
                {{ s.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formData.activo" />
              Activo
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando…' : (editingItem ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          class="search-input"
          placeholder="Buscar unidades..."
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalItems }}
      </div>
    </div>

    <!-- Tabla -->
    <div class="data-table">
      <div v-if="loading && !unidades.length" class="loading">Cargando unidades...</div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchUnidades" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else-if="!paginatedUnidades.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron unidades' : 'No hay unidades registradas' }}
      </div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Inicio</th>
              <th>Final</th>
              <th>Descripción</th>
              <th>Metodología</th>
              <th>Sílabo</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unidad in paginatedUnidades" :key="unidad.id">
              <td>{{ unidad.id }}</td>
              <td>{{ unidad.numero }}</td>
              <td>{{ unidad.inicio }}</td>
              <td>{{ unidad.final }}</td>
              <td>{{ unidad.descripcion }}</td>
              <td>{{ unidad.metodologia }}</td>
              <td>{{ unidad.silabo_detalle || unidad.silabo }}</td>
              <td>{{ unidad.activo ? 'Sí' : 'No' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(unidad)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(unidad)" class="btn btn-sm btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination-container">
      <div class="pagination">
        <button @click="goToPage(1)" :disabled="currentPage === 1">‹‹</button>
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">‹</button>
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="{ active: page === currentPage }"
          >
            {{ page }}
          </button>
          <span v-else class="pagination-dots">...</span>
        </template>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">›</button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">››</button>
      </div>

      <div class="pagination-controls">
        <select v-model="itemsPerPage" @change="changeItemsPerPage">
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
// src/scripts/unidad/logicaUnidad.js
import { UNIDAD_API, SILABO_API } from '@/config/constants';

export default {
  name: 'UnidadComponent',
  data() {
    return {
      /* ──────────── datos ──────────── */
      unidades: [],
      silabos: [],          // ← listado de sílabos para el <select>
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        numero: '',
        inicio: '',
        final: '',
        descripcion: '',
        metodologia: '',
        activo: true,
        silabo: ''          // ← id seleccionado
      },
      /* ─────────── paginación ────────── */
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredUnidades: []
    };
  },

  /* ──────────── computed ──────────── */
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
        const end   = Math.min(this.totalPages, this.currentPage + 2);
        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push('…');
        }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('…');
          pages.push(this.totalPages);
        }
      }
      return pages;
    }
  },

  /* ──────────── watchers ──────────── */
  watch: {
    unidades() {
      this.applyFilters();
    }
  },

  /* ─────────── ciclo de vida ─────────── */
  mounted() {
    this.fetchUnidades();
    this.fetchSilabos();          // ← obtenemos sílabos para el <select>
  },

  /* ───────────── métodos ───────────── */
  methods: {
    /* --- GET sílabos --- */
    async fetchSilabos() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar sílabos');
        this.silabos = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },

    /* --- GET unidades --- */
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

    /* --- POST / PUT --- */
    async submitForm() {
      this.loading = true;
      try {
        const token  = localStorage.getItem('access_token');
        const url    = this.editingItem ? UNIDAD_API.DETAIL(this.editingItem.id) : UNIDAD_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = { ...this.formData };

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

    /* --- Editar --- */
    editItem(unidad) {
      this.editingItem = unidad;
      this.formData = {
        numero: unidad.numero ?? '',
        inicio: unidad.inicio,
        final:  unidad.final,
        descripcion: unidad.descripcion,
        metodologia: unidad.metodologia,
        activo: unidad.activo,
        silabo: unidad.silabo
      };
      this.showCreateForm = true;
    },

    /* --- DELETE --- */
    async deleteItem(unidad) {
      if (!confirm(`¿Está seguro de eliminar la unidad con ID ${unidad.id}?`)) return;
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(UNIDAD_API.DETAIL(unidad.id), {
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

    /* --- Cancelar / reset --- */
    cancelForm() {
      this.editingItem   = null;
      this.showCreateForm = false;
      this.formData = {
        numero: '',
        inicio: '',
        final: '',
        descripcion: '',
        metodologia: '',
        activo: true,
        silabo: ''
      };
      this.error = null;
    },

    /* --- Paginación y búsqueda --- */
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
          u.numero?.toString().includes(term) ||
          u.metodologia?.toLowerCase().includes(term) ||
          (u.silabo_detalle ?? '').toLowerCase().includes(term)
        );
      }
    }
  }
};

</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
