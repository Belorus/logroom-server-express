FROM node:8

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g

COPY . .

CMD ["pm2-runtime", "pm2-process.yml", "--watch"]