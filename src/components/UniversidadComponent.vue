<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Universidades</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nueva Universidad
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Universidad' : 'Nueva Universidad' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el nombre de la universidad"
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

    <!-- Información de paginación y búsqueda -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar universidades..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de universidades -->
    <div class="data-table">
      <div v-if="loading && !universidades.length" class="loading">
        Cargando universidades...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchUniversidades" class="btn btn-secondary">Reintentar</button>
      </div>
      
      <div v-else-if="!paginatedUniversidades.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron universidades que coincidan con la búsqueda' : 'No hay universidades registradas' }}
      </div>
      
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="universidad in paginatedUniversidades" :key="universidad.id">
              <td class="text-content id-column">{{ universidad.id }}</td>
              <td class="text-content nombre-column">{{ universidad.nombre }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="editItem(universidad)" class="btn btn-sm btn-warning">
                    Editar
                  </button>
                  <button @click="deleteItem(universidad)" class="btn btn-sm btn-danger">
                    Eliminar
                  </button>
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
        <button 
          @click="goToPage(1)" 
          :disabled="currentPage === 1"
          class="btn btn-pagination"
        >
          ‹‹
        </button>
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="btn btn-pagination"
        >
          ‹
        </button>
        
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
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="btn btn-pagination"
        >
          ›
        </button>
        <button 
          @click="goToPage(totalPages)" 
          :disabled="currentPage === totalPages"
          class="btn btn-pagination"
        >
          ››
        </button>
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
import UniversidadComponent from '@/scripts/universidad/logicaUniversidad'
export default {
  ...UniversidadComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>