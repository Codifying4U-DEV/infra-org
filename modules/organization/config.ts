import { BILLING_ACCOUNT, ORG_ID } from "@/lib/config";
import { GROUP_CATALOG } from "@/config/catalogs";
import { OrganizationArgs } from "./types";

export const ORGANIZATION_CONFIG: OrganizationArgs = {
  orgId: ORG_ID,
  billingAccount: BILLING_ACCOUNT,
  groups: GROUP_CATALOG,
};
