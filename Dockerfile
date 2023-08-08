FROM dfinity/rosetta-api AS rosetta-api

FROM ubuntu:20.04

ARG USER=rosetta
RUN useradd -m -s /bin/bash $USER

ENV DFX_VERSION=0.14.3
ENV TZ=UTC
SHELL [ "bash", "-c" ]

COPY --from=rosetta-api /home/rosetta/log_config.yml /etc/log_config.yml
COPY --from=rosetta-api /home/rosetta/ic-rosetta-api /usr/local/bin/ic-rosetta-api

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


WORKDIR /home/$USER

COPY --chown=rosetta:rosetta setup .

RUN chmod +x init.sh \
    && mkdir -p /home/$USER/.config/dfx \
    && mkdir -p /home/$USER/bin \
    && mkdir -p /home/$USER/data \
    && mv init.sh /home/$USER/bin/init.sh \
    && mv networks.json /home/$USER/.config/dfx/networks.json \
    && chown -R $USER:$USER /home/$USER \
    && chmod -R a+rw /home/$USER

USER $USER

ENV PATH="/home/$USER/bin:${PATH}"
RUN DFX_VERSION=${DFX_VERSION} sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

CMD [ "init.sh" ]