<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-area">
                <router-link to="/">
                    <img src="/logo-simples-PostCamp.jpg" alt="Logo PostCamp" class="logo-img" />
                </router-link>
                <h1>Acessar o PostCamp</h1>
                <p>Entre com sua conta para gerenciar e publicar seus projetos acadêmicos.</p>
            </div>

            <form @submit.prevent="fazerLogin" class="login-form">
                <div class="input-group">
                    <label for="email">E-mail institucional</label>
                    <input
                      type="email"
                      id="email"
                      v-model="email"
                      placeholder="seu.nome@unioeste.br"
                      required
                    />   
                </div>

                <div class="input-group">
                    <label for="senha">Senha</label>
                    <input
                      type="password"
                      id="senha"
                      v-model="senha"
                      placeholder="********"
                      required
                    />  
                </div>

                <button type="submit" class="btn-submit">Entrar no Sistema</button>
            </form>

            <div class="login-footer">
                <router-link to="/" class="voltar-link">← Voltar para a página inicial</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const senha = ref('')

const fazerLogin = () => {
    //apenas um mock
    localStorage.setItem('postcamp_logado', 'true')
    localStorage.setItem('postcamp_user', email.value)

    alert('Login simulado com sucesso! Bem-vindo ao PostCamp.')

    //redirecionando para mural de projetos
    router.push('/projetos/novo')
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
}

.login-card {
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 4px 6px -1px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 420px;
}

.logo-area {
    text-align: center;
    margin-bottom: 24px;
}

.logo-img {
    height: 80px;
    width: auto;
    margin-bottom: 12px;
}

.logo-area h1 {
    font-size: 1.5rem;
    color: #3b0764;
    margin-bottom: 8px;
    font-weight: 700;
}

.logo-area p {
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.4;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-group label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
}

.input-group input {
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.95krem;
    outline: none;
    transition: border-color 0.2s;
}

.input-group input:focus {
    border-color: #581c87;
}

.btn-submit {
    margin-top: 10px;
    background-color: #581c87;
    color: #ffffff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-submit:hover {
    background-color: #3b0764;
}

.login-footer {
    text-align: center;
    margin-top: 20px;
}

.voltar-link {
    color: #6b7280;
    font-size: 0.85rem;
    text-decoration: none;
}

.voltar-link:hover {
    color: #581c87;
    text-decoration: underline;
}
</style>