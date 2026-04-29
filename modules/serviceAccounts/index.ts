import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import type { OrganizationProjects } from "@/types/projects";
import type {
  OrganizationServiceAccounts,
  ServiceAccountDefinition,
} from "@/types/serviceAccounts";

export class ServiceAccountFactory {
  constructor(private readonly opts?: pulumi.ResourceOptions) {}

  createMany(
    definitions: ServiceAccountDefinition[],
    projects: OrganizationProjects,
  ): OrganizationServiceAccounts {
    return definitions.reduce<OrganizationServiceAccounts>((acc, definition) => {
      acc[definition.key] = this.create(definition, this.resolveProject(definition, projects));
      return acc;
    }, {});
  }

  private create(
    definition: ServiceAccountDefinition,
    project: pulumi.Input<string>,
  ): gcp.serviceaccount.Account {
    return new gcp.serviceaccount.Account(definition.accountId, {
      accountId: definition.accountId,
      displayName: definition.displayName,
      project,
    }, this.opts);
  }

  private resolveProject(
    definition: ServiceAccountDefinition,
    projects: OrganizationProjects,
  ): pulumi.Input<string> {
    const project = projects[definition.projectKey];
    if (!project) {
      throw new Error(`Service account project "${definition.projectKey}" must exist before "${definition.accountId}".`);
    }

    return project.projectId;
  }
}
