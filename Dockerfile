FROM mcr.microsoft.com/playwright:focal
ENV APP_ROOT=/test
COPY ./test ${APP_ROOT}
WORKDIR ${APP_ROOT}
RUN apt-get update
RUN apt-get install -y python3-pip
RUN pip3 install --no-cache -r requirements.txt
RUN rfbrowser init
ENV NODE_PATH=/usr/lib/node_modules
ENV PATH="/home/pwuser/.local/bin:${PATH}"
