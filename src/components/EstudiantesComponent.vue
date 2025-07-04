<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Estudiantes</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Estudiante
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-row">
            <div class="form-group">
              <label for="nombre">Nombre *</label>
              <input
                id="nombre"
                v-model="formData.nombre"
                type="text"
                class="form-input"
                required
                placeholder="Ingrese el nombre"
              />
            </div>
            
            <div class="form-group">
              <label for="apellido_paterno">Apellido Paterno *</label>
              <input
                id="apellido_paterno"
                v-model="formData.apellido_paterno"
                type="text"
                class="form-input"
                required
                placeholder="Ingrese el apellido paterno"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="apellido_materno">Apellido Materno *</label>
              <input
                id="apellido_materno"
                v-model="formData.apellido_materno"
                type="text"
                class="form-input"
                required
                placeholder="Ingrese el apellido materno"
              />
            </div>

            <div class="form-group">
              <label for="genero">Género *</label>
              <select
                id="genero"
                v-model="formData.genero"
                class="form-input"
                required
              >
                <option value="">Seleccione género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="fecha_nacimiento">Fecha de Nacimiento *</label>
              <input
                id="fecha_nacimiento"
                v-model="formData.fecha_nacimiento"
                type="date"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="nacionalidad">Nacionalidad *</label>
              <input
                id="nacionalidad"
                v-model="formData.nacionalidad"
                type="text"
                class="form-input"
                required
                placeholder="Ingrese la nacionalidad"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              required
              placeholder="Ingrese el email"
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
          placeholder="Buscar estudiantes..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de estudiantes -->
    <div class="data-table">
      <div v-if="loading && !estudiantes.length" class="loading">
        Cargando estudiantes...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchEstudiantes" class="btn btn-secondary">Reintentar</button>
      </div>
      
      <div v-else-if="!paginatedEstudiantes.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron estudiantes que coincidan con la búsqueda' : 'No hay estudiantes registrados' }}
      </div>
      
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Género</th>
              <th>Fecha Nacimiento</th>
              <th>Nacionalidad</th>
              <th>Email</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="estudiante in paginatedEstudiantes" :key="estudiante.id">
              <td class="text-content id-column">{{ estudiante.id }}</td>
              <td class="text-content nombre-column">
                {{ `${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}` }}
              </td>
              <td class="text-content genero-column">{{ estudiante.genero === 'M' ? 'Masculino' : 'Femenino' }}</td>
              <td class="text-content fecha-column">{{ formatDate(estudiante.fecha_nacimiento) }}</td>
              <td class="text-content nacionalidad-column">{{ estudiante.nacionalidad }}</td>
              <td class="text-content email-column">{{ estudiante.email }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="editItem(estudiante)" class="btn btn-sm btn-warning">
                    Editar
                  </button>
                  <button @click="deleteItem(estudiante)" class="btn btn-sm btn-danger">
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
import EstudiantesComponent from '@/scripts/estudiante/logicaEstudiante'

export default {
  ...EstudiantesComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>