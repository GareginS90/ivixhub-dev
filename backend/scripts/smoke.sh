#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8085"
PASS="StrongPass123"

echo "== Health =="
curl -s "$BASE/actuator/health" ; echo

echo "== Public catalogs =="
curl -s "$BASE/api/public/catalog/specializations?lang=en" | head -c 200 ; echo
curl -s "$BASE/api/public/catalog/methods?lang=en" | head -c 200 ; echo

echo "== Register client and get token =="
EMAIL="smoke_client_$(date +%s)@ivixhub.am"
CLIENT_TOKEN=$(curl -s -X POST "$BASE/api/public/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}" \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')

echo "CLIENT_EMAIL=$EMAIL"
echo "CLIENT_TOKEN_PREFIX=$(echo "$CLIENT_TOKEN" | cut -c1-20)"

echo "== /api/me =="
curl -s "$BASE/api/me" -H "Authorization: Bearer $CLIENT_TOKEN" ; echo

echo "== Public psychologists =="
curl -s "$BASE/api/public/psychologists" ; echo

echo "== Slots (psychologistId=1) =="
curl -s "$BASE/api/public/psychologists/1/slots?from=2026-01-02T00:00:00Z&to=2026-01-10T00:00:00Z&type=SELF" | head -c 300 ; echo

echo "== Try to book first available slot (psychologistId=1) =="
SLOTS=$(curl -s "$BASE/api/public/psychologists/1/slots?from=2026-01-02T00:00:00Z&to=2026-01-10T00:00:00Z&type=SELF" \
  | grep -o '"startAtUtc":"[^"]*"' | cut -d'"' -f4)

NEW_BOOKING_ID=""
for START_AT in $SLOTS; do
  RESP=$(curl -s -i -X POST "$BASE/api/bookings" \
    -H "Authorization: Bearer $CLIENT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"psychologistId\": 1,
      \"startAtUtc\": \"$START_AT\",
      \"type\": \"SELF\"
    }")

  if echo "$RESP" | head -n 1 | grep -q "200"; then
    NEW_BOOKING_ID=$(echo "$RESP" | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)
    echo "BOOKED id=$NEW_BOOKING_ID at $START_AT"
    break
  fi
done

if [ -z "$NEW_BOOKING_ID" ]; then
  echo "No slot could be booked. (This is OK if all slots are taken.)"
  exit 0
fi

echo "== Create payment intent =="
curl -s -i -X POST "$BASE/api/payments/intent/$NEW_BOOKING_ID" \
  -H "Authorization: Bearer $CLIENT_TOKEN" | head -n 1

echo "== Mock pay =="
curl -s -i -X POST "$BASE/api/payments/mock/pay/$NEW_BOOKING_ID" \
  -H "Authorization: Bearer $CLIENT_TOKEN" | head -n 1

echo "== Notifications =="
curl -s "$BASE/api/notifications/my" -H "Authorization: Bearer $CLIENT_TOKEN" ; echo

echo "SMOKE OK ✅"
