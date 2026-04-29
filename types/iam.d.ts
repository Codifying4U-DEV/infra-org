import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

export type GroupKey = string;

export type IamScope = "organization" | "project";

export type IamRole = string;

export type BaseIamBinding = {
  resourceName: string;
  role: IamRole;
  member: string;
};

export type IamBinding =
  | (BaseIamBinding & {
      scope: "organization";
      orgId: pulumi.Input<string>;
    })
  | (BaseIamBinding & {
      scope: "project";
      project: pulumi.Input<string>;
    });

export type IamMember =
  | gcp.organizations.IAMMember
  | gcp.projects.IAMMember;
