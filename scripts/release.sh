#!/bin/bash
npx prisma migrate reset --force
npx prisma migrate deploy
node content/trips.js
