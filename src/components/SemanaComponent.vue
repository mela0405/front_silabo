<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Semanas</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nueva Semana
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Semana' : 'Nueva Semana' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="numero">Número *</label>
            <input
              id="numero"
              v-model="formData.numero"
              type="number"
              class="form-input"
              required
              placeholder="Ingrese el número de la semana"
            />
          </div>

          <div class="form-group">
            <label for="contenido">Contenido *</label>
            <textarea
              id="contenido"
              v-model="formData.contenido"
              class="form-input"
              required
              placeholder="Ingrese el contenido de la semana"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="activo">Activo</label>
            <input
              id="activo"
              v-model="formData.activo"
              type="checkbox"
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
          placeholder="Buscar semanas..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Tabla de semanas -->
    <div class="data-table">
      <div v-if="loading && !semanas.length" class="loading">
        Cargando semanas...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchSemanas" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedSemanas.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron semanas que coincidan con la búsqueda' : 'No hay semanas registradas' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Contenido</th>
              <th>Activo</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedSemanas" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.numero }}</td>
              <td>{{ item.contenido }}</td>
              <td>{{ item.activo ? 'Sí' : 'No' }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="editItem(item)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(item)" class="btn btn-sm btn-danger">Eliminar</button>
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
            :class="['btn', 'btn-pagination', { active: page === currentPage }]"
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
import SemanaComponent from '@/scripts/semana/logicaSemana'
export default {
  ...SemanaComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
