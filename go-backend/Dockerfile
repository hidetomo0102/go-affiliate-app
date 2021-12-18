FROM golang:1.17

WORKDIR /app
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . ./
RUN curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin

ARG CGO_ENABLED=0
ARG GOOS=linux
ARG GOARCH=amd64

CMD ["air"]