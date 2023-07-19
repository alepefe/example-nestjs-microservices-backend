set_hosts:
	@bash ./deployment/development/hosts.sh

dev-infra:
	@kubectl port-forward -n default pod/stackgres-0 5433:5432
