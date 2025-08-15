#!/usr/bin/env bash
set -euo pipefail
IMAGE="${1:-gymtracker:1.1}"
mkdir -p reports
trivy image --no-progress "${IMAGE}" | tee reports/trivy_image.txt
echo "Resultado: reports/trivy_image.txt"
