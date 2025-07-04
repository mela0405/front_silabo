<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Semestres del Plan</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Semestre
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Semestre' : 'Nuevo Semestre' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el nombre del semestre"
            />
          </div>

          <div class="form-group">
            <label for="detalles">Detalles *</label>
            <textarea
              id="detalles"
              v-model="formData.detalles"
              class="form-input"
              required
              placeholder="Ingrese detalles del semestre"
            ></textarea>
          </div>

          <div class="highlight-box">
            <div class="form-group">
              <label for="plan_id">Plan Curricular *</label>
              <select
                id="plan_id"
                v-model="formData.plan_id"
                class="form-input"
                required
              >
                <option disabled value="">Seleccione un plan</option>
                <option v-for="plan in planes" :key="plan.id" :value="plan.id">
                  {{ plan.tag }}
                </option>
              </select>
            </div>
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

    <!-- Búsqueda y paginación -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar semestres..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de semestres -->
    <div class="data-table">
      <div v-if="loading && !semestres.length" class="loading">
        Cargando semestres...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchSemestres" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedSemestres.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron semestres' : 'No hay semestres registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Detalles</th>
              <th>Plan</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="semestre in paginatedSemestres" :key="semestre.id">
              <td>{{ semestre.id }}</td>
              <td>{{ semestre.nombre }}</td>
              <td>{{ semestre.detalles }}</td>
              <td>{{ semestre.plan_detalle?.tag || 'N/A' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(semestre)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(semestre)" class="btn btn-sm btn-danger">Eliminar</button>
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
import SemestrePlanComponent from '@/scripts/semestre_plan/logicaSemestrePlan'

export default {
  ...SemestrePlanComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
