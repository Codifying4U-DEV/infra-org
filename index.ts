import { ORGANIZATION_CONFIG } from "@/modules/organization/config";
import { Organization } from "@/modules/organization";
import { ORGANIZATION_RESOURCE_NAME } from "@/config/catalogs";

const organization = new Organization(ORGANIZATION_RESOURCE_NAME, ORGANIZATION_CONFIG);

export const folderIds = organization.folderIds;
export const projectIds = organization.projectIds;
export const serviceAccountEmails = organization.serviceAccountEmails;
