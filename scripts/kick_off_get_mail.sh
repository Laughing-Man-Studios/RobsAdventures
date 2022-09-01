#!/bin/bash

URL="${MAIL_URL:-http://localhost:3000/api/mail}"

#curl --write-out "%{http_code}\n" $URL
echo $URL