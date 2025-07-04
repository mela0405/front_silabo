<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Ingresa tu email"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Ingresa tu contraseña"
            class="form-input"
          />
        </div>

        <button 
          type="submit" 
          class="login-btn"
          :disabled="loading"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import Login from '@/scripts/login/logicaLogin'

export default {
  ...Login
}
</script>

<style scoped>
@import '@/assets/login/particular.css';
</style>