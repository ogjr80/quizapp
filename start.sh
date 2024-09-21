#!/bin/sh

# Run Prisma migrations with --accept-data-loss flag
npx prisma db push --accept-data-loss

# Start the application
node server.js
