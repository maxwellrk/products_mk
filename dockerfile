FROM node:12.16.3
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 3000
CMD ["node", "server/app.js"]
COPY . .
