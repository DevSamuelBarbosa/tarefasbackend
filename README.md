O projeto tarefasbackend é um backend simples para gerenciar tarefas. Ele permite que usuários criem, atualizem, listem e excluam tarefas, além de marcar tarefas como concluídas. Basicamente, é uma API que faz o CRUD de tarefas e pode incluir autenticação para gerenciar permissões.

## 🛠️ Tecnologias
- Linguagem: Node.js + Express
- Banco: PostgreSQL
- Autenticação: JWT (JSON Web Tokens)

## ✅ Funcionalidades
- Criar, listar, atualizar e deletar tarefas  
- Filtrar tarefas por status (`pendente`, `concluída`)  
- Marcar tarefas como concluídas  
- Autenticação de usuário (login/cadastro)  
- Controle de solicitações via middleware (logging, validação)