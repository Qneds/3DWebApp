FROM node:14-alpine AS builder
#ENV NODE_ENV production
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app
COPY . .

RUN npm install
RUN npm install react-scripts@3.4.1 -g --silent
#RUN npm run build


#FROM nginx:1.21.0-alpine as production
#ENV NODE_ENV production

#COPY --from=builder /app/build /usr/share/nginx/html

#COPY nginx.conf /etc/nginx/conf.d/default.conf

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "start"]