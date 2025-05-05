FROM python:3.13.3-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libffi-dev \
    libssl-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/ .
RUN pip install --no-cache-dir -r requirements.txt

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

ARG REDIS_URL
ENV REDIS_URL=${REDIS_URL}

ARG DB_USER
ENV DB_USER=${DB_USER}

ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}

ARG DB_HOST
ENV DB_HOST=${DB_HOST}

ARG DB_PORT
ENV DB_PORT=${DB_PORT}

ARG DB_NAME
ENV DB_NAME=${DB_NAME}

EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
