FROM python:3.13-slim

WORKDIR /app

COPY . ./
RUN pip install --no-cache-dir -r requirements.txt

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

ARG REDIS_URL
ENV REDIS_URL=${REDIS_URL}

EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
