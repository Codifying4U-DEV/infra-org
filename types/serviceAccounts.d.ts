import * as gcp from "@pulumi/gcp";
import { ProjectKey } from "./projects";

export type ServiceAccountKey = string;

export type ServiceAccountRoleDefinition = {
  projectKey: ProjectKey;
  role: string;
};

export type ServiceAccountDefinition = {
  key: ServiceAccountKey;
  accountId: string;
  displayName: string;
  projectKey: ProjectKey;
  roles: ServiceAccountRoleDefinition[];
};

export type OrganizationServiceAccounts = Partial<Record<ServiceAccountKey, gcp.serviceaccount.Account>>;
