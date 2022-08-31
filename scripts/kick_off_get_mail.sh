#!/bin/bash

URL="${MAIL_URL:-http://localhost:3000/api/mail}"

wget -qO- $URL