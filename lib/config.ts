import * as pulumi from "@pulumi/pulumi";

const CONFIG_KEYS = {
  orgId: "orgId",
  billingAccount: "billingAccount",
} as const;

const pulumiConfig = new pulumi.Config();

export const ORG_ID = pulumiConfig.require(CONFIG_KEYS.orgId);
export const BILLING_ACCOUNT = pulumiConfig.require(CONFIG_KEYS.billingAccount);
