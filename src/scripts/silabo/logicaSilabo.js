// src/scripts/silabo/logicaSilabo.js
import {
  SILABO_API,
  PERIODO_LECTIVO_API,
  PROFESOR_API,
  FACULTADES_API,
  CARRERAS_API,
  CURSO_API,
  UNIDAD_API,
  CRITERIO_API,
  ACTIVIDADES_API
} from '@/config/constants';

export default {
  name: 'SilaboComponent',

  /* ─────────────── data ─────────────── */
  data() {
    return {
      silabos: [],
      periodosLectivos: [],
      profesores: [],
      facultades: [],
      carreras: [],
      cursos: [],
      unidadesExistentes: [],
      criteriosExistentes: [],
      actividadesExistentes: [],
      tiposCurso: [
        { id: 'obligatorio', nombre: 'Obligatorio' },
        { id: 'electivo', nombre: 'Electivo' },
        { id: 'practicas', nombre: 'Prácticas Pre-profesionales' }
      ],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        // Campos requeridos por la API
        periodo_lectivo: '',
        profesor: '',
        facultad: '',
        carrera: '',
        curso: '',

        // Datos generales adicionales
        semestre: '',
        area_formacion: '',
        tipo_curso: '',
        carrera_profesional: '',
        nro_creditos: null,
        prerrequisitos: '',
        periodo: '',
        horas_teoria: null,
        horas_practica: null,
        codigo_curso: '',
        docente: '',
        correo_docente: '',

        // Competencias y contenido
        competencia_curso: '',
        competencia_perfil: '',
        competencias_previas: '',
        sumilla: '',
        actividades_rsu: '',
        actividades: [],

        // Arrays dinámicos
        unidades: [],
        criterios: [],

        // Metadatos
        nombre: '',
        activo: true
      },
      /* paginación / búsqueda */
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredSilabos: []
    };
  },

  /* ───────────── computed ───────────── */
  computed: {
    totalItems() { return this.filteredSilabos.length; },
    totalPages() { return Math.ceil(this.totalItems / this.itemsPerPage); },
    startIndex() { return (this.currentPage - 1) * this.itemsPerPage; },
    endIndex() { return Math.min(this.startIndex + this.itemsPerPage, this.totalItems); },
    paginatedSilabos() { return this.filteredSilabos.slice(this.startIndex, this.endIndex); },

    // Cálculo del peso total de criterios
    totalPeso() {
      return this.formData.criterios.reduce((total, criterio) => {
        return total + (Number(criterio.peso) || 0);
      }, 0);
    },

    visiblePages() {
      const pages = [], maxVisible = 5;
      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 2);
        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push('…');
        }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('…');
          pages.push(this.totalPages);
        }
      }
      return pages;
    }
  },

  /* ───────────── watchers ───────────── */
  watch: {
    silabos() {
      this.applyFilters();
    },
    searchTerm() {
      this.handleSearch();
    },
    // Watcher para autocompletar cuando se selecciona un curso
    'formData.curso'(newCursoId) {
      if (newCursoId) {
        this.autocompletarDatosCurso(newCursoId);
      }
    },

    'formData.profesor'(newProfesorId) {
      if (newProfesorId) {
        this.autocompletarDatosProfesor(newProfesorId);
      }
    },

    'formData.periodo_lectivo'(newPeriodoId) {
      if (newPeriodoId) {
        this.autocompletarDatosPeriodo(newPeriodoId);
      }
    }
  },

  /* ───────── ciclo de vida ────────── */
  mounted() {
    this.fetchSilabos();
    this.fetchPeriodosLectivos();
    this.fetchProfesores();
    this.fetchFacultades();
    this.fetchCarreras();
    this.fetchCursos();
  },

  /* ───────────── métodos ───────────── */
  methods: {
    /* ---------- Fetches ---------- */
    async fetchSilabos() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar sílabos');
        this.silabos = await res.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchPeriodosLectivos() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(PERIODO_LECTIVO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar periodos lectivos');
        this.periodosLectivos = await res.json();
      } catch (err) {
        console.error('Error fetching periodos lectivos:', err.message);
      }
    },

    async fetchProfesores() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(PROFESOR_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar profesores');
        this.profesores = await res.json();
      } catch (err) {
        console.error('Error fetching profesores:', err.message);
      }
    },

    async fetchFacultades() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(FACULTADES_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar facultades');
        this.facultades = await res.json();
      } catch (err) {
        console.error('Error fetching facultades:', err.message);
      }
    },

    async fetchCarreras() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CARRERAS_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar carreras');
        this.carreras = await res.json();
      } catch (err) {
        console.error('Error fetching carreras:', err.message);
      }
    },

    async fetchCriteriosPorSilabo(silaboId) {
      if (!silaboId) {
        this.criteriosExistentes = [];
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CRITERIO_API.SILABO(silaboId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar criterios del sílabo');
        this.criteriosExistentes = await res.json();

        // Cargar los criterios existentes en el formulario
        this.cargarCriteriosEnFormulario();

        console.log(`Cargados ${this.criteriosExistentes.length} criterios para el sílabo ${silaboId}`);
      } catch (err) {
        console.error('Error fetching criterios por sílabo:', err.message);
        this.criteriosExistentes = [];
      }
    },

    cargarCriteriosEnFormulario() {
      this.formData.criterios = this.criteriosExistentes.map(criterio => ({
        id: criterio.id, // ID para identificar si es existente
        evaluacion: criterio.nombre || '', // Mapear 'nombre' a 'evaluacion'
        peso: criterio.peso ? criterio.peso * 100 : 0, // Convertir decimal a porcentaje
        fecha: criterio.fecha_inicio || '',
        descripcion: criterio.descripcion || '',
        fecha_fin: criterio.fecha_fin || '' // Campo adicional si lo necesitas
      }));
    },

    async guardarCriterio(criterioData, silaboId) {
      try {
        const token = localStorage.getItem('access_token');
        const isUpdate = criterioData.id;

        const payload = {
          nombre: criterioData.evaluacion,
          peso: criterioData.peso / 100, // Convertir porcentaje a decimal
          fecha_inicio: criterioData.fecha,
          fecha_fin: criterioData.fecha_fin || criterioData.fecha,
          descripcion: criterioData.descripcion,
          silabo: silaboId
        };

        const url = isUpdate ? CRITERIO_API.DETAIL(criterioData.id) : CRITERIO_API.LIST;
        const method = isUpdate ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Error al ${isUpdate ? 'actualizar' : 'crear'} criterio: ${JSON.stringify(errorData)}`);
        }

        return await res.json();
      } catch (err) {
        console.error('Error guardando criterio:', err.message);
        throw err;
      }
    },

    async eliminarCriterioDelServidor(criterioId) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CRITERIO_API.DETAIL(criterioId), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Error al eliminar criterio del servidor');
        }

        console.log(`Criterio ${criterioId} eliminado del servidor`);
      } catch (err) {
        console.error('Error eliminando criterio:', err.message);
        throw err;
      }
    },

    async removeCriterio(index) {
      if (!confirm('¿Está seguro de eliminar este criterio?')) return;

      const criterio = this.formData.criterios[index];

      // Si el criterio tiene ID, eliminarlo del servidor
      if (criterio.id) {
        try {
          await this.eliminarCriterioDelServidor(criterio.id);
        } catch (err) {
          this.error = `Error al eliminar criterio: ${err.message}`;
          return;
        }
      }

      // Eliminar de la lista local
      this.formData.criterios.splice(index, 1);
    },

    async guardarCriteriosPorSeparado(silaboId) {
      try {
        const promesasCriterios = this.formData.criterios.map(criterio =>
          this.guardarCriterio(criterio, silaboId)
        );

        await Promise.all(promesasCriterios);
        console.log(`${this.formData.criterios.length} criterios guardados exitosamente`);
      } catch (err) {
        console.error('Error guardando criterios:', err.message);
        throw new Error(`Error al guardar criterios: ${err.message}`);
      }
    },

    async fetchActividadesPorSilabo(silaboId) {
      if (!silaboId) {
        this.actividadesExistentes = [];
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(ACTIVIDADES_API.SILABO(silaboId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar actividades del sílabo');
        this.actividadesExistentes = await res.json();

        // Cargar las actividades existentes en el formulario
        this.cargarActividadesEnFormulario();

        console.log(`Cargadas ${this.actividadesExistentes.length} actividades para el sílabo ${silaboId}`);
      } catch (err) {
        console.error('Error fetching actividades por sílabo:', err.message);
        this.actividadesExistentes = [];
      }
    },

    /* ---------- NUEVO: Cargar actividades existentes en el formulario ---------- */
    cargarActividadesEnFormulario() {
      this.formData.actividades = this.actividadesExistentes.map(actividad => ({
        id: actividad.id, // ID para identificar si es existente
        nombre: actividad.nombre || '',
        descripcion: actividad.descripcion || ''
      }));

      // Actualizar el campo legacy actividades_rsu para compatibilidad
      if (this.actividadesExistentes.length > 0) {
        this.formData.actividades_rsu = this.actividadesExistentes
          .map(a => `${a.nombre}: ${a.descripcion}`)
          .join('\n');
      }
    },

    /* ---------- NUEVO: Guardar actividad individual ---------- */
    async guardarActividad(actividadData, silaboId) {
      try {
        const token = localStorage.getItem('access_token');
        const isUpdate = actividadData.id;

        const payload = {
          nombre: actividadData.nombre,
          descripcion: actividadData.descripcion,
          silabo: silaboId
        };

        const url = isUpdate ? ACTIVIDADES_API.DETAIL(actividadData.id) : ACTIVIDADES_API.LIST;
        const method = isUpdate ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Error al ${isUpdate ? 'actualizar' : 'crear'} actividad: ${JSON.stringify(errorData)}`);
        }

        return await res.json();
      } catch (err) {
        console.error('Error guardando actividad:', err.message);
        throw err;
      }
    },

    /* ---------- NUEVO: Eliminar actividad del servidor ---------- */
    async eliminarActividadDelServidor(actividadId) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(ACTIVIDADES_API.DETAIL(actividadId), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Error al eliminar actividad del servidor');
        }

        console.log(`Actividad ${actividadId} eliminada del servidor`);
      } catch (err) {
        console.error('Error eliminando actividad:', err.message);
        throw err;
      }
    },

    /* ---------- NUEVO: Manejo de Actividades RSU ---------- */
    addActividad() {
      this.formData.actividades.push({
        nombre: '',
        descripcion: ''
      });
    },

    async removeActividad(index) {
      if (!confirm('¿Está seguro de eliminar esta actividad?')) return;

      const actividad = this.formData.actividades[index];

      // Si la actividad tiene ID, eliminarla del servidor
      if (actividad.id) {
        try {
          await this.eliminarActividadDelServidor(actividad.id);
        } catch (err) {
          this.error = `Error al eliminar actividad: ${err.message}`;
          return;
        }
      }

      // Eliminar de la lista local
      this.formData.actividades.splice(index, 1);
    },

    /* ---------- NUEVO: Guardar actividades por separado ---------- */
    async guardarActividadesPorSeparado(silaboId) {
      try {
        const promesasActividades = this.formData.actividades.map(actividad =>
          this.guardarActividad(actividad, silaboId)
        );

        await Promise.all(promesasActividades);
        console.log(`${this.formData.actividades.length} actividades guardadas exitosamente`);
      } catch (err) {
        console.error('Error guardando actividades:', err.message);
        throw new Error(`Error al guardar actividades: ${err.message}`);
      }
    },

    async fetchCursos() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CURSO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar cursos');
        this.cursos = await res.json();
      } catch (err) {
        console.error('Error fetching cursos:', err.message);
      }
    },

    /* ---------- NUEVO: Fetch de unidades por sílabo ---------- */
    async fetchUnidadesPorSilabo(silaboId) {
      if (!silaboId) {
        this.unidadesExistentes = [];
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(UNIDAD_API.SILABO(silaboId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar unidades del sílabo');
        this.unidadesExistentes = await res.json();

        // Cargar las unidades existentes en el formulario
        this.cargarUnidadesEnFormulario();

        console.log(`Cargadas ${this.unidadesExistentes.length} unidades para el sílabo ${silaboId}`);
      } catch (err) {
        console.error('Error fetching unidades por sílabo:', err.message);
        this.unidadesExistentes = [];
      }
    },

    /* ---------- NUEVO: Cargar unidades existentes en el formulario ---------- */
    cargarUnidadesEnFormulario() {
      this.formData.unidades = this.unidadesExistentes.map(unidad => ({
        id: unidad.id, // ID para identificar si es existente
        inicio: unidad.inicio || '',
        final: unidad.final || '',
        descripcion: unidad.descripcion || '',
        metodologia: unidad.metodologia || '',
        // Mapeo de campos legacy si los tienes
        denominacion: unidad.descripcion || '',
        semana: unidad.inicio && unidad.final ? `${unidad.inicio} - ${unidad.final}` : '',
        competencia: unidad.descripcion || '',
        contenidos: unidad.descripcion || '',
        fuentes: ''
      }));
    },

    /* ---------- NUEVO: Guardar unidad individual ---------- */
    async guardarUnidad(unidadData, silaboId) {
      try {
        const token = localStorage.getItem('access_token');
        const isUpdate = unidadData.id;

        const payload = {
          inicio: unidadData.inicio,
          final: unidadData.final,
          descripcion: unidadData.descripcion || unidadData.denominacion,
          metodologia: unidadData.metodologia,
          silabo: silaboId
        };

        const url = isUpdate ? UNIDAD_API.DETAIL(unidadData.id) : UNIDAD_API.LIST;
        const method = isUpdate ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Error al ${isUpdate ? 'actualizar' : 'crear'} unidad: ${JSON.stringify(errorData)}`);
        }

        return await res.json();
      } catch (err) {
        console.error('Error guardando unidad:', err.message);
        throw err;
      }
    },

    /* ---------- NUEVO: Eliminar unidad del servidor ---------- */
    async eliminarUnidadDelServidor(unidadId) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(UNIDAD_API.DETAIL(unidadId), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Error al eliminar unidad del servidor');
        }

        console.log(`Unidad ${unidadId} eliminada del servidor`);
      } catch (err) {
        console.error('Error eliminando unidad:', err.message);
        throw err;
      }
    },

    /* ---------- Nuevo método para obtener detalles del curso ---------- */
    async fetchCursoDetalle(cursoId) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${CURSO_API.LIST}${cursoId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar detalles del curso');
        return await res.json();
      } catch (err) {
        console.error('Error fetching curso detalle:', err.message);
        return null;
      }
    },

    /* ---------- Autocompletado de datos del curso ---------- */
    async autocompletarDatosCurso(cursoId) {
      if (!cursoId) return;

      try {
        // Buscar el curso en la lista ya cargada (más eficiente)
        let cursoDetalle = this.cursos.find(c => c.id == cursoId);

        // Si no está en la lista o no tiene todos los detalles, hacer fetch
        if (!cursoDetalle || !cursoDetalle.semestre_detalle) {
          cursoDetalle = await this.fetchCursoDetalle(cursoId);
        }

        if (!cursoDetalle) return;

        // Autocompletar campos básicos del curso
        this.formData.codigo_curso = cursoDetalle.codigo || '';
        this.formData.nro_creditos = cursoDetalle.creditos || null;
        this.formData.horas_teoria = cursoDetalle.horas_teoria || null;
        this.formData.horas_practica = cursoDetalle.horas_practica || null;

        // Autocompletar área de formación
        if (cursoDetalle.area_detalle) {
          this.formData.area_formacion = cursoDetalle.area_detalle.nombre || '';
        }

        // Autocompletar tipo de curso
        if (cursoDetalle.tipo_curso_detalle) {
          // Buscar el tipo en nuestro array local
          const tipoEncontrado = this.tiposCurso.find(t =>
            t.nombre.toLowerCase() === cursoDetalle.tipo_curso_detalle.nombre.toLowerCase()
          );
          if (tipoEncontrado) {
            this.formData.tipo_curso = tipoEncontrado.id;
          }
        }

        // Autocompletar semestre
        if (cursoDetalle.semestre_detalle) {
          this.formData.semestre = cursoDetalle.semestre_detalle.nombre || '';

          // Autocompletar periodo si existe
          if (cursoDetalle.semestre_detalle.semestre_academico_detalle) {
            this.formData.periodo = cursoDetalle.semestre_detalle.semestre_academico_detalle.periodo || '';
          }

          // Autocompletar carrera profesional (mapear a ambos campos)
          if (cursoDetalle.semestre_detalle.plan_detalle?.carrera_detalle) {
            const carrera = cursoDetalle.semestre_detalle.plan_detalle.carrera_detalle;
            this.formData.carrera = carrera.id; // Campo requerido por API
            this.formData.carrera_profesional = carrera.id; // Campo adicional

            // Autocompletar facultad
            if (carrera.departamento_detalle?.facultad_detalle) {
              this.formData.facultad = carrera.departamento_detalle.facultad_detalle.id;
            }
          }
        }

        // Autocompletar prerrequisitos si existen
        if (cursoDetalle.prerrequisitos_detalle && cursoDetalle.prerrequisitos_detalle.length > 0) {
          const prerrequisitos = cursoDetalle.prerrequisitos_detalle
            .map(p => p.nombre || p.codigo || '')
            .filter(p => p)
            .join(', ');
          this.formData.prerrequisitos = prerrequisitos;
        }

        // Autocompletar descripción en sumilla si está disponible
        if (cursoDetalle.descripcion && !this.formData.sumilla) {
          this.formData.sumilla = cursoDetalle.descripcion;
        }

        // Generar nombre automático del sílabo si no existe
        if (!this.formData.nombre) {
          this.formData.nombre = `Sílabo ${cursoDetalle.codigo} - ${cursoDetalle.nombre}`;
        }

        console.log('Datos del curso autocompletados:', {
          curso: cursoDetalle.nombre,
          codigo: cursoDetalle.codigo,
          creditos: cursoDetalle.creditos,
          area: cursoDetalle.area_detalle?.nombre,
          tipo: cursoDetalle.tipo_curso_detalle?.nombre
        });

      } catch (err) {
        console.error('Error al autocompletar datos del curso:', err.message);
      }
    },

    autocompletarDatosProfesor(profesorId) {
      if (!profesorId) return;

      try {
        // Buscar el profesor en la lista ya cargada
        const profesorSeleccionado = this.profesores.find(p => p.id == profesorId);

        if (!profesorSeleccionado) return;

        // Autocompletar campos del docente
        if (profesorSeleccionado.persona) {
          this.formData.docente = profesorSeleccionado.persona.nombre || '';
          this.formData.correo_docente = profesorSeleccionado.persona.usuario?.email || '';
        } else {
          // Si no tiene estructura de persona, usar campos directos
          this.formData.docente = profesorSeleccionado.nombre || '';
          this.formData.correo_docente = profesorSeleccionado.email || '';
        }

        console.log('Datos del profesor autocompletados:', {
          nombre: this.formData.docente,
          email: this.formData.correo_docente
        });

      } catch (err) {
        console.error('Error al autocompletar datos del profesor:', err.message);
      }
    },

    autocompletarDatosPeriodo(periodoId) {
      if (!periodoId) return;

      try {
        // Buscar el periodo en la lista ya cargada
        const periodoSeleccionado = this.periodosLectivos.find(p => p.id == periodoId);

        if (!periodoSeleccionado) return;

        // Autocompletar campo periodo (para mostrar en el formulario)
        this.formData.periodo = periodoSeleccionado.periodo || '';

        console.log('Datos del periodo lectivo autocompletados:', {
          id: periodoSeleccionado.id,
          periodo: periodoSeleccionado.periodo,
          anio: periodoSeleccionado.anio || ''
        });

      } catch (err) {
        console.error('Error al autocompletar datos del periodo:', err.message);
      }
    },

    /* ---------- Validaciones ---------- */
    validateForm() {
      const errors = [];

      // Validar campos requeridos por la API
      if (!this.formData.periodo_lectivo) errors.push('El periodo lectivo es requerido');
      if (!this.formData.profesor) errors.push('El profesor es requerido');
      if (!this.formData.facultad) errors.push('La facultad es requerida');
      if (!this.formData.carrera) errors.push('La carrera es requerida');
      if (!this.formData.curso) errors.push('El curso es requerido');

      // Validar peso de criterios
      if (this.formData.criterios.length > 0 && this.totalPeso !== 100) {
        errors.push('La suma de los pesos de evaluación debe ser exactamente 100%');
      }

      // Validar unidades si existen
      this.formData.unidades.forEach((unidad, index) => {
        if (!unidad.inicio) errors.push(`La unidad ${index + 1} requiere fecha de inicio`);
        if (!unidad.final) errors.push(`La unidad ${index + 1} requiere fecha final`);
        if (!unidad.descripcion && !unidad.denominacion) errors.push(`La unidad ${index + 1} requiere descripción`);
      });

      this.formData.actividades.forEach((actividad, index) => {
        if (!actividad.nombre) errors.push(`La actividad ${index + 1} requiere nombre`);
        if (!actividad.descripcion) errors.push(`La actividad ${index + 1} requiere descripción`);
      });


      return errors;
    },

    /* ---------- Manejo de Unidades MODIFICADO ---------- */
    addUnidad() {
      this.formData.unidades.push({
        inicio: '',
        final: '',
        descripcion: '',
        metodologia: '',
        // Campos legacy para compatibilidad
        denominacion: '',
        semana: '',
        competencia: '',
        contenidos: '',
        fuentes: ''
      });
    },

    async removeUnidad(index) {
      if (!confirm('¿Está seguro de eliminar esta unidad?')) return;

      const unidad = this.formData.unidades[index];

      // Si la unidad tiene ID, eliminarla del servidor
      if (unidad.id) {
        try {
          await this.eliminarUnidadDelServidor(unidad.id);
        } catch (err) {
          this.error = `Error al eliminar unidad: ${err.message}`;
          return;
        }
      }

      // Eliminar de la lista local
      this.formData.unidades.splice(index, 1);
    },

    /* ---------- Manejo de Criterios ---------- */
    addCriterio() {
      this.formData.criterios.push({
        evaluacion: '',
        peso: null,
        fecha: '',
        descripcion: ''
      });
    },

    removeCriterio(index) {
      if (confirm('¿Está seguro de eliminar este criterio?')) {
        this.formData.criterios.splice(index, 1);
      }
    },

    /* ---------- Crear / Actualizar MODIFICADO ---------- */
    async submitForm() {
      // Validar formulario
      const validationErrors = this.validateForm();
      if (validationErrors.length > 0) {
        this.error = validationErrors.join(', ');
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem ? SILABO_API.DETAIL(this.editingItem.id) : SILABO_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        // Preparar payload SIN unidades (se guardan por separado)
        const payload = {
          // Campos requeridos por la API
          periodo_lectivo: this.formData.periodo_lectivo,
          profesor: this.formData.profesor,
          facultad: this.formData.facultad,
          carrera: this.formData.carrera,
          curso: this.formData.curso,

          // Campos adicionales
          nombre: this.formData.nombre || `Sílabo ${this.formData.codigo_curso} - ${this.formData.periodo}`,
          semestre: this.formData.semestre,
          area_formacion: this.formData.area_formacion,
          tipo_curso: this.formData.tipo_curso,
          nro_creditos: this.formData.nro_creditos,
          prerrequisitos: this.formData.prerrequisitos,
          periodo: this.formData.periodo,
          horas_teoria: this.formData.horas_teoria,
          horas_practica: this.formData.horas_practica,
          codigo_curso: this.formData.codigo_curso,
          docente: this.formData.docente,
          correo_docente: this.formData.correo_docente,
          competencia_curso: this.formData.competencia_curso,
          competencia_perfil: this.formData.competencia_perfil,
          competencia_perfil_egreso: this.formData.competencia_perfil,
          competencia_profesional: this.formData.competencias_previas,
          competencias_previas: this.formData.competencias_previas,
          sumilla: this.formData.sumilla,
          actividades_rsu: this.formData.actividades_rsu,
          activo: this.formData.activo
        };

        // Guardar sílabo
        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Error response:', errorData);

          const errorMessages = [];
          if (typeof errorData === 'object') {
            for (const [field, messages] of Object.entries(errorData)) {
              if (Array.isArray(messages)) {
                errorMessages.push(`${field}: ${messages.join(', ')}`);
              } else {
                errorMessages.push(`${field}: ${messages}`);
              }
            }
          }

          throw new Error(errorMessages.length > 0 ? errorMessages.join('; ') : 'Error al procesar la solicitud');
        }

        const silaboGuardado = await res.json();
        const silaboId = silaboGuardado.id;

        // Guardar unidades por separado
        if (this.formData.unidades.length > 0) {
          await this.guardarUnidadesPorSeparado(silaboId);
        }

        if (this.formData.criterios.length > 0) {
          await this.guardarCriteriosPorSeparado(silaboId);
        }

        if (this.formData.actividades.length > 0) {
          await this.guardarActividadesPorSeparado(silaboId);
        }

        await this.fetchSilabos();
        this.cancelForm();

        console.log(`Sílabo ${this.editingItem ? 'actualizado' : 'creado'} exitosamente`);

      } catch (err) {
        this.error = err.message;
        console.error('Error en submitForm:', err);
      } finally {
        this.loading = false;
      }
    },

    /* ---------- NUEVO: Guardar unidades por separado ---------- */
    async guardarUnidadesPorSeparado(silaboId) {
      try {
        const promesasUnidades = this.formData.unidades.map(unidad =>
          this.guardarUnidad(unidad, silaboId)
        );

        await Promise.all(promesasUnidades);
        console.log(`${this.formData.unidades.length} unidades guardadas exitosamente`);
      } catch (err) {
        console.error('Error guardando unidades:', err.message);
        throw new Error(`Error al guardar unidades: ${err.message}`);
      }
    },

    /* ---------- Editar MODIFICADO ---------- */
    async editItem(silabo) {
      this.editingItem = silabo;
      this.formData = {
        // Campos requeridos por la API
        periodo_lectivo: silabo.periodo_lectivo || '',
        profesor: silabo.profesor || '',
        facultad: silabo.facultad || '',
        carrera: silabo.carrera || '',
        curso: silabo.curso || '',

        // Campos adicionales
        nombre: silabo.nombre || '',
        semestre: silabo.semestre || '',
        area_formacion: silabo.area_formacion || '',
        tipo_curso: silabo.tipo_curso || '',
        carrera_profesional: silabo.carrera_profesional || silabo.carrera || '',
        nro_creditos: silabo.nro_creditos || null,
        prerrequisitos: silabo.prerrequisitos || '',
        periodo: silabo.periodo || silabo.periodo_lectivo_detalle?.periodo || '',
        horas_teoria: silabo.horas_teoria || null,
        horas_practica: silabo.horas_practica || null,
        codigo_curso: silabo.codigo_curso || '',
        docente: silabo.docente || silabo.profesor_detalle?.persona?.nombre || '',
        correo_docente: silabo.correo_docente || silabo.profesor_detalle?.persona?.usuario?.email || '',
        competencia_curso: silabo.competencia_curso || '',
        competencia_perfil: silabo.competencia_perfil || silabo.competencia_perfil_egreso || '',
        competencias_previas: silabo.competencias_previas || silabo.competencia_profesional || '',
        sumilla: silabo.sumilla || '',
        actividades_rsu: silabo.actividades_rsu || '',
        actividades: [],
        unidades: [], // Se cargarán por separado
        criterios: [],
        activo: silabo.activo !== undefined ? silabo.activo : true
      };

      // Cargar unidades existentes del servidor
      await this.fetchUnidadesPorSilabo(silabo.id);

      await this.fetchCriteriosPorSilabo(silabo.id);

      await this.fetchActividadesPorSilabo(silabo.id);

      this.showCreateForm = true;
    },

    /* ---------- Eliminar ---------- */
    async deleteItem(silabo) {
      if (!confirm(`¿Está seguro de eliminar el sílabo "${silabo.nombre}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.DETAIL(silabo.id), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al eliminar el sílabo');
        await this.fetchSilabos();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    /* ---------- Misceláneos ---------- */
    cancelForm() {
      this.editingItem = null;
      this.showCreateForm = false;
      this.unidadesExistentes = []; // Limpiar unidades existentes
      this.criteriosExistentes = [];
      this.actividadesExistentes = [];
      this.resetFormData();
      this.error = null;
    },

    resetFormData() {
      this.formData = {
        // Campos requeridos por la API
        periodo_lectivo: '',
        profesor: '',
        facultad: '',
        carrera: '',
        curso: '',

        // Campos adicionales
        nombre: '',
        semestre: '',
        area_formacion: '',
        tipo_curso: '',
        carrera_profesional: '',
        nro_creditos: null,
        prerrequisitos: '',
        periodo: '',
        horas_teoria: null,
        horas_practica: null,
        codigo_curso: '',
        docente: '',
        correo_docente: '',
        competencia_curso: '',
        competencia_perfil: '',
        competencias_previas: '',
        sumilla: '',
        actividades_rsu: '',
        actividades: [],
        unidades: [],
        criterios: [],
        activo: true
      };
    },

    /* ---------- Paginación / Búsqueda ---------- */
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },

    changeItemsPerPage() {
      this.currentPage = 1;
    },

    handleSearch() {
      this.currentPage = 1;
      this.applyFilters();
    },

    applyFilters() {
      if (!this.searchTerm.trim()) {
        this.filteredSilabos = [...this.silabos];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSilabos = this.silabos.filter(s =>
          s.nombre?.toLowerCase().includes(term) ||
          s.codigo_curso?.toLowerCase().includes(term) ||
          s.docente?.toLowerCase().includes(term) ||
          s.curso_detalle?.nombre?.toLowerCase().includes(term) ||
          s.profesor_detalle?.persona?.nombre?.toLowerCase().includes(term) ||
          s.periodo_lectivo_detalle?.periodo?.toLowerCase().includes(term)
        );
      }
    }
  }
};