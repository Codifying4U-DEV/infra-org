import * as pulumi from "@pulumi/pulumi";
import { OrganizationFolderFactory } from "@/modules/folders";
import { IamFactory } from "@/modules/iam";
import { ProjectFactory } from "@/modules/projects";
import { ServiceAccountFactory } from "@/modules/serviceAccounts";
import type { OrganizationFolders } from "@/types/folders";
import type { OrganizationProjects } from "@/types/projects";
import type {
  OrganizationArgs,
  OrganizationBuilder,
  OrganizationDefinitionFactory,
  OrganizationProduct,
} from "@/types/organization";

export class PulumiOrganizationBuilder implements OrganizationBuilder {
  private folders?: OrganizationFolders;
  private projects?: OrganizationProjects;
  private serviceAccounts?: OrganizationProduct["serviceAccounts"];
  private readonly folderFactory: OrganizationFolderFactory;
  private readonly iamFactory: IamFactory;
  private readonly projectFactory: ProjectFactory;
  private readonly serviceAccountFactory: ServiceAccountFactory;

  constructor(
    private readonly args: OrganizationArgs,
    private readonly factory: OrganizationDefinitionFactory,
    private readonly opts?: pulumi.ResourceOptions,
  ) {
    this.folderFactory = new OrganizationFolderFactory(args.orgId, opts);
    this.iamFactory = new IamFactory(opts);
    this.projectFactory = new ProjectFactory(args.billingAccount, opts);
    this.serviceAccountFactory = new ServiceAccountFactory(opts);
  }

  buildFolders(): this {
    this.folders = this.folderFactory.createMany(this.factory.createFolderDefinitions());
    return this;
  }

  buildProjects(): this {
    this.projects = this.projectFactory.createMany(
      this.factory.createProjectDefinitions(),
      this.requireFolders(),
    );

    return this;
  }

  buildIam(): this {
    this.iamFactory.createMany(this.factory.createIamBindings(
      this.args.orgId,
      this.requireProjects(),
      this.args.groups,
    ));

    return this;
  }

  buildServiceAccounts(): this {
    this.serviceAccounts = this.serviceAccountFactory.createMany(
      this.factory.createServiceAccountDefinitions(),
      this.requireProjects(),
    );

    return this;
  }

  getProduct(): OrganizationProduct {
    const folders = this.requireFolders();
    const builtProjects = this.requireProjects();
    const builtServiceAccounts = this.requireServiceAccounts();

    return {
      folders,
      projects: builtProjects,
      serviceAccounts: builtServiceAccounts,
      folderIds: this.mapOutputs(folders, (folder) => folder.folderId),
      projectIds: this.mapOutputs(builtProjects, (project) => project.projectId),
      serviceAccountEmails: pulumi.all(
        this.mapOutputs(builtServiceAccounts, (serviceAccount) => serviceAccount.email),
      ),
    };
  }

  private requireFolders(): OrganizationFolders {
    if (!this.folders) {
      throw new Error("Folders must be built before this step.");
    }

    return this.folders;
  }

  private requireProjects(): OrganizationProjects {
    if (!this.projects) {
      throw new Error("Projects must be built before this step.");
    }

    return this.projects;
  }

  private requireServiceAccounts(): OrganizationProduct["serviceAccounts"] {
    if (!this.serviceAccounts) {
      throw new Error("Service accounts must be built before this step.");
    }

    return this.serviceAccounts;
  }

  private mapOutputs<T>(
    resources: Partial<Record<string, T>>,
    selector: (resource: T) => pulumi.Output<string>,
  ): Record<string, pulumi.Output<string>> {
    return Object.fromEntries(
      Object.entries(resources)
        .filter((entry): entry is [string, T] => entry[1] !== undefined)
        .map(([key, resource]) => [key, selector(resource)]),
    );
  }
}
