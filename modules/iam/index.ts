import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import type { IamBinding, IamMember } from "@/types/iam";

export class IamFactory {
  constructor(private readonly opts?: pulumi.ResourceOptions) {}

  createMany(bindings: IamBinding[]): IamMember[] {
    return bindings.map((binding) => this.create(binding));
  }

  private create(binding: IamBinding): IamMember {
    if (binding.scope === "organization") {
      return new gcp.organizations.IAMMember(binding.resourceName, {
        orgId: binding.orgId,
        role: binding.role,
        member: binding.member,
      }, this.opts);
    }

    return new gcp.projects.IAMMember(binding.resourceName, {
      project: binding.project,
      role: binding.role,
      member: binding.member,
    }, this.opts);
  }
}
