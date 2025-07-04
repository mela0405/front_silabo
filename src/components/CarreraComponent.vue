<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Carreras</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nueva Carrera
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Carrera' : 'Nueva Carrera' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el nombre de la carrera"
            />
          </div>

          <!-- Departamento -->
          <div class="highlight-box">
            <div class="form-group">
              <label for="departamento">Departamento *</label>
              <select id="departamento" v-model="formData.departamento_id" class="form-input" required>
                <option disabled value="">Seleccione un departamento</option>
                <option v-for="dep in departamentos" :key="dep.id" :value="dep.id">
                  {{ dep.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.activa" type="checkbox" class="form-checkbox" />
              <span class="checkbox-text">Carrera activa</span>
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

    <!-- Información de paginación y búsqueda -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar carreras..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de carreras -->
    <div class="data-table">
      <div v-if="loading && !carreras.length" class="loading">
        Cargando carreras...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchCarreras" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedCarreras.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron carreras que coincidan con la búsqueda' : 'No hay carreras registradas' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carrera in paginatedCarreras" :key="carrera.id">
              <td>{{ carrera.id }}</td>
              <td>{{ carrera.nombre }}</td>
              <td>{{ carrera.departamento_detalle?.nombre }}</td>
              <td>
                <span :class="['estado-badge', carrera.activa ? 'activa' : 'inactiva']">
                  {{ carrera.activa ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(carrera)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(carrera)" class="btn btn-sm btn-danger">Eliminar</button>
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
import CarreraComponent from '@/scripts/carrera/logicaCarrera'

export default {
  ...CarreraComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
