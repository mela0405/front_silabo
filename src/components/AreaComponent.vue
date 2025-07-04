<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Áreas</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nueva Área
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Área' : 'Nueva Área' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="codigo">Código *</label>
            <input
              id="codigo"
              v-model="formData.codigo"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el código del área"
            />
          </div>
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el nombre del área"
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Controles de búsqueda y paginación -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar áreas..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Tabla de áreas -->
    <div class="data-table">
      <div v-if="loading && !areas.length" class="loading">
        Cargando áreas...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchAreas" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else-if="!paginatedAreas.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron áreas que coincidan con la búsqueda' : 'No hay áreas registradas' }}
      </div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="area in paginatedAreas" :key="area.id">
              <td class="text-content id-column">{{ area.id }}</td>
              <td class="text-content codigo-column">{{ area.codigo }}</td>
              <td class="text-content nombre-column">{{ area.nombre }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="editItem(area)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(area)" class="btn btn-sm btn-danger">Eliminar</button>
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
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="['btn', 'btn-pagination', { 'active': page === currentPage }]"
          >
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
import AreaComponent from '@/scripts/area/logicaArea'

export default {
  ...AreaComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
