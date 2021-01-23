export const resources = [
  {
    apiVersion: "v1",
    kind: "Service",
    metadata: { name: "hello-app" },
    spec: {
      type: "NodePort",
      ports: [{ port: 3000, nodePort: 30037 }],
      selector: { app: "hello-app" },
    },
  },
  {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: { name: "hello-app" },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: "hello-app" } },
      template: {
        metadata: {
          labels: { app: "hello-app" },
        },
        spec: {
          containers: [
            {
              name: "hello-app",
              image: "samleung/hello-app:1.0.0",
              ports: [{ containerPort: 3000 }],
            },
          ],
        },
      },
    },
  },
];
