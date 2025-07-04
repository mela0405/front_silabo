import EstudiantesComponent from '@/components/EstudiantesComponent.vue'
import ActividadComponent from '@/components/ActividadComponent.vue'
import UniversidadComponent from '@/components/UniversidadComponent.vue'
import FacultadComponent from '@/components/FacultadComponent.vue'
import DepartamentoComponent from '@/components/DepartamentoComponent.vue'
import CarreraComponent from '@/components/CarreraComponent.vue'
import CriterioComponent from '@/components/CriterioComponent.vue'
import AreaComponent from '@/components/AreaComponent.vue'
import PlanCurricularComponent from '@/components/PlanCurricularComponent.vue'
import SemestrePlanComponent from '@/components/SemestrePlanComponent.vue'
import CursoComponent from '@/components/CursoComponent.vue'
import ProfesionComponent from '@/components/ProfesionComponent.vue'
import ProfesorComponent from '@/components/ProfesorComponent.vue'
import BibliografiaComponent from '@/components/BibliografiaComponent.vue'
import SemanaComponent from '@/components/SemanaComponent.vue'
import UnidadComponent from '@/components/UnidadComponent.vue'
import SilaboComponent from '@/components/SilaboComponent.vue'

import { ref } from 'vue'

const TABLAS_MAESTRAS_SECTIONS = [
  'estudiantes',
  'actividad',
  'universidad',
  'facultad',
  'departamento',
  'carrera',
  'criterio',
  'area',
  'plan',
  'semestreplan',
  'curso',
  'profesion',
  'profesor',
  'bibliografia',
  'semana',
  'unidad',
  'silabo'
];

export default {
  name: 'Dashboard',
  components: {
    EstudiantesComponent,
    ActividadComponent,
    UniversidadComponent,
    FacultadComponent,
    DepartamentoComponent,
    CarreraComponent,
    CriterioComponent,
    AreaComponent,
    PlanCurricularComponent,
    SemestrePlanComponent,
    CursoComponent,
    ProfesionComponent,
    ProfesorComponent,
    BibliografiaComponent,
    SemanaComponent,
    UnidadComponent,
    SilaboComponent
  },
  data() {
    return {
      fullName: localStorage.getItem('name') ?? '',
      emailUser: localStorage.getItem('email') ?? '',
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      isMobile: false,
      activeSection: 'dashboard',
      subMenus: {
        gestionUsuarios: false,
        estructuraInstitucional: false,
        curriculoAcademico: false,
        planificacionAcademica: false,
        competenciasEvaluacion: false,
        recursosAcademicos: false,
        // Mantener compatibilidad con el código anterior
        tablasMaestras: false
      }
    }
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    
    // Configurar submenús activos basados en la sección activa
    if (TABLAS_MAESTRAS_SECTIONS.includes(this.activeSection)) {
      this.setActiveSubMenu()
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) {
        this.mobileSidebarOpen = false
      }
    },
    toggleSidebar() {
      if (this.isMobile) {
        this.toggleMobileSidebar()
      } else {
        this.sidebarCollapsed = !this.sidebarCollapsed
        if (this.sidebarCollapsed) {
          Object.keys(this.subMenus).forEach(key => {
            this.subMenus[key] = false
          })
        }
      }
    },
    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen
    },
    closeMobileSidebar() {
      this.mobileSidebarOpen = false
    },
    handleNavClick(section) {
      this.setActiveSection(section)
      if (this.isMobile) {
        this.closeMobileSidebar()
      }
    },
    handleSubMenuClick(menu) {
      this.toggleSubMenu(menu)
      // No cerrar el sidebar en móviles cuando se hace clic en un submenú
    },
    setActiveSection(section) {
      this.activeSection = section
      this.setActiveSubMenu()
    },
    setActiveSubMenu() {
      // Resetear todos los submenús
      Object.keys(this.subMenus).forEach(key => {
        this.subMenus[key] = false
      })
      
      // Activar el submenú correspondiente
      if (this.isParentActive('gestionUsuarios')) {
        this.subMenus.gestionUsuarios = true
      } else if (this.isParentActive('estructuraInstitucional')) {
        this.subMenus.estructuraInstitucional = true
      } else if (this.isParentActive('curriculoAcademico')) {
        this.subMenus.curriculoAcademico = true
      } else if (this.isParentActive('planificacionAcademica')) {
        this.subMenus.planificacionAcademica = true
      } else if (this.isParentActive('competenciasEvaluacion')) {
        this.subMenus.competenciasEvaluacion = true
      } else if (this.isParentActive('recursosAcademicos')) {
        this.subMenus.recursosAcademicos = true
      }
      
      // Mantener compatibilidad con tablasMaestras
      if (TABLAS_MAESTRAS_SECTIONS.includes(this.activeSection)) {
        this.subMenus.tablasMaestras = true
      }
    },
    toggleSubMenu(menu) {
      if (!this.sidebarCollapsed || this.isMobile) {
        this.subMenus[menu] = !this.subMenus[menu]
      }
    },
    isParentActive(menu) {
      const menuSections = {
        gestionUsuarios: ['estudiantes', 'profesor'],
        estructuraInstitucional: ['universidad', 'facultad', 'departamento', 'carrera', 'area'],
        curriculoAcademico: ['plan', 'curso', 'silabo', 'unidad'],
        planificacionAcademica: ['semestreplan', 'semana', 'actividad'],
        competenciasEvaluacion: ['criterio'],
        recursosAcademicos: ['bibliografia', 'profesion'],
        // Mantener compatibilidad
        tablasMaestras: TABLAS_MAESTRAS_SECTIONS
      }
      
      return menuSections[menu] && menuSections[menu].includes(this.activeSection)
    },
    getToggleIcon() {
      if (this.isMobile) {
        return this.mobileSidebarOpen ? 'fas fa-times' : 'fas fa-bars'
      }
      return this.sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'
    },
    getSectionTitle() {
      const titles = {
        dashboard: 'Dashboard Principal',
        estudiantes: 'Gestión de Estudiantes',
        actividad: 'Gestión de Actividades',
        universidad: 'Gestión de Universidades',
        facultad: 'Gestión de Facultades',
        departamento: 'Gestión de Departamentos',
        carrera: 'Gestión de carreras',
        criterio: 'Gestión de criterios',
        area: 'Gestión de areas',
        plan: 'Gestión plan curricular',
        semestreplan: 'Gestión de semestres del plan',
        curso: 'Gestión de curso',
        profesion: 'Gestión de profesiones',
        profesor: 'Gestión de profesores',
        bibliografia: 'Gestión de bibliografías',
        semana: 'Gestión de semanas',
        unidad: 'Gestión de unidades',
        silabo: 'Gestión de silabos',
        reportes: 'Reportes del Sistema',
        configuracion: 'Configuración'
      }
      return titles[this.activeSection] || 'Dashboard'
    },
    handleLogout() {
      this.$emit('logout')
    }
  }
}