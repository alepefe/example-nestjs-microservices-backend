allow_k8s_contexts('minikube')
trigger_mode(TRIGGER_MODE_MANUAL)

k8s_yaml([
    'deployment/development/istio/gateway.yaml',
    'deployment/development/istio/ingress-jwt.yaml',
])

docker_build(
    'xxx-backend-user-service',
    './user-service',
    dockerfile='./user-service/Dockerfile.development',
    ignore= [
        './.vscode',
        './user-service/dist'
    ],
)

k8s_yaml([
    'deployment/development/deployments/user-service.yaml',
    'deployment/development/services/user-service.yaml',
    'deployment/development/istio/virtual-services/user-service.yaml'
])
