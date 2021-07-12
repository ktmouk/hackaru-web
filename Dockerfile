FROM node:16.4.2-alpine as builder
ENV WEB_DIR /hackaru
WORKDIR $WEB_DIR
COPY package.json yarn.lock $WEB_DIR/
RUN apk add --update --no-cache python make g++ git && yarn install
COPY . $WEB_DIR
RUN yarn build

FROM node:16.4.2-alpine
ENV WEB_DIR /hackaru
WORKDIR $WEB_DIR
RUN addgroup hackaru \
 && adduser -s /bin/sh -D -G hackaru hackaru \
 && chown hackaru:hackaru $WEB_DIR
COPY --chown=hackaru:hackaru . $WEB_DIR
COPY --chown=hackaru:hackaru \
     --from=builder \
     $WEB_DIR/node_modules \
     $WEB_DIR/node_modules
COPY --chown=hackaru:hackaru \
     --from=builder \
     $WEB_DIR/.nuxt/dist \
     $WEB_DIR/.nuxt/dist
USER hackaru
CMD ["yarn", "start"]
