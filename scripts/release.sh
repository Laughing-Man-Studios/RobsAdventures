#!/bin/bash
npx prisma migrate deploy
node content/trips.js