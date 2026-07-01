FROM docker.n8n.io/n8nio/n8n

# Set the environment variables
ENV GENERIC_TIMEZONE="America/Los_Angeles"
ENV TZ="America/Los_Angeles"
ENV N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS="true"
ENV N8N_RUNNERS_ENABLED="true"
ENV EXECUTIONS_TIMEOUT=180
ENV NODE_FUNCTION_ALLOW_EXTERNAL="crypto, cheerio"
# Expose the n8n port
EXPOSE 5678
