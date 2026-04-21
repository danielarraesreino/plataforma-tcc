# Technical Specification: Plataforma TCC Interativa

## 1. Visão Geral
A Plataforma TCC Interativa é uma ferramenta online voltada para o automonitoramento clínico (RPD - Registro de Pensamentos Disfuncionais) e o manejo de impulsos (GMT - Gerenciamento e Modificação de Tendências).

## 2. Tech Stack
- **Frontend**: React (com TypeScript estrito)
- **Backend**: Node.js (com TypeScript estrito)
- **Estilização**: Vanilla CSS (foco em Design Premium, interface calma e responsiva)
- **Banco de Dados**: PostgreSQL (ou equivalente relacional robusto)
- **Autenticação e Segurança**: JWT, bcrypt e criptografia em nível de aplicação (AES-256) para todos os campos clínicos sensíveis.

## 3. Modelos de Dados (Estrutura Principal)

### 3.1. RPD (Registro de Pensamentos Disfuncionais)
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key)
- `dataHora`: Timestamp
- `situacao`: Texto longo (Criptografado)
- `pensamentoAutomatico`: Texto longo (Criptografado)
- `emocoesIniciais`: JSON (Array de Emoção + Intensidade 0-100)
- `comportamento`: Texto longo (Criptografado)
- `distorcoesCognitivas`: JSON (Array de strings - mapeado via regras clínicas)
- `respostaAlternativa`: Texto longo (Criptografado)
- `emocoesFinais`: JSON (Array de Emoção + Intensidade 0-100)
- `grauCrencaInicial`: Inteiro 0-100
- `grauCrencaFinal`: Inteiro 0-100

### 3.2. GMT (Manejo de Impulsos)
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key)
- `dataHora`: Timestamp
- `gatilho`: Texto longo (Criptografado)
- `intensidadeImpulso`: Inteiro 0-10
- `tecnicaUtilizada`: String (ex. 'Urge Surfing', 'Adiar 15 min', 'Cartão de Enfrentamento')
- `sucesso`: Booleano (O impulso foi manejado com eficácia?)

## 4. Protocolos de Segurança e Privacidade
- **Modo Discreto**: Nenhuma informação sensível será exibida em logs, URLs, prompts de IA ou interfaces não seguras.
- **Criptografia End-to-End/At-Rest**: Os campos que contêm relatos dos pacientes (situação, pensamento, resposta) não serão legíveis diretamente no banco de dados.
- **Auditoria**: Comandos que tocam no banco de dados exigem aprovação expressa do administrador (Terminal Execution Policy restrita).
