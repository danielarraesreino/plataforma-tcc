# Skill: privacy-shield-skill

## Descrição
Instruções estritas de sigilo clínico e anonimização de dados. O "Modo Discreto" da plataforma.

## Regras Críticas
- **Nunca Exibir Dados Clínicos**: É terminantemente proibido exibir pensamentos automáticos, emoções, ou gatilhos reais nos logs do terminal, arquivos de artifacts (como walkthrough.md), ou saídas de debug.
- **Mocking**: Durante testes end-to-end ou QA, utilize strings mockadas genéricas como "[DADO PROTEGIDO 01]".
- **Criptografia**: Certifique-se de que o backend criptografe (AES-256 ou similar) os dados sensíveis antes de executar operações de gravação no banco de dados.
