# Reference Index

Load references only as needed.

## Always Useful

- `level-rules.md`: live level gates and default stop points.
- `audit-rubric.md`: all check paths, pass criteria, and fix surfaces.
- `well-known-paths.md`: canonical paths and content types.

## Load By Target Level

- `tier-1-basic-web.md`: Level 0 to Level 1.
- `tier-2-bot-aware.md`: Level 1 to Level 2.
- `tier-3-agent-readable.md`: Level 2 to Level 3.
- `tier-4-agent-integrated.md`: Level 3 to Level 4.
- `tier-5-agent-native.md`: Level 4 to Level 5.

## Optional

- `commerce-track.md`: only when the user explicitly opts into commerce checks.

## Source Priority

1. Fresh `scripts/audit.sh` output.
2. `nextLevel.requirements[]` from the scan.
3. These references.
4. Templates.

If the auditor evidence differs from this documentation, follow the auditor and append the learning to `../learnings.jsonl`.
