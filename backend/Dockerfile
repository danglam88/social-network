FROM golang:1.18
WORKDIR /app
COPY . .
RUN go mod download golang.org/x/net
RUN go build .
EXPOSE 8080
CMD ["./socialnetwork"]