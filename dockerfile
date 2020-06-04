FROM node:12.16.3
WORKDIR /app
COPY package.json .
RUN npm install
EXPOSE 43443
CMD ["node", "server/app.js"]
COPY . .
