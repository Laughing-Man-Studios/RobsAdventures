#!/bin/bash
npx prisma migrate reset
npx prisma migrate deploy
node content/trips.js
