# FROM node:lts-alpine
FROM node:lts-slim
RUN mkdir - p /app
COPY /dist /app/dist
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm ci --registry=http://10.10.10.154:48730/ 

EXPOSE 8881
CMD [ "npm", "run", "prd" ]

