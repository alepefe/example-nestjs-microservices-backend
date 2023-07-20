# Example microservices backend
![Work in Progress](https://img.shields.io/badge/Work%20in%20Progress-yellow.svg?style=flat-square)

This repo does not include UNIT, INTEGRATION OR e2e tests.
```
kubectl create namespace istio-system
kubectl create namespace istio-ingress
```

## Helm deployments
### Istio
Docs: https://istio.io/latest/docs/setup/getting-started/#download
```
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm install istio-base istio/base -n istio-system
helm install istiod istio/istiod -n istio-system --wait
helm install istio-ingress istio/gateway -n istio-ingress
```
### Cert-manager
```
helm repo add jetstack https://charts.jetstack.io
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.crds.yaml -n cert-manager
helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --version v1.12.0 -f deployment/kustomization/production/charts/cert-manager/values.yaml
```
### YugabyteDB (Postgresql and Cassandra)
```
helm repo add yugabytedb https://charts.yugabyte.com
kubectl create ns yugabyte
helm install yugabyte yugabytedb/yugabyte -f deployment/kustomization/production/charts/yugabyte/values.yaml -n yugabyte
```

### Amazon EKS
```
aws eks update-kubeconfig --name XXXX --region eu-west-3 --kubeconfig ~/.kube/XXXX-eu --profile XXXX-eu
export KUBECONFIG=~/.kube/XXXX-eu
kubectl version --short
```
