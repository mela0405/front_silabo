import {TOKEN_API} from '@/config/constants'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';

      try {
        const response = await fetch(TOKEN_API.GET_TOKEN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Guardar el token en localStorage
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('name', data.nombre);
          localStorage.setItem('email', data.email);

          // Emitir evento para notificar login exitoso
          this.$emit('login-success');
          
          // Opcional: también puedes usar router si tienes Vue Router
          // this.$router.push('/dashboard');
          
        } else {
          this.error = data.message || 'Error al iniciar sesión';
        }
      } catch (error) {
        this.error = 'Error de conexión. Intenta nuevamente.';
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}