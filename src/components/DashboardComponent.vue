<template>
  <div class="dashboard-container">

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