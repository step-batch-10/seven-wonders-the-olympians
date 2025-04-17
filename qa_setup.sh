#!/bin/bash
cp githooks/* .git/hooks

echo "Setting up local QA environment..."

deno install -gArf jsr:@deno/deployctl

cat > deno.qa.json <<EOF
{
  "tasks": {
    "deploy:qa": "deployctl deploy --project=seven-wonders-qa --entrypoint=main.ts --root=.",
    "deploy:prod": "deployctl deploy --project=seven-wonders-prod --entrypoint=main.ts --root=."
  }
}
EOF

echo "deno.qa.json" >> .gitignore