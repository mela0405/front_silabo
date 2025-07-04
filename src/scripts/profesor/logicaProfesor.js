import { PROFESOR_API, PROFESION_API } from '@/config/constants';

export default {
    name: 'ProfesorComponent',
    data() {
        return {
            profesores: [],
            profesiones: [],
            loading: false,
            error: null,
            showCreateForm: false,
            editingItem: null,
            formData: {
                persona: {
                    usuario: {
                        email: '',
                        password: ''
                    },
                    nombre: '',
                    apellido_paterno: '',
                    apellido_materno: '',
                    dni: '',
                    fecha_nacimiento: '',
                    genero: '',
                    nacionalidad: '',
                    telefono: ''
                },
                profesion: '',
                activo: true
            },
            currentPage: 1,
            itemsPerPage: 10,
            searchTerm: '',
            filteredProfesores: []
        };
    },
    computed: {
        totalItems() {
            return this.filteredProfesores.length;
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },
        endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
        },
        paginatedProfesores() {
            return this.filteredProfesores.slice(this.startIndex, this.endIndex);
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            if (this.totalPages <= maxVisible) {
                for (let i = 1; i <= this.totalPages; i++) pages.push(i);
            } else {
                const start = Math.max(1, this.currentPage - 2);
                const end = Math.min(this.totalPages, this.currentPage + 2);
                if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push('...');
                }
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < this.totalPages) {
                    if (end < this.totalPages - 1) pages.push('...');
                    pages.push(this.totalPages);
                }
            }
            return pages;
        }
    },
    watch: {
        profesores() {
            this.applyFilters();
        }
    },
    mounted() {
        this.fetchProfesores();
        this.fetchProfesiones();
        this.checkApiConfiguration();
    },
    methods: {
        formatErrors(errors, parentKey = '') {
            const messages = [];
            for (const [key, value] of Object.entries(errors)) {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                if (Array.isArray(value)) {
                    messages.push(`${fullKey}: ${value.join(', ')}`);
                } else if (typeof value === 'object' && value !== null) {
                    messages.push(...this.formatErrors(value, fullKey));
                } else {
                    messages.push(`${fullKey}: ${String(value)}`);
                }
            }
            return messages;
        },

        async fetchProfesiones() {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(PROFESION_API.LIST, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error al cargar profesiones');
                this.profesiones = await response.json();
            } catch (error) {
                this.error = error.message;
            }
        },

        async fetchProfesores() {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('access_token');

                if (!token) {
                    throw new Error('No hay token de autenticación');
                }

                console.log('Fetching from:', PROFESOR_API.LIST);

                const response = await fetch(PROFESOR_API.LIST, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Fetch response status:', response.status);
                console.log('Fetch response content-type:', response.headers.get('content-type'));

                if (!response.ok) {
                    const responseText = await response.text();
                    console.error('Fetch error response:', responseText);

                    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
                        throw new Error(`Error del servidor (${response.status}): Revisa la URL del API y la autenticación`);
                    }

                    throw new Error(`Error ${response.status}: ${responseText}`);
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const responseText = await response.text();
                    console.error('Non-JSON response in fetch:', responseText);
                    throw new Error('El servidor no devolvió una respuesta JSON válida');
                }

                this.profesores = await response.json();
                console.log('Profesores loaded:', this.profesores.length);

            } catch (error) {
                console.error('Error in fetchProfesores:', error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async submitForm() {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('access_token');

                // Check if token exists
                if (!token) {
                    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
                }

                const isEditing = !!this.editingItem;
                const url = isEditing ? PROFESOR_API.DETAIL(this.editingItem.id) : PROFESOR_API.LIST;
                const method = isEditing ? 'PUT' : 'POST';

                const payload = {
                    persona: {
                        usuario: {
                            email: this.formData.persona.usuario.email
                        },
                        nombre: this.formData.persona.nombre,
                        apellido_paterno: this.formData.persona.apellido_paterno,
                        apellido_materno: this.formData.persona.apellido_materno,
                        dni: this.formData.persona.dni,
                        fecha_nacimiento: this.formData.persona.fecha_nacimiento,
                        genero: this.formData.persona.genero,
                        nacionalidad: this.formData.persona.nacionalidad,
                        telefono: this.formData.persona.telefono
                    },
                    profesion: parseInt(this.formData.profesion),
                    activo: true
                };

                // Solo incluir password si no está vacío
                if (this.formData.persona.usuario.password.trim()) {
                    payload.persona.usuario.password = this.formData.persona.usuario.password;
                }

                console.log('Sending request to:', url);
                console.log('Method:', method);
                console.log('Payload:', JSON.stringify(payload, null, 2));

                const response = await fetch(url, {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                console.log('Response content-type:', response.headers.get('content-type'));

                // Check if response is ok
                if (!response.ok) {
                    // Try to get the response text to see what we're actually receiving
                    const responseText = await response.text();
                    console.error('Raw response:', responseText);

                    // Check if it's HTML (error page)
                    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
                        throw new Error(`Error del servidor (${response.status}): El servidor devolvió una página HTML en lugar de JSON. Esto puede indicar un problema con la URL del API o autenticación.`);
                    }

                    // Try to parse as JSON
                    try {
                        const errorData = JSON.parse(responseText);
                        throw new Error(this.formatErrors(errorData).join('\n'));
                    } catch (parseError) {
                        throw new Error(`Error ${response.status}: ${responseText || 'Error desconocido del servidor'}`);
                    }
                }

                // Check content type
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const responseText = await response.text();
                    console.error('Non-JSON response:', responseText);
                    throw new Error('El servidor no devolvió una respuesta JSON válida');
                }

                const responseData = await response.json();
                console.log('Success response:', responseData);

                await this.fetchProfesores();
                this.cancelForm();

            } catch (error) {
                console.error('Error in submitForm:', error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        checkApiConfiguration() {
            console.log('API Configuration Check:');
            console.log('PROFESOR_API.LIST:', PROFESOR_API.LIST);
            console.log('PROFESOR_API.DETAIL:', typeof PROFESOR_API.DETAIL === 'function' ? 'Function defined' : PROFESOR_API.DETAIL);
            console.log('PROFESION_API.LIST:', PROFESION_API.LIST);
            console.log('Current token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
            console.log('Current base URL:', window.location.origin);
        },

        async deleteItem(profesor) {
            if (!confirm(`¿Está seguro de eliminar al profesor "${profesor.persona.nombre} ${profesor.persona.apellido_paterno}"?`)) return;

            this.loading = true;
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(PROFESOR_API.DETAIL(profesor.id), {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error al eliminar el profesor');

                await this.fetchProfesores();
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        editItem(profesor) {
            this.editingItem = profesor;
            this.formData = {
                persona: {
                    usuario: {
                        email: profesor.persona.usuario.email,
                        password: ''
                    },
                    nombre: profesor.persona.nombre,
                    apellido_paterno: profesor.persona.apellido_paterno,
                    apellido_materno: profesor.persona.apellido_materno,
                    dni: profesor.persona.dni,
                    fecha_nacimiento: profesor.persona.fecha_nacimiento,
                    genero: profesor.persona.genero,
                    nacionalidad: profesor.persona.nacionalidad,
                    telefono: profesor.persona.telefono
                },
                profesion: profesor.profesion,
                activo: true
            };
            this.showCreateForm = true;
        },

        cancelForm() {
            this.showCreateForm = false;
            this.editingItem = null;
            this.formData = {
                persona: {
                    usuario: {
                        email: '',
                        password: ''
                    },
                    nombre: '',
                    apellido_paterno: '',
                    apellido_materno: '',
                    dni: '',
                    fecha_nacimiento: '',
                    genero: '',
                    nacionalidad: '',
                    telefono: ''
                },
                profesion: '',
                activo: true
            };
            this.error = null;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
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
                this.filteredProfesores = [...this.profesores];
            } else {
                const term = this.searchTerm.toLowerCase();
                this.filteredProfesores = this.profesores.filter(prof =>
                    prof.persona.usuario.email.toLowerCase().includes(term) ||
                    prof.persona.nombre.toLowerCase().includes(term) ||
                    prof.persona.apellido_paterno.toLowerCase().includes(term) ||
                    prof.persona.apellido_materno.toLowerCase().includes(term) ||
                    prof.persona.dni.toLowerCase().includes(term) ||
                    (prof.profesion_detalle?.nombre || '').toLowerCase().includes(term)
                );
            }
        }
    }
};