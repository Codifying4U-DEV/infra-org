import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import type { OrganizationFolders } from "@/types/folders";
import type { OrganizationProjects, ProjectDefinition } from "@/types/projects";

export class ProjectFactory {
  constructor(
    private readonly billingAccount: pulumi.Input<string>,
    private readonly opts?: pulumi.ResourceOptions,
  ) {}

  createMany(
    definitions: ProjectDefinition[],
    folders: OrganizationFolders,
  ): OrganizationProjects {
    return definitions.reduce<OrganizationProjects>((acc, definition) => {
      acc[definition.key] = this.create(definition, this.resolveFolder(definition, folders));
      return acc;
    }, {});
  }

  private create(
    definition: ProjectDefinition,
    folderId: pulumi.Input<string>,
  ): gcp.organizations.Project {
    return new gcp.organizations.Project(definition.resourceName, {
      projectId: definition.projectId,
      name: definition.displayName,
      folderId,
      billingAccount: this.billingAccount,
      labels: definition.labels,
      deletionPolicy: definition.deletionPolicy,
    }, this.opts);
  }

  private resolveFolder(
    definition: ProjectDefinition,
    folders: OrganizationFolders,
  ): pulumi.Input<string> {
    const folder = folders[definition.folderKey];
    if (!folder) {
      throw new Error(`Project folder "${definition.folderKey}" must exist before "${definition.key}".`);
    }

    return folder.folderId;
  }
}
