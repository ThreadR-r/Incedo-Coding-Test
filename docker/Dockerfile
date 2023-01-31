FROM node:lts
WORKDIR /incedo_api
COPY . .
RUN yarn install --frozen-lockfile --production=true

# To be sure
ENV NODE_ENV production

# override any PORT env passed to docker run/create
ENV PORT 8080

EXPOSE 8080

CMD ["yarn", "start-prod"]