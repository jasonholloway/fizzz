#!/bin/bash -e

cid=$(docker run \
       -d \
       -p 3128:3128 \
       -v $PWD/squid.conf:/etc/squid/squid.conf \
       sameersbn/squid)

docker exec -it $cid tail -f /var/log/squid/access.log -f /var/log/squid/cache.log
