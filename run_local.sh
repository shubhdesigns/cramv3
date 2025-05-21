#!/bin/bash

echo "Installing dependencies (frontend/functions)..."
(cd frontend && npm install)
(cd functions && npm install)

echo "Starting Firebase Emulators (will stay running in this terminal)..."
gnome-terminal -- bash -c "cd functions && firebase emulators:start --only functions,firestore,auth"
sleep 4

echo "Starting Astro/React Frontend (this terminal will stay open)..."
gnome-terminal -- bash -c "cd frontend && npm run dev"
sleep 4

echo "Running tests (in current shell)..."
(cd frontend && npm run lint && npm run typecheck && npm test && npm run test:e2e)
(cd functions && npm test)

echo ""
echo "All systems up! 🚀"
echo "Frontend:         http://localhost:4321"
echo "Emulator UI:      http://localhost:4000"
echo "To stop emulators/frontend: close the respective terminal windows."