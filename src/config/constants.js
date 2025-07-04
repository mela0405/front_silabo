const BACK_URL = import.meta.env.VITE_BACK_URL;
const OAUTH_URL = import.meta.env.VITE_OAUTH_URL;

export const UNIVERSIDADES_API = {
  LIST: `${BACK_URL}/universidades/`,
  DETAIL: (id) => `${BACK_URL}/universidades/${id}/`
};

export const ACTIVIDADES_API = {
  LIST: `${BACK_URL}/actividades/`,
  DETAIL: (id) => `${BACK_URL}/actividades/${id}/`,
  SILABO: (silabo_id) => `${BACK_URL}/actividades/?silabo_id=${silabo_id}`
};

export const ESTUDIANTES_API = {
  LIST: `${BACK_URL}/estudiantes/`,
  DETAIL: (id) => `${BACK_URL}/estudiantes/${id}/`
};

export const TOKEN_API = {
    GET_TOKEN: `${OAUTH_URL}/token/`
};

export const FACULTADES_API = {
  LIST: `${BACK_URL}/facultades/`,
  DETAIL: (id) => `${BACK_URL}/facultades/${id}/`
}

export const DEPARTAMENTOS_API = {
  LIST: `${BACK_URL}/departamentos/`,
  DETAIL: (id) => `${BACK_URL}/departamentos/${id}/`
}

export const CARRERAS_API = {
  LIST: `${BACK_URL}/carreras/`,
  DETAIL: (id) => `${BACK_URL}/carreras/${id}/`
}

export const COMPETENCIA_API = {
  LIST: `${BACK_URL}/competencias/`,
  DETAIL: (id) => `${BACK_URL}/competencias/${id}/`
}

export const CRITERIO_API = {
  LIST: `${BACK_URL}/criterios/`,
  DETAIL: (id) => `${BACK_URL}/criterios/${id}/`,
  SILABO: (silabo_id) => `${BACK_URL}/criterios/?silabo_id=${silabo_id}`
}

export const AREA_API = {
  LIST: `${BACK_URL}/areas/`,
  DETAIL: (id) => `${BACK_URL}/areas/${id}/`
}

export const PLAN_CURRICULAR_API = {
  LIST: `${BACK_URL}/planes/`,
  DETAIL: (id) => `${BACK_URL}/planes/${id}/`
}

export const SEMESTRE_PLAN_API = {
  LIST: `${BACK_URL}/semestres-plan/`,
  DETAIL: (id) => `${BACK_URL}/semestres-plan/${id}/`
}

export const CURSO_API = {
  LIST: `${BACK_URL}/cursos/`,
  DETAIL: (id) => `${BACK_URL}/cursos/${id}/`
}


export const PERFIL_API = {
  LIST: `${BACK_URL}/perfiles/`,
  DETAIL: (id) => `${BACK_URL}/perfiles/${id}/`
}

export const PROFESION_API = {
  LIST: `${BACK_URL}/profesiones/`,
  DETAIL: (id) => `${BACK_URL}/profesiones/${id}/`
}

export const PROFESOR_API = {
  LIST: `${BACK_URL}/profesores/`,
  DETAIL: (id) => `${BACK_URL}/profesores/${id}/`
}

export const SUMILLA_API = {
  LIST: `${BACK_URL}/sumillas/`,
  DETAIL: (id) => `${BACK_URL}/sumillas/${id}/`
}

export const BIBLIOGRAFIA_API = {
  LIST: `${BACK_URL}/bibliografias/`,
  DETAIL: (id) => `${BACK_URL}/bibliografias/${id}/`
}

export const METODOLOGIA_API = {
  LIST: `${BACK_URL}/metodologias/`,
  DETAIL: (id) => `${BACK_URL}/metodologias/${id}/`
}

export const SEMANA_API = {
  LIST: `${BACK_URL}/semanas/`,
  DETAIL: (id) => `${BACK_URL}/semanas/${id}/`
}

export const UNIDAD_API = {
  LIST: `${BACK_URL}/unidades/`,
  DETAIL: (id) => `${BACK_URL}/unidades/${id}/`,
  SILABO: (silabo_id) => `${BACK_URL}/unidades/?silabo_id=${silabo_id}`
}

export const TIPO_CURSO_API = {
  LIST: `${BACK_URL}/tipos-curso/`,
  DETAIL: (id) => `${BACK_URL}/tipos-curso/${id}/`
}

export const SILABO_API = {
  LIST: `${BACK_URL}/silabos/`,
  DETAIL: (id) => `${BACK_URL}/silabos/${id}/`
}

export const PERIODO_LECTIVO_API = {
  LIST: `${BACK_URL}/periodos-lectivos/`,
  DETAIL: (id) => `${BACK_URL}/periodos-lectivos/${id}/`
}