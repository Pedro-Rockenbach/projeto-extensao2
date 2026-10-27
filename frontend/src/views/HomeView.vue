<template>
    <div class="home-container">
        <!-- Bloco 1: Hero / Boas-Vindas -->
         <section class="hero-section">
            <div class="hero-content">
                <span class="badge"> Unioeste · Campus de Cascavel</span>
                <h1> Mural de Projetos de Extensão </h1>
                <p class="subtitle">
                    O <strong> PostCamp </strong> é a plataforma oficial para divulgar e encontrar oportunidades de extensão universitária no âmbito acadêmico.
                </p>
                <div class="hero-buttons">
                    <router-link to="/projetos" class="btn btn-primary">
                        Ver Projetos Abertos
                    </router-link>
                    <router-link to="/login" class="btn btn-outline">
                        Publicar Projeto
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Bloco 2: Recursos / Como Funciona -->
         <section class="features-section">
            <h2> O que você encontra aqui ? </h2>
            <div class="cards-grid">
                <div class="feature-card">
                    <div class="icon">📚</div>
                    <h3> Oportunidades de Extensão </h3>
                    <p> Acompanhe inscrições abertas, vagas disponíveis e detalhes sobre atividades acadêmicas. </p>
                </div>

                <div class="feature-card">
                    <div class="icon">🏛️</div>
                    <h3> Integração Universitária </h3>
                    <p> Conecte-se aos projetos desenvolvidos pelos cursos da Unioeste e fortaleça a comunidade. </p>
                </div>

                <div class="feature-card">
                    <div class="icon">🚀</div>
                    <h3> Divulgação Simplificada </h3>
                    <p> Publique e gerencie seus projetos de extensão de forma rápida e acessível. </p>
                </div>
            </div>
        </section>
    </div>
    </template>

    <script setup>
    </script>

    <style scoped>
    .home-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px;
        font-family: inherit;
    }

    /* Hero Section */
    .hero-section {
        text-align: center;
        padding: 60px 20px;
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        margin-bottom: 40px;
    }

    .badge {
        display: inline-block;
        background-color: #f3e8ff;
        color: #581c87;
        font-size: 0.85rem;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 20px;
        margin-bottom: 16px;
    }

    .hero-section h1 {
        font-size: 2.4rem;
        color: #3b0764;
        margin-bottom: 16px;
        font-weight: 700;
    }

    .subtitle {
        font-size: 1.1rem;
        color: #4b5563;
        max-width: 650px;
        margin: 0 auto 30px auto;
        line-height: 1.6;
    }

    /* Botões */
    .hero-buttons {
        display: flex;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
    }

    .btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
        font-size: 1rem;
    }

    .btn-primary {
        background-color: #4c1d95;
        color: #ffffff;
    }

    .btn-primary:hover {
        background-color: #3b0764;
    }

    .btn-outline {
        border: 2px solid #4c1d95;
        color: #4c1d95;
        background: transparent;
    }

    .btn-outline:hover {
       background-color: #f3e8ff;
    }

    /*Bloco de Cards */
    .features-section {
        text-align: center;
        margin-top: 40px;
    }

    .features-section h2 {
        font-size: 1.6rem;
        color: #3b0764;
        margin-bottom: 30px;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px; 
    }

    .feature-card {
        background: #ffffff;
        padding: 28px 20px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        text-align: center;
    }

    .feature-card .icon {
        font-size: 2.2rem;
        margin-bottom: 12px;
    }

    .feature-card h3 {
        font-size: 1.2rem;
        color: #1f2937;
        margin-bottom: 10px;
    }

    .feature-card p {
        color: #6b7280;
        font-size: 0.95rem;
        line-height: 1.5;
    }
    </style>