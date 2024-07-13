# Use a imagem oficial do Node.js versão 14
FROM node:18


# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json (se aplicável)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o wait-for-it.sh para o diretório de trabalho
COPY wait-for-it.sh .

# Copie todo o código fonte para o diretório de trabalho
COPY . .

# Exponha a porta em que o NestJS vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "run", "start:dev"]
