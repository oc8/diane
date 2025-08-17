FROM golang:1.24.4-alpine

ARG PB_VERSION

RUN apk add --no-cache \
  unzip \
  ca-certificates \
  tesseract-ocr \
  tesseract-ocr-data-eng \
  tesseract-ocr-data-fra \
  tesseract-ocr-data-deu \
  tesseract-ocr-data-ita \
  tesseract-ocr-data-spa \
  tesseract-ocr-data-por \
  poppler-utils

RUN echo $PB_VERSION
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

WORKDIR /pb

# Copy go.mod and go.sum first for better caching
COPY ./go.mod ./go.sum ./

# Download dependencies in a separate layer (cached unless go.mod/go.sum change)
RUN go mod download

# Copy source code
COPY ./pb_migrations ./pb_migrations
COPY ./pb_hooks ./pb_hooks
COPY ./pb_public ./pb_public
COPY ./locales ./locales
COPY ./cmd ./cmd
COPY ./src ./src
COPY ./main.go ./main.go
RUN if [ -d "./temp/google" ]; then cp -r ./temp/google ./temp/google; fi

# Build the application with optimizations
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

RUN chmod +x ./cmd/start-prod.sh

CMD ["./cmd/start-prod.sh"]
