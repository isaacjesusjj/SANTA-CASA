# Faculdade ADS - FCMSCSP

Repositório central para organizar materiais acadêmicos do curso de Análise e Desenvolvimento de Sistemas.

## Organização

- `2026-2/` - disciplinas do 2º semestre de 2026
- cada disciplina possui um `README.md` com a estrutura recomendada para aulas, exercícios, trabalhos, provas, projetos e materiais
- projetos maiores ou em grupo podem continuar em repositórios próprios e ser referenciados aqui

## 2026/2

| Código | Disciplina |
|---|---|
| TG-D445 | Aplicações Web |
| TG-D446 | Banco de Dados Não Relacionais |
| TG-D447 | Desenvolvimento de Algoritmos |
| TG-D448 | Engenharia de Software |
| TG-D449 | Programação Orientada a Objetos |
| TG-D450 | Atividades de Extensão II |
| TG-D451 | Projeto Integrador de Competências I |
| TG-D452 | Sistemas Operacionais |

## Padrão para cada disciplina

```text
<disciplina>/
├── README.md
├── aulas/
├── exercicios/
├── trabalhos/
├── provas/
├── projetos/
└── materiais/
```

As pastas são criadas conforme os arquivos forem sendo adicionados, evitando diretórios vazios.

## Convenção de nomes

- Aulas: `AAAA-MM-DD-assunto.ext`
- Exercícios: `exercicio-01-assunto.ext`
- Trabalhos: `trabalho-01-nome.ext`
- Provas e simulados: `prova-01` ou `simulado-01`
- Projetos: nome curto e descritivo

## Commits

Exemplos:

- `docs: adiciona material da aula de banco de dados`
- `feat: adiciona exercicio de POO`
- `fix: corrige atividade de algoritmos`
- `chore: organiza arquivos da disciplina`

## Observação

Não armazenar senhas, tokens, chaves de API, dados pessoais sensíveis ou arquivos com credenciais neste repositório.
