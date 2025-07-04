<template>
  <div class="dashboard-container">
    <!-- Menú lateral -->
    <button class="mobile-sidebar-toggle" @click="toggleMobileSidebar" v-if="isMobile">
      <i class="fas fa-bars"></i>
    </button>

    <div class="sidebar-overlay" :class="{ 'show': isMobile && mobileSidebarOpen }" @click="closeMobileSidebar"></div>

    <aside class="sidebar" :class="{
      'sidebar-collapsed': !isMobile && sidebarCollapsed,
      'sidebar-open': isMobile && mobileSidebarOpen
    }">
      <div class="sidebar-header">
        <h3 v-if="!sidebarCollapsed || isMobile" class="h5 mb-0">La Salle</h3>
        <button @click="isMobile ? closeMobileSidebar() : toggleSidebar()" class="btn btn-link text-white p-1">
          <i :class="getToggleIcon()"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <!-- Dashboard -->
          <li class="nav-item">
            <a href="#" @click="setActiveSection('dashboard')" class="nav-link"
              :class="{ active: activeSection === 'dashboard' }">
              <i class="fas fa-tachometer-alt sidebar-icon"></i>
              <span v-if="!sidebarCollapsed" class="sidebar-text">Dashboard</span>
            </a>
          </li>

          <!-- Gestión de Usuarios -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('gestionUsuarios')"
              class="nav-link d-flex justify-content-between align-items-center"
              :class="{ active: isParentActive('gestionUsuarios') }">
              <div>
                <i class="fas fa-users sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Gestión de Usuarios</span>
              </div>
              <i v-if="!sidebarCollapsed"
                :class="subMenus.gestionUsuarios ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                class="submenu-arrow"></i>
            </a>

            <div v-if="subMenus.gestionUsuarios && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('estudiantes')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'estudiantes' }">
                    <i class="fas fa-user-graduate sidebar-icon"></i>
                    <span class="sidebar-text">Estudiantes</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('profesor')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'profesor' }">
                    <i class="fas fa-chalkboard-teacher sidebar-icon"></i>
                    <span class="sidebar-text">Profesores</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Estructura Institucional -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('estructuraInstitucional')"
              class="nav-link d-flex justify-content-between align-items-center"
              :class="{ active: isParentActive('estructuraInstitucional') }">
              <div>
                <i class="fas fa-sitemap sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Estructura Institucional</span>
              </div>
              <i v-if="!sidebarCollapsed"
                :class="subMenus.estructuraInstitucional ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                class="submenu-arrow"></i>
            </a>

            <div v-if="subMenus.estructuraInstitucional && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('universidad')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'universidad' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Universidad</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('facultad')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'facultad' }">
                    <i class="fas fa-building sidebar-icon"></i>
                    <span class="sidebar-text">Facultad</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('departamento')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'departamento' }">
                    <i class="fas fa-door-open sidebar-icon"></i>
                    <span class="sidebar-text">Departamento</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('carrera')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'carrera' }">
                    <i class="fas fa-graduation-cap sidebar-icon"></i>
                    <span class="sidebar-text">Carrera</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('area')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'area' }">
                    <i class="fas fa-map-marked-alt sidebar-icon"></i>
                    <span class="sidebar-text">Área</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Currículo Académico -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('curriculoAcademico')"
              class="nav-link d-flex justify-content-between align-items-center"
              :class="{ active: isParentActive('curriculoAcademico') }">
              <div>
                <i class="fas fa-book-open sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Currículo Académico</span>
              </div>
              <i v-if="!sidebarCollapsed"
                :class="subMenus.curriculoAcademico ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                class="submenu-arrow"></i>
            </a>

            <div v-if="subMenus.curriculoAcademico && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('plan')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'plan' }">
                    <i class="fas fa-clipboard-list sidebar-icon"></i>
                    <span class="sidebar-text">Plan Curricular</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('curso')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'curso' }">
                    <i class="fas fa-book sidebar-icon"></i>
                    <span class="sidebar-text">Cursos</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('silabo')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'silabo' }">
                    <i class="fas fa-file-alt sidebar-icon"></i>
                    <span class="sidebar-text">Sílabo</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('unidad')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'unidad' }">
                    <i class="fas fa-puzzle-piece sidebar-icon"></i>
                    <span class="sidebar-text">Unidades</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Planificación Académica -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('planificacionAcademica')"
              class="nav-link d-flex justify-content-between align-items-center"
              :class="{ active: isParentActive('planificacionAcademica') }">
              <div>
                <i class="fas fa-calendar-alt sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Planificación Académica</span>
              </div>
              <i v-if="!sidebarCollapsed"
                :class="subMenus.planificacionAcademica ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                class="submenu-arrow"></i>
            </a>

            <div v-if="subMenus.planificacionAcademica && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('semestreplan')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'semestreplan' }">
                    <i class="fas fa-calendar-week sidebar-icon"></i>
                    <span class="sidebar-text">Plan de Semestre</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('semana')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'semana' }">
                    <i class="fas fa-calendar-day sidebar-icon"></i>
                    <span class="sidebar-text">Semanas</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('actividad')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'actividad' }">
                    <i class="fas fa-tasks sidebar-icon"></i>
                    <span class="sidebar-text">Actividades</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Competencias y Evaluación -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('competenciasEvaluacion')"
              class="nav-link d-flex justify-content-between align-items-center"
              :class="{ active: isParentActive('competenciasEvaluacion') }">
              <div>
                <i class="fas fa-medal sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Desempeño</span>
              </div>
              <i v-if="!sidebarCollapsed"
                :class="subMenus.competenciasEvaluacion ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                class="submenu-arrow"></i>
            </a>

            <div v-if="subMenus.competenciasEvaluacion && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('criterio')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'criterio' }">
                    <i class="fas fa-check-square sidebar-icon"></i>
                    <span class="sidebar-text">Criterio</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Recursos Académicos -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('recursosAcademicos')"
              class="nav-link d-flex justify-content-between align-items-center"
              :class="{ active: isParentActive('recursosAcademicos') }">
              <div>
                <i class="fas fa-tools sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Recursos Académicos</span>
              </div>
              <i v-if="!sidebarCollapsed"
                :class="subMenus.recursosAcademicos ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                class="submenu-arrow"></i>
            </a>

            <div v-if="subMenus.recursosAcademicos && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('bibliografia')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'bibliografia' }">
                    <i class="fas fa-book sidebar-icon"></i>
                    <span class="sidebar-text">Bibliografías</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('profesion')" class="nav-link submenu-link"
                    :class="{ active: activeSection === 'profesion' }">
                    <i class="fas fa-briefcase sidebar-icon"></i>
                    <span class="sidebar-text">Profesiones</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Reportes -->
          <li class="nav-item">
            <a href="#" @click="setActiveSection('reportes')" class="nav-link"
              :class="{ active: activeSection === 'reportes' }">
              <i class="fas fa-chart-bar sidebar-icon"></i>
              <span v-if="!sidebarCollapsed" class="sidebar-text">Reportes</span>
            </a>
          </li>

          <!-- Configuración -->
          <li class="nav-item">
            <a href="#" @click="setActiveSection('configuracion')" class="nav-link"
              :class="{ active: activeSection === 'configuracion' }">
              <i class="fas fa-cog sidebar-icon"></i>
              <span v-if="!sidebarCollapsed" class="sidebar-text">Configuración</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn btn-outline-danger btn-sm w-100">
          <i class="fas fa-sign-out-alt sidebar-icon"></i>
          <span v-if="!sidebarCollapsed || isMobile" class="sidebar-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="main-header bg-white shadow-sm">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-primary">{{ getSectionTitle() }}</h1>
          <div class="user-info d-flex align-items-center">
            <i class="fas fa-user-circle fa-2x text-muted me-2"></i>
            <div class="user-details">
              <small class="text-muted d-block">{{ fullName }}</small>
              <strong>{{ emailUser }}</strong>
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <!-- Dashboard -->
        <div v-if="activeSection === 'dashboard'" class="section">
          <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary mb-1">
                        Total Estudiantes
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">1,234</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-user-graduate fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-success mb-1">
                        Actividades Activas
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">45</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-info mb-1">
                        Universidades
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">12</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-university fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-warning mb-1">
                        Tareas Pendientes
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">23</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de ejemplo -->
          <div class="row">
            <div class="col-lg-8">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-chart-area me-2"></i>
                    Registro de Estudiantes por Mes
                  </h6>
                </div>
                <div class="card-body">
                  <div class="chart-area">
                    <div class="text-center py-5">
                      <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                      <p class="text-muted">Gráfico de registro de estudiantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-tasks me-2"></i>
                    Actividades Recientes
                  </h6>
                </div>
                <div class="card-body">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i class="fas fa-plus-circle text-success me-2"></i>
                        Nuevo estudiante registrado
                      </div>
                      <small class="text-muted">2h</small>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i class="fas fa-edit text-warning me-2"></i>
                        Actividad modificada
                      </div>
                      <small class="text-muted">4h</small>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i class="fas fa-university text-info me-2"></i>
                        Nueva universidad agregada
                      </div>
                      <small class="text-muted">1d</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estudiantes -->
        <div v-if="activeSection === 'estudiantes'" class="section">
          <EstudiantesComponent />
        </div>

        <!-- Actividades -->
        <div v-if="activeSection === 'actividad'" class="section">
          <ActividadComponent />
        </div>

        <!-- Universidad -->
        <div v-if="activeSection === 'universidad'" class="section">
          <UniversidadComponent />
        </div>

        <!-- Facultades -->
        <div v-if="activeSection === 'facultad'" class="section">
          <FacultadComponent />
        </div>

        <!-- Departamento -->
        <div v-if="activeSection === 'departamento'" class="section">
          <DepartamentoComponent />
        </div>

        <div v-if="activeSection === 'carrera'" class="section">
          <CarreraComponent />
        </div>

        <div v-if="activeSection === 'criterio'" class="section">
          <CriterioComponent />
        </div>

        <div v-if="activeSection === 'area'" class="section">
          <AreaComponent />
        </div>

        <div v-if="activeSection === 'plan'" class="section">
          <PlanCurricularComponent />
        </div>

        <div v-if="activeSection === 'semestreplan'" class="section">
          <SemestrePlanComponent />
        </div>

        <div v-if="activeSection === 'curso'" class="section">
          <CursoComponent />
        </div>

        <div v-if="activeSection === 'profesion'" class="section">
          <ProfesionComponent />
        </div>

        <div v-if="activeSection === 'profesor'" class="section">
          <ProfesorComponent />
        </div>

        <div v-if="activeSection === 'bibliografia'" class="section">
          <BibliografiaComponent />
        </div>

        <div v-if="activeSection === 'semana'" class="section">
          <SemanaComponent />
        </div>

        <div v-if="activeSection === 'unidad'" class="section">
          <UnidadComponent />
        </div>

        <div v-if="activeSection === 'silabo'" class="section">
          <SilaboComponent />
        </div>

        <!-- Reportes -->
        <div v-if="activeSection === 'reportes'" class="section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">
              <i class="fas fa-chart-bar text-warning me-2"></i>
              Reportes del Sistema
            </h4>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="fas fa-file-pdf text-danger me-2"></i>
                    Reporte de Estudiantes
                  </h5>
                  <p class="card-text">Generar reporte completo de estudiantes registrados</p>
                  <button class="btn btn-danger">
                    <i class="fas fa-download me-2"></i>
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="fas fa-file-excel text-success me-2"></i>
                    Reporte de Actividades
                  </h5>
                  <p class="card-text">Exportar datos de actividades a Excel</p>
                  <button class="btn btn-success">
                    <i class="fas fa-download me-2"></i>
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración -->
        <div v-if="activeSection === 'configuracion'" class="section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">
              <i class="fas fa-cog text-secondary me-2"></i>
              Configuración del Sistema
            </h4>
          </div>
          <div class="row">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-user-cog me-2"></i>
                    Configuración de Usuario
                  </h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="mb-3">
                      <label class="form-label">Nombre de usuario</label>
                      <input type="text" class="form-control" value="Admin Usuario">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" value="admin@example.com">
                    </div>
                    <div class="mb-3">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="notifications">
                        <label class="form-check-label" for="notifications">
                          Recibir notificaciones por email
                        </label>
                      </div>
                    </div>
                    <button class="btn btn-primary">
                      <i class="fas fa-save me-2"></i>
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Dashboard from '@/scripts/dashboard/logicaDashboard'

export default {
  ...Dashboard
}
</script>

<style>
@import '@/assets/dashboard/global.css';
</style>

<!-- <style scoped>
@import '@/assets/dashboard/particular.css';
</style> -->