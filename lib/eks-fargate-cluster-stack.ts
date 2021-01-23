import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { Vpc, SubnetType } from "@aws-cdk/aws-ec2";
import { FargateCluster, KubernetesVersion } from "@aws-cdk/aws-eks";
import { Role, AccountRootPrincipal } from "@aws-cdk/aws-iam";

import { resources } from "../src/expressjs-api";

export interface EksFargateClusterStackProps extends StackProps {
  readonly prefix: string;
  readonly stage: string;
}

export class EksFargateClusterStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: EksFargateClusterStackProps,
  ) {
    super(scope, id, props);

    /**
     * Get var from props
     */
    const { prefix, stage } = props;

    /**
     * Vpc Definition
     */
    const vpc = new Vpc(this, `${prefix}-${stage}-Vpc`, {
      maxAzs: 2,
      natGateways: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public1",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Public2",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Private1",
          subnetType: SubnetType.PRIVATE,
        },
        {
          cidrMask: 24,
          name: "Private2",
          subnetType: SubnetType.PRIVATE,
        },
      ],
    });

    /**
     * Role Definition
     */
    const clusterAdmin = new Role(this, `${prefix}-${stage}-AdminRole`, {
      roleName: `${prefix}-${stage}-AdminRole`,
      assumedBy: new AccountRootPrincipal(),
    });

    /**
     * Fargate Cluster Definition
     */
    const cluster = new FargateCluster(this, `${prefix}-${stage}-Cluster`, {
      clusterName: `${prefix}-${stage}-Cluster`,
      version: KubernetesVersion.V1_18,
      mastersRole: clusterAdmin,
      outputClusterName: true,
      outputMastersRoleArn: true,
      vpc,
    });

    /**
     * Add Resource
     */
    cluster.addManifest("Express Hello App", ...resources);
  }
}
