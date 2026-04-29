import * as pulumi from "@pulumi/pulumi";
import { GroupKey, IamBinding } from "./iam";
import { FolderDefinition, OrganizationFolders } from "./folders";
import { OrganizationProjects, ProjectDefinition } from "./projects";
import { OrganizationServiceAccounts, ServiceAccountDefinition } from "./serviceAccounts";

export type OrganizationArgs = {
  orgId: string;
  billingAccount: pulumi.Input<string>;
  groups: Record<GroupKey, string>;
};

export type OrganizationProduct = {
  folders: OrganizationFolders;
  projects: OrganizationProjects;
  serviceAccounts: OrganizationServiceAccounts;
  folderIds: Record<string, pulumi.Output<string>>;
  projectIds: Record<string, pulumi.Output<string>>;
  serviceAccountEmails: pulumi.Output<Record<string, string>>;
};

export type OrganizationBuilder = {
  buildFolders(): OrganizationBuilder;
  buildProjects(): OrganizationBuilder;
  buildIam(): OrganizationBuilder;
  buildServiceAccounts(): OrganizationBuilder;
  getProduct(): OrganizationProduct;
};

export type OrganizationDefinitionFactory = {
  createFolderDefinitions(): FolderDefinition[];
  createProjectDefinitions(): ProjectDefinition[];
  createIamBindings(
    orgId: pulumi.Input<string>,
    projects: OrganizationProjects,
    groups: OrganizationArgs["groups"],
  ): IamBinding[];
  createServiceAccountDefinitions(): ServiceAccountDefinition[];
};

export type { FolderDefinition, FolderKey, FolderParentKey, OrganizationFolders, RootParentKey } from "./folders";
export type { BaseIamBinding, GroupKey, IamBinding, IamMember, IamRole, IamScope } from "./iam";
export type { OrganizationProjects, ProjectDefinition, ProjectKey } from "./projects";
export type {
  OrganizationServiceAccounts,
  ServiceAccountDefinition,
  ServiceAccountKey,
  ServiceAccountRoleDefinition,
} from "./serviceAccounts";
