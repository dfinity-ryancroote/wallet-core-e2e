#/usr/bin/env bash

get_status() {
    curl -s --location 'http://localhost:9000/network/status' \
            --header 'Content-Type: application/json' \
            --data '{ "network_identifier": { "blockchain": "Internet Computer", "network": "00000000000000020101" }, "metadata": {} }' |
    jq ".sync_status.current_index"
    if [ $? -eq 5 ]; then
        return 1 
    else
        return 0
    fi
}

stop() {
    docker-compose stop
    exit $1
}

# 0. Start up the replica and Rosetta API.
docker-compose up --build --force-recreate -d

# 1. Wait until the rosetta API is ready.
max_attempts=1000;
until [ $(get_status) ]; do
    max_attempts=$((max_attempts-1));
    if [ $max_attempts -eq 0 ]; then
        echo "Failed to start up the replica and icx-proxy.";
        stop 1;
    fi
    echo "Waiting for the replica and Rosetta API to start up...";
    sleep 10;
done

echo "Replica and Rosetta API are ready.";

# 2. Environment has been set up. Run the actual tests.
npm run e2e

# 3. Stop the running container.
stop 0