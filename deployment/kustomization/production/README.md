### Istio
Docs: https://istio.io/latest/docs/setup/getting-started/#download
```
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm install istio-base istio/base -n istio-system -f ./charts/istio/base/values.yaml
helm install istiod istio/istiod -n istio-system -f ./charts/istio/istiod/values.yaml --wait
helm install istio-ingress istio/gateway -n istio-ingress -f ./charts/istio/gateway/values.yaml
```

### YugabyteDB
```
helm repo add yugabytedb https://charts.yugabyte.com
kubectl create ns yugabyte
helm install yugabyte yugabytedb/yugabyte --version 2.18 -n yugabyte -f ./charts/yugabyte/values.yaml
```