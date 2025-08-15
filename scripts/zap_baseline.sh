#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/zap
docker run --rm -v "$(pwd)"/reports/zap:/zap/wrk:rw -t owasp/zap2docker-stable zap-baseline.py \
  -t http://host.docker.internal:3000 \
  -r zap_baseline.html || true
echo "Reporte baseline: reports/zap/zap_baseline.html"
