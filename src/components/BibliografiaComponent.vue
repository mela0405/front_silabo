<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Bibliografías</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nueva Bibliografía
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Bibliografía' : 'Nueva Bibliografía' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el nombre de la bibliografía"
            />
          </div>

          <div class="form-group">
            <label for="autores">Autores *</label>
            <input
              id="autores"
              v-model="formData.autores"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese los autores"
            />
          </div>

          <div class="form-group">
            <label for="libro">Libro *</label>
            <input
              id="libro"
              v-model="formData.libro"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el título del libro"
            />
          </div>

          <div class="form-group">
            <label for="fecha">Fecha</label>
            <input
              id="fecha"
              v-model="formData.fecha"
              type="date"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="link">Enlace</label>
            <input
              id="link"
              v-model="formData.link"
              type="url"
              class="form-input"
              placeholder="https://ejemplo.com"
            />
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
          placeholder="Buscar bibliografías..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Tabla de bibliografías -->
    <div class="data-table">
      <div v-if="loading && !bibliografias.length" class="loading">
        Cargando bibliografías...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchBibliografias" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedBibliografias.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron bibliografías que coincidan con la búsqueda' : 'No hay bibliografías registradas' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Autores</th>
              <th>Libro</th>
              <th>Fecha</th>
              <th>Link</th>
              <th>Activo</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedBibliografias" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.autores }}</td>
              <td>{{ item.libro }}</td>
              <td>{{ item.fecha }}</td>
              <td>
                <a v-if="item.link" :href="item.link" target="_blank">{{ item.link }}</a>
              </td>
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
import BibliografiaComponent from '@/scripts/bibliografia/logicaBibliografia'
export default {
  ...BibliografiaComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
