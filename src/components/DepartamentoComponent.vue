<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Departamentos</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Departamento
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Departamento' : 'Nuevo Departamento' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input id="nombre" v-model="formData.nombre" type="text" class="form-input" required
              placeholder="Ingrese el nombre del departamento" />
          </div>

          <!-- BOX del campo Facultad -->
          <div class="highlight-box">
            <div class="form-group">
              <label for="facultad">Facultad *</label>
              <select id="facultad" v-model="formData.facultad_id" class="form-input" required>
                <option disabled value="">Seleccione una facultad</option>
                <option v-for="fac in facultades" :key="fac.id" :value="fac.id">
                  {{ fac.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.activo" type="checkbox" class="form-checkbox" />
              <span class="checkbox-text">Departamento activo</span>
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
        <input v-model="searchTerm" type="text" placeholder="Buscar departamentos..." class="search-input"
          @input="handleSearch" />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de departamentos -->
    <div class="data-table">
      <div v-if="loading && !departamentos.length" class="loading">
        Cargando departamentos...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchDepartamentos" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedDepartamentos.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron departamentos que coincidan con la búsqueda' : 'No hay departamentos registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Facultad</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="depto in paginatedDepartamentos" :key="depto.id">
              <td>{{ depto.id }}</td>
              <td>{{ depto.nombre }}</td>
              <td>{{ depto.facultad_detalle?.nombre }}</td>
              <td>
                <span :class="['estado-badge', depto.activo ? 'activa' : 'inactiva']">
                  {{ depto.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(depto)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(depto)" class="btn btn-sm btn-danger">Eliminar</button>
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
import DepartamentoComponent from '@/scripts/departamento/logicaDepartamento'

export default {
  ...DepartamentoComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
