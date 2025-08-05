# backend/Dockerfile

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# ✅ Change this
COPY app/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn[standard]

# ✅ Change these too
COPY app /app/app
COPY app/scripts /app/scripts

# ❌ Remove hardcoded .env COPY
# .env should be set via environment variable in docker-compose or GitHub Actions

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
