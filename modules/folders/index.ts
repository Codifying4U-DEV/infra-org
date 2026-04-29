import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import type { FolderDefinition, OrganizationFolders } from "@/types/folders";

export class OrganizationFolderFactory {
  constructor(
    private readonly orgId: string,
    private readonly opts?: pulumi.ResourceOptions,
  ) {}

  createMany(definitions: FolderDefinition[]): OrganizationFolders {
    return definitions.reduce<OrganizationFolders>((acc, definition) => {
      acc[definition.key] = this.create(definition, this.resolveParent(definition, acc));
      return acc;
    }, {});
  }

  private create(
    definition: FolderDefinition,
    parent: pulumi.Input<string>,
  ): gcp.organizations.Folder {
    return new gcp.organizations.Folder(definition.resourceName, {
      displayName: definition.displayName,
      parent,
    }, this.opts);
  }

  private resolveParent(
    definition: FolderDefinition,
    folders: OrganizationFolders,
  ): pulumi.Input<string> {
    if (definition.parentKey === "organization") {
      return `organizations/${this.orgId}`;
    }

    const parent = folders[definition.parentKey];
    if (!parent) {
      throw new Error(`Folder parent "${definition.parentKey}" must be created before "${definition.key}".`);
    }

    return parent.name;
  }
}
