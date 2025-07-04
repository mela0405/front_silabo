<template>
  <div id="app">
    <!-- Mostrar Login si no está autenticado -->
    <Login 
      v-if="!isAuthenticated" 
      @login-success="handleLoginSuccess"
    />
    
    <!-- Mostrar Dashboard si está autenticado -->
    <Dashboard 
      v-if="isAuthenticated" 
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import Login from '@/components/LoginComponent.vue'
import Dashboard from '@/components/DashboardComponent.vue'

export default {
  name: 'App',
  components: {
    Login,
    Dashboard
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    handleLoginSuccess() {
      this.isAuthenticated = true;
    },
    handleLogout() {
      this.isAuthenticated = false;
      // Asegurar que el token se elimine
      localStorage.removeItem('access_token');
    },
    checkAuthStatus() {
      // Verificar si hay token en localStorage al iniciar la app
      const token = localStorage.getItem('access_token');
      this.isAuthenticated = !!token;
    }
  },
  mounted() {
    // Verificar estado de autenticación al montar la app
    this.checkAuthStatus();
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>