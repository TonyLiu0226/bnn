#!/bin/bash

# Navigate to the docker-compose directory
cd /home/indoorotaku/Documents/projects/bnn/bnn

TARGET_DIR="/backups/latest"

if [ -n "$1" ]; then
    TARGET_DIR="/backups/$1"
fi

echo "Restoring workflows from ${TARGET_DIR}..."

# Execute the n8n import command inside the running container
docker compose exec n8n n8n import:workflow --separate --input=${TARGET_DIR}

echo "Workflows restored successfully from ${TARGET_DIR}"
