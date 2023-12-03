FROM bitnami/node:18 as build-stage
WORKDIR /app
COPY --chown=root:root . .
RUN npm install -f && \
npm run build:stag

FROM bitnami/node:18 as production-stage
WORKDIR /app
COPY --from=build-stage /app/build .
COPY --chown=root:root ./test ./test

RUN npm install -g npm serve
RUN install_packages python3
RUN ln -sf python3 /usr/bin/python && \
pip3 install --no-cache -r test/requirements.txt && \
npx playwright install-deps
RUN rfbrowser init
