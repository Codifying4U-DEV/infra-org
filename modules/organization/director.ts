import { OrganizationBuilder, OrganizationProduct } from "./types";

export class OrganizationDirector {
  constructor(private readonly builder: OrganizationBuilder) {}

  buildOrganization(): OrganizationProduct {
    return this.builder
      .buildFolders()
      .buildProjects()
      .buildIam()
      .buildServiceAccounts()
      .getProduct();
  }
}
