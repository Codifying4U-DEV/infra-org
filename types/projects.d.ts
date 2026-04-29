import * as gcp from "@pulumi/gcp";
import { FolderKey } from "./folders";

export type ProjectKey = string;

export type ProjectDefinition = {
  key: ProjectKey;
  resourceName: string;
  projectId: string;
  displayName: string;
  folderKey: FolderKey;
  deletionPolicy: "DELETE" | "PREVENT" | "ABANDON";
  labels: Record<string, string>;
};

export type OrganizationProjects = Partial<Record<ProjectKey, gcp.organizations.Project>>;
