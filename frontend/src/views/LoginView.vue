<template>
  <div class="page-container">
    <div class="login-box">
      <div class="login-header">
        <h2>Login</h2>
      </div>

      <div class="login-body">
        <form @submit.prevent="handleLogin">
          <!-- Campo Usuário / E-mail -->
          <div class="input-group">
            <span class="input-icon">
              <!-- Ícone de usuário -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
              </svg>
            </span>
            <input 
              type="email" 
              v-model="email" 
              placeholder="usuário/email (@unioeste)" 
              required 
            />
          </div>

          <!-- Campo Senha -->
          <div class="input-group">
            <span class="input-icon">
              <!-- Ícone de cadeado -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 0-2 2v4H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zm-1 2a1 1 0 0 1 2 0v4H7V3zm4 6v6H5V9h6z"/>
              </svg>
            </span>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="senha" 
              required 
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
              title="Mostrar/ocultar senha"
            >
              <!-- Ícone de olho -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
              </svg>
            </button>
          </div>

          <!-- Mensagem de erro para e-mails sem @unioeste -->
          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <!-- Checkbox Lembrar -->
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="remember" />
            <label for="remember">Lembrar meu usuário</label>
          </div>

          <!-- Botões e Esqueci Senha -->
          <div class="actions-row">
            <button type="submit" class="btn-entrar">Entrar</button>
            
            <div class="right-links">
              <a href="#" class="link-forgot">Esqueci a senha/usuário</a>
            </div>
          </div>
        </form>

        <!-- Links do Rodapé do Box/Card -->
        <div class="card-footer-links">
          <a href="#">Ajuda</a> | 
          <a href="#">Documentos</a> | 
          <a href="#">Sistemas</a> | 
          <a href="#">Termos</a> | 
          <a href="#">Sobre</a>
        </div>
      </div>
    </div>

    <!-- Link do Rodapé da Página -->
    <div class="page-footer">
      <a href="placeholder" target="_blank">
        nome do projeto.br/<strong>login</strong>
      </a>
    </div>
  </div>  
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''

  // Validação: Aceita apenas e-mails que contenham @unioeste
  if (!email.value.toLowerCase().includes('@unioeste')) {
    errorMessage.value = 'Acesso permitido apenas com e-mail institucional (@unioeste)'
    return // Ignora e interrompe o login
  }

  // Se for um e-mail válido da Unioeste, prossegue
  console.log('Login permitido para o usuário Unioeste:', {
    email: email.value,
    password: password.value,
    remember: remember.value
  })

  //API do projeto
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #eaeaea;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background-color: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.login-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #fcfcfc;
}

.login-header h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: bold;
  color: #333;
}

.login-body {
  padding: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 12px;
  background-color: #fff;
  overflow: hidden;
}

.input-icon {
  background-color: #eee;
  padding: 10px 12px;
  border-right: 1px solid #ccc;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group input {
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-size: 0.95rem;
  outline: none;
  color: #333;
}

.input-group input::placeholder {
  color: #999;
}

.toggle-password {
  background: #eee;
  border: none;
  border-left: 1px solid #ccc;
  padding: 10px 12px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
}

.toggle-password:hover {
  background: #e2e2e2;
}

.error-alert {
  color: #d9534f;
  background-color: #f9f2f4;
  border: 1px solid #ebccd1;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #333;
}

.remember-me input {
  cursor: pointer;
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.btn-entrar {
  background-color: #5cb85c;
  color: white;
  border: 1px solid #4cae4c;
  padding: 8px 18px;
  font-size: 0.95rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-entrar:hover {
  background-color: #449d44;
}

.right-links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.link-forgot {
  color: #337ab7;
  font-size: 0.85rem;
  text-decoration: none;
}

.link-forgot:hover {
  text-decoration: underline;
}

.card-footer-links {
  border-top: 1px solid #eee;
  padding-top: 12px;
  text-align: center;
  font-size: 0.82rem;
  color: #777;
}

.card-footer-links a {
  color: #777;
  text-decoration: none;
}

.card-footer-links a:hover {
  text-decoration: underline;
}

.page-footer {
  margin-top: 25px;
}

.page-footer a {
  color: #337ab7;
  font-size: 0.95rem;
  text-decoration: none;
}

.page-footer a:hover {
  text-decoration: underline;
}
</style>