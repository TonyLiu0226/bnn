#!/bin/bash

# Navigate to the docker-compose directory
cd /home/indoorotaku/Documents/projects/bnn/bnn

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/backups/backup_${TIMESTAMP}"

echo "Starting backup to ${BACKUP_DIR}..."

# Ensure the node user has permission to write to the backups directory
docker compose exec -T -u root n8n chown -R node:node /backups

# Execute the n8n export command inside the running container
# -T disables TTY allocation so it runs smoothly in the background
docker compose exec -T n8n sh -c "mkdir -p ${BACKUP_DIR} && n8n export:workflow --backup --output ${BACKUP_DIR}"

# Also copy to a 'latest' folder for easy restoration
docker compose exec -T n8n sh -c "rm -rf /backups/latest && cp -r ${BACKUP_DIR} /backups/latest"

echo "Workflows backed up successfully to ./n8n_backups/backup_${TIMESTAMP} and ./n8n_backups/latest"
