<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Planes</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Plan
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Plan' : 'Nuevo Plan' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="tag">TAG *</label>
            <input id="tag" v-model="formData.tag" type="text" class="form-input" required
              placeholder="Ingrese el TAG del plan" />
          </div>

          <div class="form-group">
            <label for="fecha_culminacion">Fecha de Culminación *</label>
            <input id="fecha_culminacion" v-model="formData.fecha_culminacion" type="date" class="form-input" required />
          </div>

          <!-- BOX del campo Carrera -->
          <div class="highlight-box">
            <div class="form-group">
              <label for="carrera_id">Carrera *</label>
              <select id="carrera_id" v-model="formData.carrera_id" class="form-input" required>
                <option disabled value="">Seleccione una carrera</option>
                <option v-for="c in carreras" :key="c.id" :value="c.id">
                  {{ c.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.en_vigor" type="checkbox" class="form-checkbox" />
              <span class="checkbox-text">Plan en vigor</span>
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Búsqueda y paginación -->
    <div class="table-controls">
      <div class="search-container">
        <input v-model="searchTerm" type="text" placeholder="Buscar planes..." class="search-input"
          @input="handleSearch" />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de planes -->
    <div class="data-table">
      <div v-if="loading && !planes.length" class="loading">
        Cargando planes...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchPlanes" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedPlanes.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron planes que coincidan con la búsqueda' : 'No hay planes registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>TAG</th>
              <th>Fecha Culminación</th>
              <th>Carrera</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in paginatedPlanes" :key="plan.id">
              <td>{{ plan.id }}</td>
              <td>{{ plan.tag }}</td>
              <td>{{ plan.fecha_culminacion }}</td>
              <td>{{ plan.carrera_detalle?.nombre }}</td>
              <td>
                <span :class="['estado-badge', plan.en_vigor ? 'activa' : 'inactiva']">
                  {{ plan.en_vigor ? 'Vigente' : 'No Vigente' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(plan)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(plan)" class="btn btn-sm btn-danger">Eliminar</button>
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
        <button @click="goToPage(1)" :disabled="currentPage === 1" class="btn btn-pagination">‹‹</button>
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-pagination">‹</button>

        <template v-for="page in visiblePages" :key="page">
          <button v-if="page !== '...'" @click="goToPage(page)"
            :class="['btn', 'btn-pagination', { 'active': page === currentPage }]">
            {{ page }}
          </button>
          <span v-else class="pagination-dots">...</span>
        </template>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-pagination">›</button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="btn btn-pagination">››</button>
      </div>

      <div class="pagination-controls">
        <select v-model="itemsPerPage" @change="changeItemsPerPage" class="items-per-page-select">
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
import PlanCurricularComponent from '@/scripts/plan_curricular/logicaPlanCurricular'

export default {
  ...PlanCurricularComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
