FROM rust:1.79-alpine AS builder

RUN apk add --no-cache musl-dev
WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
# Cache dependencies
RUN mkdir src && echo "fn main(){}" > src/main.rs && cargo build --release && rm -rf src
COPY src ./src
RUN touch src/main.rs && cargo build --release

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/target/release/solver .
EXPOSE 8090
CMD ["./solver"]
