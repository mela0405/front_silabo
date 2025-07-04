<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Cursos</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">Nuevo Curso</button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Curso' : 'Nuevo Curso' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="formData.nombre" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Código *</label>
            <input v-model="formData.codigo" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Descripción *</label>
            <textarea v-model="formData.descripcion" required class="form-input"></textarea>
          </div>

          <div class="form-group">
            <label>Horas Teoría *</label>
            <input v-model.number="formData.horas_teoria" type="number" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Horas Práctica *</label>
            <input v-model.number="formData.horas_practica" type="number" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Horas Laboratorio *</label>
            <input v-model.number="formData.horas_laboratorio" type="number" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Horas Teo-Pra *</label>
            <input v-model.number="formData.horas_teopra" type="number" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Créditos *</label>
            <input v-model.number="formData.creditos" type="number" required class="form-input" />
          </div>

          <div class="highlight-box">
            <div class="form-group">
              <label>Área *</label>
              <select v-model="formData.area_id" required class="form-input">
                <option disabled value="">Seleccione un área</option>
                <option v-for="area in areas" :key="area.id" :value="area.id">
                  {{ area.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Semestre *</label>
              <select v-model="formData.semestre_id" required class="form-input">
                <option disabled value="">Seleccione un semestre</option>
                <option v-for="s in semestres" :key="s.id" :value="s.id">
                  {{ s.nombre }}
                </option>
              </select>
            </div>
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
          @input="handleSearch"
          class="search-input"
          placeholder="Buscar cursos..."
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalItems }}
      </div>
    </div>

    <!-- Tabla de cursos -->
    <div class="data-table">
      <div v-if="loading && !cursos.length" class="loading">
        Cargando cursos...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchCursos" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedCursos.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron cursos' : 'No hay cursos registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Código</th>
              <th>Créditos</th>
              <th>Área</th>
              <th>Semestre</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="curso in paginatedCursos" :key="curso.id">
              <td>{{ curso.id }}</td>
              <td>{{ curso.nombre }}</td>
              <td>{{ curso.codigo }}</td>
              <td>{{ curso.creditos }}</td>
              <td>{{ curso.area_detalle?.nombre || 'N/A' }}</td>
              <td>{{ curso.semestre_detalle?.nombre || 'N/A' }}</td>
              <td>{{ curso.activo ? 'Activo' : 'Inactivo' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(curso)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(curso)" class="btn btn-sm btn-danger">Eliminar</button>
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
import CursoComponent from '@/scripts/curso/logicaCurso'
export default {
  ...CursoComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
