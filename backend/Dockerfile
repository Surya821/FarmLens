# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables for better Python logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (Fixed library names for the latest Debian)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
# Using --no-cache-dir saves space on Hugging Face
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port Hugging Face expects
EXPOSE 7860

# Optimized command to run the application (No file extension in "app:app")
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
