.PHONY: install emulators frontend test all start

# Install frontend and functions deps
install:
	cd frontend && npm install
	cd functions && npm install

# Start Firebase Emulators
emulators:
	cd functions && firebase emulators:start --only functions,firestore,auth

# Start Astro/React Frontend Dev Server
frontend:
	cd frontend && npm run dev

# Run ALL tests (lint, type, unit, e2e)
test:
	cd frontend && npm run lint && npm run typecheck && npm test && npm run test:e2e
	cd functions && npm test

# All-in-one (install, emulators, frontend in background, then test)
all: install
	@echo "Starting Firebase Emulators (keep this terminal open!)"
	@gnome-terminal -- make emulators || start cmd /k "make emulators"
	sleep 4
	@echo "Starting Frontend (keep this terminal open!)"
	@gnome-terminal -- make frontend || start cmd /k "make frontend"
	sleep 4
	@echo "Running tests (in current shell)..."
	make test
	@echo "Everything is running! Frontend: http://localhost:4321, Emulator UI: http://localhost:4000"

# For Windows users (if no Make available), see run_local.sh below