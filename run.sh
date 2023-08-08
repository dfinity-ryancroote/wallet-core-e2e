#/usr/bin/env bash

# 0. Clean up any previous state.
rm -rf ./data

# 1. Start up the replica and Rosetta API.
docker-compose up -d

# 2. Wait until the rosetta API is ready.
max_attempts=20;
while [ ! -f ./data/db.sqlite ]; do
    max_attempts=$((max_attempts-1));
    if [ $max_attempts -eq 0 ]; then
        echo "Failed to start up the replica and icx-proxy.";
        docker-compose stop
        exit 1;
    fi
    sleep 60;
done

echo "Replica and Rosetta API are ready.";

# Stop the running container.
docker-compose stop