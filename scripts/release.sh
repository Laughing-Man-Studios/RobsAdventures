#!/bin/bash
npx prisma migrate deploy
npx prisma db seed
echo 'Getting Mail'
bash scripts/kick_off_get_mail.sh
