FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV MODEL_PATH=/app/models/best.onnx

RUN apt-get update \
  && apt-get install -y --no-install-recommends libgomp1 \
  && rm -rf /var/lib/apt/lists/*

COPY model-server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY model-server/app.py ./app.py
COPY models/best.onnx ./models/best.onnx

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
