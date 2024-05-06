#!/usr/bin/env bash
set -Eeuo pipefail

function build() {
    pnpm run build
}

function script_usage() {
    cat << EOF

Usage: $0 <build>
EOF
}

function main() {
    if (( $# < 1 )); then
        script_usage
        exit 0
    fi

    action="${1}"

    local action="${1}"

    case "$action" in
      build)
          build
          ;;
      *)
          echo "Unknown action"
          echo
          script_usage
          exit 1
          ;;
    esac
}

main "$@"
