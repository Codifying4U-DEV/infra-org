import * as pulumi from "@pulumi/pulumi";
import type { FolderDefinition } from "@/types/folders";
import type { IamBinding } from "@/types/iam";
import type { OrganizationProjects, ProjectDefinition, ProjectKey } from "@/types/projects";
import type { ServiceAccountDefinition } from "@/types/serviceAccounts";
import type {
  OrganizationArgs,
  OrganizationDefinitionFactory,
} from "@/types/organization";
import {
  FOLDER_CATALOG,
  ORGANIZATION_IAM_CATALOG,
  PROJECT_CATALOG,
  PROJECT_IAM_CATALOG,
  SERVICE_ACCOUNT_CATALOG,
} from "@/config/catalogs";

export class CatalogOrganizationDefinitionFactory implements OrganizationDefinitionFactory {
  createFolderDefinitions(): FolderDefinition[] {
    return FOLDER_CATALOG.map((folder) => ({
      key: folder.key,
      resourceName: folder.resourceName,
      displayName: folder.displayName,
      parentKey: folder.parent,
    }));
  }

  createProjectDefinitions(): ProjectDefinition[] {
    return PROJECT_CATALOG.map((project) => ({
      key: project.key,
      resourceName: project.resourceName,
      projectId: project.id,
      displayName: project.id,
      folderKey: project.folder,
      labels: project.labels,
    }));
  }

  createIamBindings(
    orgId: pulumi.Input<string>,
    builtProjects: OrganizationProjects,
    groups: OrganizationArgs["groups"],
  ): IamBinding[] {
    return [
      ...this.createOrganizationIamBindings(orgId, groups),
      ...this.createProjectIamBindings(builtProjects, groups),
    ];
  }

  private createOrganizationIamBindings(
    orgId: pulumi.Input<string>,
    groups: OrganizationArgs["groups"],
  ): IamBinding[] {
    return ORGANIZATION_IAM_CATALOG.map((binding) => ({
      scope: "organization",
      resourceName: binding.resourceName,
      orgId,
      role: binding.role,
      member: groups[binding.group],
    }));
  }

  private createProjectIamBindings(
    builtProjects: OrganizationProjects,
    groups: OrganizationArgs["groups"],
  ): IamBinding[] {
    return PROJECT_IAM_CATALOG.flatMap((binding) =>
      binding.projectKeys.map((projectKey) => ({
        scope: "project",
        resourceName: `${this.requireProjectCatalogEntry(projectKey).resourceName}-${binding.suffix}`,
        project: this.requireProject(builtProjects, projectKey).projectId,
        role: binding.role,
        member: groups[binding.group],
      })),
    );
  }

  private requireProject(
    builtProjects: OrganizationProjects,
    projectKey: ProjectKey,
  ) {
    const project = builtProjects[projectKey];
    if (!project) {
      throw new Error(`Project "${projectKey}" must be built before creating IAM bindings.`);
    }

    return project;
  }

  private requireProjectCatalogEntry(projectKey: ProjectKey) {
    const project = PROJECT_CATALOG.find((candidate) => candidate.key === projectKey);
    if (!project) {
      throw new Error(`Project catalog entry "${projectKey}" must exist before creating IAM bindings.`);
    }

    return project;
  }

  createServiceAccountDefinitions(): ServiceAccountDefinition[] {
    return SERVICE_ACCOUNT_CATALOG.map((account) => ({
      key: account.key,
      accountId: account.accountId,
      displayName: account.displayName,
      projectKey: account.project,
      roles: account.roles.map((role) => ({
        projectKey: role.project,
        role: role.role,
      })),
    }));
  }
}
