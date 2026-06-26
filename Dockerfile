FROM docker.n8n.io/n8nio/n8n

# Set the environment variables
ENV GENERIC_TIMEZONE="America/Los_Angeles"
ENV TZ="America/Los_Angeles"
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS="true"
ENV N8N_RUNNERS_ENABLED="true"

# Expose the n8n port
EXPOSE 5678
