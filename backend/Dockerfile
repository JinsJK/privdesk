FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# ✅ Correct relative paths from repo root
COPY backend/app/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn[standard]

COPY backend/app /app/app
COPY backend/app/scripts /app/scripts

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
