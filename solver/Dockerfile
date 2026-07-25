FROM rust:alpine AS builder

RUN apk add --no-cache musl-dev
WORKDIR /app
COPY . .
RUN cargo build --release

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/target/release/solver .
EXPOSE 8090
CMD ["./solver"]
