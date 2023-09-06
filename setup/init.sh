#!/usr/bin/env bash

set -Eexuo pipefail

# 0. Create new identity for the ledger funds.
cat <<EOF > /tmp/ident-1.pem
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEICJxApEbuZznKFpV+VKACRK30i6+7u5Z13/DOl18cIC+oAcGBSuBBAAK
oUQDQgAEPas6Iag4TUx+Uop+3NhE6s3FlayFtbwdhRVjvOar0kPTfE/N8N6btRnd
74ly5xXEBNSXiENyxhEuzOZrIWMCNQ==
-----END EC PRIVATE KEY-----
EOF

echo $PATH
ls -la /tmp
ls -la /home/rosetta/bin

# 1. Import the identity with dfx.
dfx identity import --force --storage-mode plaintext ident-1 /tmp/ident-1.pem
# 2. Start the replica and icx-proxy.
dfx start --clean --background
# 3. Install the NNS (includes the ledger canister).
dfx nns install
# 4. Give some ICP to the e2e address.
dfx --identity ident-1 ledger transfer --icp 50 --memo 1 b9a13d974ee9db036d5abc5b66ace23e513cb5676f3996626c7717c339a3ee87
# 5. Start up the Rosetta API.
if [ -f /data/db.sqlite ]; then
    rm -r /data/db.sqlite
fi

ic-rosetta-api -l /etc/log_config.yml --store-location /home/rosetta/data --port 9000 --ic-url "http://0.0.0.0:10000"
