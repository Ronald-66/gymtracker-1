#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/zap
docker run --rm -v "$(pwd)"/reports/zap:/zap/wrk:rw -t owasp/zap2docker-stable zap-full-scan.py \
  -t http://host.docker.internal:3000 \
  -r zap_fullscan.html || true
echo "Reporte fullscan: reports/zap/zap_fullscan.html"
