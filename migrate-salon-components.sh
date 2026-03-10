#!/bin/bash

# Salon Module Migration Helper Script
# This script helps migrate components from scattered locations to the new salon module structure

set -e

echo "🎨 Salon Module Migration Helper"
echo "=================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
SRC_DIR="src/components"
SALON_DIR="${SRC_DIR}/salon"

echo -e "${BLUE}📍 Checking source and destination paths...${NC}"

# Array of components to migrate
# Format: "source_path:destination_path:component_name"
COMPONENTS=(
  "${SRC_DIR}/Dashbord/components/Dashboard.tsx:${SALON_DIR}/features/dashboard/Dashboard.tsx:Dashboard"
  "${SRC_DIR}/staff/StaffList.tsx:${SALON_DIR}/features/staff/StaffList.tsx:StaffList"
  "${SRC_DIR}/staff/StaffPortal.tsx:${SALON_DIR}/features/staff/StaffPortal.tsx:StaffPortal"
  "${SRC_DIR}/services/Services.tsx:${SALON_DIR}/features/services/Services.tsx:Services"
  "${SRC_DIR}/bookings/Appointments.tsx:${SALON_DIR}/features/schedule/Appointments.tsx:Appointments"
  "${SRC_DIR}/forecasting/DemandForecaster.tsx:${SALON_DIR}/features/analytics/DemandForecaster.tsx:DemandForecaster"
  "${SRC_DIR}/inventory/Inventory.tsx:${SALON_DIR}/features/inventory/Inventory.tsx:Inventory"
  "${SRC_DIR}/salons/SalonProfile.tsx:${SALON_DIR}/features/profile/SalonProfile.tsx:SalonProfile"
  "${SRC_DIR}/subscriptions/SubscriptionView.tsx:${SALON_DIR}/features/subscriptions/SubscriptionView.tsx:SubscriptionView"
)

echo ""
echo -e "${YELLOW}📋 Components to migrate:${NC}"
echo ""

for i in "${!COMPONENTS[@]}"; do
  IFS=':' read -r src dst name <<< "${COMPONENTS[$i]}"
  
  if [ -f "$src" ]; then
    echo -e "${GREEN}✓${NC} $name"
    echo -e "  From: ${src}"
    echo -e "  To:   ${dst}"
  else
    echo -e "${RED}✗${NC} $name (source not found: ${src})"
  fi
  echo ""
done

echo ""
echo -e "${BLUE}📝 Migration Instructions:${NC}"
echo ""
echo "1. Review the MIGRATION_PLAN.md for detailed instructions"
echo "2. For each component:"
echo "   - Update imports from @components/Dashbord/* to @components/salon/shared/*"
echo "   - Replace SERVICES with MOCK_SERVICES"
echo "   - Replace STAFF with MOCK_STAFF"
echo ""
echo "3. After migration, update:"
echo "   - src/components/Dashbord/index.tsx (main entry point)"
echo "   - src/routes/index.tsx (route handlers)"
echo "   - src/App.tsx (if applicable)"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo ""
echo "1. Read SALON_SETUP_GUIDE.md for overall structure"
echo "2. Follow MIGRATION_PLAN.md for step-by-step instructions"
echo "3. Test each migrated component"
echo "4. Update import statements in routes and main components"
echo "5. Delete old component folders once migration is complete"
echo ""
echo -e "${GREEN}Happy migrating! 🚀${NC}"
