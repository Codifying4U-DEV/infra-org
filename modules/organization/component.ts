import * as pulumi from "@pulumi/pulumi";
import { OrganizationDirector } from "./director";
import { PulumiOrganizationBuilder } from "./builder";
import { CatalogOrganizationDefinitionFactory } from "./factory";
import { OrganizationArgs, OrganizationProduct } from "./types";
import { ORGANIZATION_COMPONENT_TYPE, validateOrganizationCatalogs } from "@/config/catalogs";

export class Organization extends pulumi.ComponentResource {
  public readonly product: OrganizationProduct;
  public readonly folderIds: OrganizationProduct["folderIds"];
  public readonly projectIds: OrganizationProduct["projectIds"];
  public readonly serviceAccountEmails: OrganizationProduct["serviceAccountEmails"];

  constructor(name: string, args: OrganizationArgs, opts?: pulumi.ComponentResourceOptions) {
    super(ORGANIZATION_COMPONENT_TYPE, name, {}, opts);

    validateOrganizationCatalogs();

    const factory = new CatalogOrganizationDefinitionFactory();
    const builder = new PulumiOrganizationBuilder(args, factory, { parent: this });
    const director = new OrganizationDirector(builder);

    this.product = director.buildOrganization();
    this.folderIds = this.product.folderIds;
    this.projectIds = this.product.projectIds;
    this.serviceAccountEmails = this.product.serviceAccountEmails;

    this.registerOutputs({
      folderIds: this.folderIds,
      projectIds: this.projectIds,
      serviceAccountEmails: this.serviceAccountEmails,
    });
  }
}
