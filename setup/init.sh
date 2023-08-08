#!/usr/bin/env bash

# 0. Create new identity for the ledger funds.
cat <<EOF >ident-1.pem
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEICJxApEbuZznKFpV+VKACRK30i6+7u5Z13/DOl18cIC+oAcGBSuBBAAK
oUQDQgAEPas6Iag4TUx+Uop+3NhE6s3FlayFtbwdhRVjvOar0kPTfE/N8N6btRnd
74ly5xXEBNSXiENyxhEuzOZrIWMCNQ==
-----END EC PRIVATE KEY-----
EOF
# 1. Import the identity with dfx.
dfx identity import --force --storage-mode plaintext ident-1 ident-1.pem
# 2. Start the replica and icx-proxy.
dfx start --clean --background
# 3. Install the NNS (includes the ledger canister).
dfx nns install
# 4. Start up the Rosetta API.
rm -r /data
/usr/local/bin/ic-rosetta-api -l /etc/log_config.yml --store-location /data --port 9000 --ic-url "http://0.0.0.0:10000"