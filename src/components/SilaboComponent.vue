<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Sílabos</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">Nuevo Sílabos</button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>

      <div class="silabo-form">
        <!-- Encabezado mejorado -->
        <div class="form-header">
          <div class="header-content">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
            <div>
              <h2 class="form-title">Gestión de Sílabos</h2>
              <p class="form-subtitle">{{ editingItem ? 'Editar sílabo existente' : 'Crear nuevo sílabo' }}</p>
            </div>
          </div>
          <button class="btn-close" @click="cancelForm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-box">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div class="error-content">
            <h4>Error al procesar el formulario</h4>
            <p>{{ error }}</p>
          </div>
          <button class="error-close" @click="error = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Formulario principal -->
        <form @submit.prevent="submitForm" class="form-content">

          <!-- I. DATOS GENERALES -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">I</div>
              <h3 class="section-title">Datos Generales</h3>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Facultad</label>
                <select v-model="formData.facultad" class="form-select" required>
                  <option value="">Seleccionar facultad</option>
                  <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                    {{ facultad.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Semestre</label>
                <input v-model="formData.semestre" type="text" class="form-input" placeholder="VII" required>
              </div>

              <div class="form-group">
                <label class="form-label required">Área de formación</label>
                <input v-model="formData.area_formacion" type="text" class="form-input"
                  placeholder="Ingeniería de software" required>
              </div>

              <div class="form-group">
                <label class="form-label required">Tipo de curso</label>
                <select v-model="formData.tipo_curso" class="form-select" required>
                  <option value="">Seleccionar tipo</option>
                  <option v-for="tipo in tiposCurso" :key="tipo.id" :value="tipo.id">
                    {{ tipo.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Carrera profesional</label>
                <select v-model="formData.carrera_profesional" class="form-select" required>
                  <option value="">Seleccionar carrera</option>
                  <option v-for="carrera in carreras" :key="carrera.id" :value="carrera.id">
                    {{ carrera.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">N.º de créditos</label>
                <input v-model.number="formData.nro_creditos" type="number" min="1" max="10" class="form-input"
                  placeholder="3" required>
              </div>

              <div class="form-group">
                <label class="form-label">Pre-requisito(s)</label>
                <input v-model="formData.prerrequisitos" type="text" class="form-input" placeholder="Compiladores">
              </div>

              <div class="form-group">
                <label class="form-label required">Periodo lectivo</label>
                <select v-model="formData.periodo_lectivo" class="form-select" required>
                  <option value="">Seleccionar periodo lectivo</option>
                  <option v-for="periodo in periodosLectivos" :key="periodo.id" :value="periodo.id">
                    {{ periodo.periodo }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Horas de teoría</label>
                <input v-model.number="formData.horas_teoria" type="number" min="0" max="20" class="form-input"
                  placeholder="3" required>
              </div>

              <div class="form-group">
                <label class="form-label required">Horas de práctica</label>
                <input v-model.number="formData.horas_practica" type="number" min="0" max="20" class="form-input"
                  placeholder="2" required>
              </div>

              <div class="form-group">
                <label class="form-label required">Código del curso</label>
                <input v-model="formData.codigo_curso" type="text" class="form-input" placeholder="3.7.3.21" required>
              </div>

              <div class="form-group">
                <label class="form-label required">Curso</label>
                <select v-model="formData.curso" class="form-select" required>
                  <option value="">Seleccionar curso</option>
                  <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                    {{ curso.codigo }} - {{ curso.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Profesor</label>
                <select v-model="formData.profesor" class="form-select" required>
                  <option value="">Seleccionar profesor</option>
                  <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
                    {{ profesor.persona?.nombre || profesor.nombre }} - {{ profesor.persona?.usuario?.email ||
                      profesor.email || 'Sin email' }}
                  </option>
                </select>
              </div>



              <div class="form-group">
                <label class="form-label required">Docente responsable</label>
                <input v-model="formData.docente" type="text" class="form-input" placeholder="Nombre del docente"
                  required>
              </div>

              <div class="form-group">
                <label class="form-label required">Correo institucional</label>
                <input v-model="formData.correo_docente" type="email" class="form-input"
                  placeholder="docente@universidad.edu" required>
              </div>
            </div>
          </div>

          <!-- II. COMPETENCIA DEL CURSO -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">II</div>
              <h3 class="section-title">Competencia del Curso</h3>
            </div>
            <div class="form-group">
              <textarea v-model="formData.competencia_curso" class="form-textarea" rows="4"
                placeholder="Describe la competencia principal que desarrollará el estudiante al completar este curso..."></textarea>
            </div>
          </div>

          <!-- III. COMPETENCIA DEL PERFIL DE EGRESO -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">III</div>
              <h3 class="section-title">Competencia del Perfil de Egreso</h3>
            </div>
            <div class="form-group">
              <textarea v-model="formData.competencia_perfil" class="form-textarea" rows="4"
                placeholder="Describe cómo contribuye este curso al perfil de egreso del estudiante..."></textarea>
            </div>
          </div>

          <!-- IV. COMPETENCIAS PREVIAS -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">IV</div>
              <h3 class="section-title">Competencias Previas Necesarias</h3>
            </div>
            <div class="form-group">
              <textarea v-model="formData.competencias_previas" class="form-textarea" rows="3"
                placeholder="Ej: Habilidades avanzadas de programación, conocimientos de estructuras de datos..."></textarea>
            </div>
          </div>

          <!-- V. SUMILLA -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">V</div>
              <h3 class="section-title">Sumilla</h3>
            </div>
            <div class="form-group">
              <textarea v-model="formData.sumilla" class="form-textarea" rows="4"
                placeholder="Resumen ejecutivo del contenido y objetivos del curso..."></textarea>
            </div>
          </div>

          <!-- VI. UNIDADES DE APRENDIZAJE -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">VI</div>
              <h3 class="section-title">Unidades de Aprendizaje</h3>
              <button type="button" class="btn-add" @click="addUnidad">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Añadir Unidad
              </button>
            </div>

            <div v-if="formData.unidades.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
              </div>
              <p class="empty-text">No hay unidades de aprendizaje definidas</p>
              <p class="empty-subtext">Haz clic en "Añadir Unidad" para comenzar</p>
            </div>

            <div v-for="(unidad, idx) in formData.unidades" :key="idx" class="unidad-card">
              <div class="unidad-header">
                <h4 class="unidad-title">Unidad {{ idx + 1 }}</h4>
                <button type="button" class="btn-remove" @click="removeUnidad(idx)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                  </svg>
                </button>
              </div>

              <div class="unidad-content">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label required">Denominación</label>
                    <input v-model="unidad.denominacion" type="text" class="form-input"
                      placeholder="Nombre de la unidad" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Fecha de inicio</label>
                    <input v-model="unidad.inicio" type="text" class="form-input" placeholder="aaaa-mm-dd" required>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Fecha de fin</label>
                    <input v-model="unidad.final" type="text" class="form-input" placeholder="aaaa-mm-dd" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Competencia específica</label>
                  <textarea v-model="unidad.competencia" class="form-textarea" rows="2"
                    placeholder="Competencia específica de esta unidad..."></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Contenidos específicos</label>
                  <textarea v-model="unidad.contenidos" class="form-textarea" rows="3"
                    placeholder="Lista los contenidos (Capítulo, tema, etc.)"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Metodología</label>
                  <textarea v-model="unidad.metodologia" class="form-textarea" rows="2"
                    placeholder="Metodología de enseñanza para esta unidad..."></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Fuentes de consulta</label>
                  <textarea v-model="unidad.fuentes" class="form-textarea" rows="2"
                    placeholder="Bibliografía y fuentes de consulta..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- VII. ACTIVIDADES RSU -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">VII</div>
              <h3 class="section-title">Actividades (RSU)</h3>
              <button type="button" class="btn-add" @click="addActividad">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Añadir Actividad
              </button>
            </div>

            <!-- Actividades individuales -->
            <div v-if="formData.actividades.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <p class="empty-text">No hay actividades RSU definidas</p>
              <p class="empty-subtext">Haz clic en "Añadir Actividad" para comenzar</p>
            </div>

            <div v-for="(actividad, idx) in formData.actividades" :key="idx" class="actividad-card">
              <div class="actividad-header">
                <h4 class="actividad-title">Actividad {{ idx + 1 }}</h4>
                <button type="button" class="btn-remove" @click="removeActividad(idx)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3,6 5,6 21,6" />
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" />
                  </svg>
                </button>
              </div>

              <div class="actividad-content">
                <div class="form-group">
                  <label class="form-label required">Nombre de la Actividad</label>
                  <input v-model="actividad.nombre" type="text" class="form-input"
                    placeholder="Ej: Charla sobre medio ambiente, Visita a comunidad, etc." required>
                </div>

                <div class="form-group">
                  <label class="form-label required">Descripción</label>
                  <textarea v-model="actividad.descripcion" class="form-textarea" rows="3"
                    placeholder="Describe detalladamente la actividad de responsabilidad social universitaria..."
                    required></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- VIII. CRITERIOS DE EVALUACIÓN -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-number">VIII</div>
              <h3 class="section-title">Criterios de Evaluación</h3>
              <button type="button" class="btn-add" @click="addCriterio">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Añadir Criterio
              </button>
            </div>

            <div v-if="formData.criterios.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p class="empty-text">No hay criterios de evaluación definidos</p>
              <p class="empty-subtext">Haz clic en "Añadir Criterio" para comenzar</p>
            </div>

            <div v-else class="criterios-table">
              <div class="table-header">
                <div class="table-cell">Evaluación</div>
                <div class="table-cell">Peso (%)</div>
                <div class="table-cell">Fecha Inicio</div>
                <div class="table-cell">Fecha Fin</div>
                <div class="table-cell">Descripción</div>
                <div class="table-cell">Acción</div>
              </div>

              <div v-for="(crit, idx) in formData.criterios" :key="idx" class="table-row">
                <div class="table-cell">
                  <input v-model="crit.evaluacion" type="text" class="form-input-sm" placeholder="Examen parcial"
                    required>
                  <!-- Indicador de estado -->
                  <small v-if="crit.id" class="text-blue-600">✓ Guardado</small>
                  <small v-else class="text-orange-600">⚠ Nuevo</small>
                </div>
                <div class="table-cell">
                  <input v-model.number="crit.peso" type="number" min="0" max="100" class="form-input-sm"
                    placeholder="30" required>
                </div>
                <div class="table-cell">
                  <input v-model="crit.fecha" type="date" class="form-input-sm" required>
                </div>
                <div class="table-cell">
                  <input v-model="crit.fecha_fin" type="date" class="form-input-sm">
                </div>
                <div class="table-cell">
                  <textarea v-model="crit.descripcion" class="form-input-sm" placeholder="Descripción detallada"
                    rows="2"></textarea>
                </div>
                <div class="table-cell">
                  <button type="button" class="btn-remove-sm" @click="removeCriterio(idx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Resumen de pesos -->
              <div class="peso-summary"
                :class="{ 'peso-warning': totalPeso > 100, 'peso-complete': totalPeso === 100 }">
                <strong>Total: {{ totalPeso }}%</strong>
                <span v-if="totalPeso > 100" class="peso-message">⚠️ Excede 100%</span>
                <span v-else-if="totalPeso === 100" class="peso-message">✅ Completo</span>
                <span v-else class="peso-message">Falta {{ 100 - totalPeso }}%</span>
              </div>

              <!-- Información adicional -->
              <div v-if="criteriosExistentes.length > 0" class="info-box">
                <p class="text-sm text-gray-600">
                  📋 Se cargaron {{ criteriosExistentes.length }} criterios existentes del servidor
                </p>
              </div>
            </div>
          </div>

          <!-- ACCIONES -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="cancelForm" :disabled="loading">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar Sílabo' : 'Crear Sílabo') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de sílabos -->
    <div class="data-table">
      <div v-if="loading && !silabos.length" class="loading">Cargando sílabos...</div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchSilabos" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else-if="!paginatedSilabos.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron sílabos' : 'No hay sílabos registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Profesor</th>
              <th>Periodo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in paginatedSilabos" :key="s.id">
              <td>{{ s.id }}</td>
              <td>{{ s.nombre }}</td>
              <td>{{ s.curso_detalle?.nombre || 'N/A' }}</td>
              <td>{{ s.profesor_detalle?.persona?.nombre || 'N/A' }}</td>
              <td>{{ s.periodo_lectivo_detalle?.periodo || 'N/A' }}</td>
              <td>{{ s.activo ? 'Activo' : 'Inactivo' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(s)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(s)" class="btn btn-sm btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SilaboComponent from '@/scripts/silabo/logicaSilabo'
export default {
  ...SilaboComponent
}
</script>

<style scoped>
@import '@/assets/silabo/particular.css';
@import '@/assets/global_design/general_component_design.css';


.criterios-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 3fr 0.5fr;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 3fr 0.5fr;
  border-bottom: 1px solid #e9ecef;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-cell {
  padding: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
}

.form-input-sm {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.form-input-sm:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-remove-sm {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-remove-sm:hover {
  background: #c82333;
}

.peso-summary {
  padding: 16px;
  background: #f8f9fa;
  border-top: 2px solid #e9ecef;
  text-align: center;
  font-size: 16px;
}

.peso-warning {
  background: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.peso-complete {
  background: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.peso-message {
  margin-left: 12px;
  font-weight: normal;
  font-size: 14px;
}

.info-box {
  margin-top: 12px;
  padding: 12px;
  background: #e3f2fd;
  border-radius: 6px;
  border-left: 4px solid #2196f3;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  opacity: 0.8;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.section-number {
  background: #007bff;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.section-title {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.btn-add {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #218838;
}

.text-blue-600 {
  color: #2563eb;
}

.text-orange-600 {
  color: #ea580c;
}

.text-sm {
  font-size: 12px;
}

.text-gray-600 {
  color: #6b7280;
}
</style>
