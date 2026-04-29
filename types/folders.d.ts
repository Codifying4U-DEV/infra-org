import * as gcp from "@pulumi/gcp";

export type FolderKey = string;

export type RootParentKey = "organization";

export type FolderParentKey = FolderKey | RootParentKey;

export type FolderDefinition = {
  key: FolderKey;
  resourceName: string;
  displayName: string;
  parentKey: FolderParentKey;
};

export type OrganizationFolders = Partial<Record<FolderKey, gcp.organizations.Folder>>;
