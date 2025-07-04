<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Criterios</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Criterio
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Criterio' : 'Nuevo Criterio' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input id="nombre" v-model="formData.nombre" type="text" class="form-input" required placeholder="Ingrese el nombre del criterio" />
          </div>

          <div class="form-group">
            <label for="peso">Peso *</label>
            <input id="peso" v-model="formData.peso" type="number" step="0.01" min="0" max="100" class="form-input" required placeholder="Ingrese el peso (%)" />
          </div>

          <div class="form-group">
            <label for="fecha_inicio">Fecha Inicio *</label>
            <input id="fecha_inicio" v-model="formData.fecha_inicio" type="date" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="fecha_fin">Fecha Fin *</label>
            <input id="fecha_fin" v-model="formData.fecha_fin" type="date" class="form-input" required />
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción *</label>
            <textarea id="descripcion" v-model="formData.descripcion" class="form-input" rows="3" required placeholder="Ingrese una descripción del criterio"></textarea>
          </div>

          <div class="form-group">
            <label for="activo">Activo</label>
            <input id="activo" v-model="formData.activo" type="checkbox" />
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

    <!-- Información de paginación y búsqueda -->
    <div class="table-controls">
      <div class="search-container">
        <input v-model="searchTerm" type="text" placeholder="Buscar criterios..." class="search-input" @input="handleSearch" />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de criterios -->
    <div class="data-table">
      <div v-if="loading && !criterios.length" class="loading">
        Cargando criterios...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchCriterios" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedCriterios.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron criterios que coincidan con la búsqueda' : 'No hay criterios registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Peso</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Activo</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="criterio in paginatedCriterios" :key="criterio.id">
              <td>{{ criterio.id }}</td>
              <td>{{ criterio.nombre }}</td>
              <td>{{ criterio.peso }}%</td>
              <td>{{ criterio.fecha_inicio }}</td>
              <td>{{ criterio.fecha_fin }}</td>
              <td>{{ criterio.activo ? 'Sí' : 'No' }}</td>
              <td>
                <button @click="editItem(criterio)" class="btn btn-sm btn-warning">Editar</button>
                <button @click="deleteItem(criterio)" class="btn btn-sm btn-danger">Eliminar</button>
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
          <button v-if="page !== '...'" @click="goToPage(page)" :class="['btn', 'btn-pagination', { active: page === currentPage }]">{{ page }}</button>
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
import CriterioComponent from '@/scripts/criterio/logicaCriterio'

export default {
  ...CriterioComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
