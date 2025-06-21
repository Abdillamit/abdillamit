#!/bin/bash

# setup-environment.sh - Script to set up environment-specific configurations

set -e

ENVIRONMENT=${1:-local}
VALID_ENVIRONMENTS=("local" "beta" "prod")

# Function to check if environment is valid
is_valid_environment() {
    local env=$1
    for valid_env in "${VALID_ENVIRONMENTS[@]}"; do
        if [[ "$env" == "$valid_env" ]]; then
            return 0
        fi
    done
    return 1
}

# Validate environment parameter
if ! is_valid_environment "$ENVIRONMENT"; then
    echo "❌ Error: Invalid environment '$ENVIRONMENT'"
    echo "Valid environments: ${VALID_ENVIRONMENTS[*]}"
    exit 1
fi

echo "🔧 Setting up environment: $ENVIRONMENT"

# Set environment variables based on the environment
case $ENVIRONMENT in
    "local")
        export GATSBY_ENVIRONMENT=local
        export NODE_ENV=development
        export GATSBY_API_URL=http://localhost:3001
        export GATSBY_ENABLE_ANALYTICS=false
        export GATSBY_ENABLE_ERROR_REPORTING=false
        ;;
    "beta")
        export GATSBY_ENVIRONMENT=beta
        export NODE_ENV=production
        export GATSBY_API_URL=https://api-beta.yourdomain.com
        export GATSBY_ENABLE_ANALYTICS=true
        export GATSBY_ENABLE_ERROR_REPORTING=true
        ;;
    "prod")
        export GATSBY_ENVIRONMENT=prod
        export NODE_ENV=production
        export GATSBY_API_URL=https://api.yourdomain.com
        export GATSBY_ENABLE_ANALYTICS=true
        export GATSBY_ENABLE_ERROR_REPORTING=true
        ;;
esac

echo "✅ Environment variables set:"
echo "   GATSBY_ENVIRONMENT: $GATSBY_ENVIRONMENT"
echo "   NODE_ENV: $NODE_ENV"
echo "   GATSBY_API_URL: $GATSBY_API_URL"
echo "   GATSBY_ENABLE_ANALYTICS: $GATSBY_ENABLE_ANALYTICS"
echo "   GATSBY_ENABLE_ERROR_REPORTING: $GATSBY_ENABLE_ERROR_REPORTING"

# Create or update .env file for the environment
ENV_FILE=".env.$ENVIRONMENT"
cat > "$ENV_FILE" << EOF
# Environment configuration for $ENVIRONMENT
GATSBY_ENVIRONMENT=$GATSBY_ENVIRONMENT
NODE_ENV=$NODE_ENV
GATSBY_API_URL=$GATSBY_API_URL
GATSBY_ENABLE_ANALYTICS=$GATSBY_ENABLE_ANALYTICS
GATSBY_ENABLE_ERROR_REPORTING=$GATSBY_ENABLE_ERROR_REPORTING
EOF

echo "📝 Created/updated $ENV_FILE"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🎉 Environment setup complete for $ENVIRONMENT!"
echo ""
echo "Next steps:"
echo "  - To start development: npm run develop:$ENVIRONMENT"
echo "  - To build: npm run build:$ENVIRONMENT"
echo "  - To deploy: npm run deploy:$ENVIRONMENT"

