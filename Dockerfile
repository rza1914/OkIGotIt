FROM python:3.11-slim

WORKDIR /app

# Copy only Python files
COPY requirements.txt .
COPY app/ ./app/
COPY create_admin.py .
COPY *.py .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
