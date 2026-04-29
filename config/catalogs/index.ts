import { ORGANIZATION_CATALOG } from "./catalog";

export { ORGANIZATION_CATALOG } from "./catalog";
export { ORGANIZATION_COMPONENT_TYPE, ORGANIZATION_RESOURCE_NAME } from "./constants";
export const GROUP_CATALOG = ORGANIZATION_CATALOG.groups;
export const FOLDER_CATALOG = ORGANIZATION_CATALOG.folders;
export const PROJECT_CATALOG = ORGANIZATION_CATALOG.projects;
export const ORGANIZATION_IAM_CATALOG = ORGANIZATION_CATALOG.iam.organization;
export const PROJECT_IAM_CATALOG = ORGANIZATION_CATALOG.iam.projects;
export const SERVICE_ACCOUNT_CATALOG = ORGANIZATION_CATALOG.serviceAccounts;
export { validateOrganizationCatalogs } from "./validator";
