FROM bitnami/node:18
ENV APP_ROOT=/test

COPY ./test ${APP_ROOT}
WORKDIR ${APP_ROOT}
RUN install_packages python3
RUN ln -sf python3 /usr/bin/python && \
 pip3 install --no-cache -r requirements.txt && \
  npx playwright install-deps
RUN rfbrowser init
