import { ref, onMounted } from 'vue'

export default {
  name: 'SilaboForm',
  props: {
    editingItem: Object
  },
  emits: ['save', 'cancel'],
  setup (props, { emit }) {
    const loading = ref(false)
    
    const facultades = ref([
      { id: 1, nombre: 'Facultad de Ingeniería' },
      { id: 2, nombre: 'Facultad de Ciencias' },
      { id: 3, nombre: 'Facultad de Humanidades' }
    ])
    
    const carreras = ref([
      { id: 1, nombre: 'Ingeniería de Software' },
      { id: 2, nombre: 'Ingeniería de Sistemas' },
      { id: 3, nombre: 'Ingeniería Industrial' }
    ])

    const tiposCurso = [
      { id: 'obligatorio', nombre: 'Obligatorio' },
      { id: 'electivo', nombre: 'Electivo' }
    ]

    const formData = ref(props.editingItem ? { ...props.editingItem } : getEmptyForm())

    function getEmptyForm () {
      return {
        facultad: '',
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
        unidades: [],
        actividades_rsu: '',
        criterios: []
      }
    }

    function addUnidad () {
      formData.value.unidades.push({
        denominacion: '',
        semana: '',
        competencia: '',
        contenidos: '',
        metodologia: '',
        fuentes: ''
      })
    }
    
    function removeUnidad (idx) {
      formData.value.unidades.splice(idx, 1)
    }

    function addCriterio () {
      formData.value.criterios.push({ 
        evaluacion: '', 
        peso: null, 
        fecha: '', 
        descripcion: '' 
      })
    }
    
    function removeCriterio (idx) {
      formData.value.criterios.splice(idx, 1)
    }

    function submitForm () {
      loading.value = true
      setTimeout(() => {
        emit('save', formData.value)
        loading.value = false
      }, 1000)
    }

    function cancelForm () {
      emit('cancel')
    }

    onMounted(async () => {
      try {
        console.log('Formulario montado correctamente')
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    })

    return {
      formData,
      facultades,
      carreras,
      loading,
      tiposCurso,
      addUnidad,
      removeUnidad,
      addCriterio,
      removeCriterio,
      submitForm,
      cancelForm
    }
  }
}