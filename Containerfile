FROM registry.access.redhat.com/ubi9:latest

COPY . /tmp/hello-server

ENV USERNAME=Marwa

RUN dnf module enable -y nodejs:18

RUN dnf install -y nodejs

RUN cd /tmp/hello-server && npm install

CMD cd /tmp/hello-server && npm start
