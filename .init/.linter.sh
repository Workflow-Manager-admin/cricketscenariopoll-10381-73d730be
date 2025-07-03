#!/bin/bash
cd /home/kavia/workspace/code-generation/cricketscenariopoll-10381-73d730be/cricket_scenario_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

