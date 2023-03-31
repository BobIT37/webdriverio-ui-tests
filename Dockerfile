FROM --platform=linux/amd64 node:18-slim

ARG NPM_TOKEN
ENV NPM_TOKEN $NPM_TOKEN


RUN apt-get update
RUN apt-get install -y default-jre build-essential wget sudo curl

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

RUN apt-get update
RUN apt-get install -y google-chrome-stable
RUN google-chrome --no-sandbox --headless

# Install Edge
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
RUN sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-dev.list'
RUN sudo rm microsoft.gpg
RUN sudo apt -y update && sudo apt -y install microsoft-edge-stable

WORKDIR /app
COPY . /app
RUN yarn install
RUN npm config fix
RUN npm install typescript -g
CMD yarn headless runner && node helper/report_generator.js && exit 0
