FROM dfinity/rosetta-api AS rosetta-api

FROM ubuntu:20.04

ENV DFX_VERSION=0.14.3
ENV TZ=UTC
SHELL [ "bash", "-c" ]

COPY setup .
COPY --from=rosetta-api /home/rosetta/log_config.yml /etc/log_config.yml
COPY --from=rosetta-api /home/rosetta/ic-rosetta-api /usr/local/bin/ic-rosetta-api

RUN echo "testing"
RUN chmod +x init.sh && mkdir -p /root/.config/dfx && mv networks.json /root/.config/dfx/networks.json

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    apt -yq update && \
    apt -yqq install --no-install-recommends \
    curl \
    ca-certificates \
    build-essential \
    pkg-config \
    libssl-dev \ 
    llvm-dev \
    liblmdb-dev \
    libunwind-dev jq

RUN DFX_VERSION=${DFX_VERSION} sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

CMD [ "./init.sh" ]