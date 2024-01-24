# stage1: build the React app
FROM node:21.5-alpine as build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
ENV REACT_APP_API_ENDPOINT="http://127.0.0.1:5000/todos"
RUN npm run build

# stage2: use Nginx to server the production build
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx","-g","daemon off;"]
