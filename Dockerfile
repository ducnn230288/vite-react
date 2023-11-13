FROM bitnami/node:18

WORKDIR /app
RUN chmod 777 /app

COPY --chown=root:root . .
RUN install_packages python3
RUN ln -sf python3 /usr/bin/python && \
 pip3 install --no-cache -r test/requirements.txt && \
  npx playwright install-deps
RUN rfbrowser init
ENV NODE_OPTIONS=--max_old_space_size=4048
RUN npm install -f && npm install -g npm serve && npm run build
USER root
