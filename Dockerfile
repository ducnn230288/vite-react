FROM bitnami/node:18

WORKDIR /app
COPY --chown=root:root package*.json ./
RUN npm install
COPY --chown=root:root . .
ENV NODE_OPTIONS=--max_old_space_size=4048
RUN chmod 777 /app
RUN npm install -g npm serve
RUN npm run build
USER root
