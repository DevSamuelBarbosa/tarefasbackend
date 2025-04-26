# tarefasbackend

- Para inicializar o server é só executar "npm run start"
- Toda vez que alterar o tarefaController, tem que reiniciar o server

### Quando adicionar coluna no schema.prisma tem que fazer
```
npx prisma migrate dev --name add-nome-da-coluna
npx prisma generate
```
e executar isso depois:
```
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
rm -rf prisma/generated
rm -rf generated/

npm install prisma @prisma/client
npx prisma generate
```
e por fim, dar CTRL+SHIFT+P -> Reload Window

### Se ao executar 'npm run start' estourar o seguinte erro:
```
/home/github/tarefasbackend/node_modules/.prisma/client/default.js:43
throw new Error('@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.');
...
```
#### Fazer:


