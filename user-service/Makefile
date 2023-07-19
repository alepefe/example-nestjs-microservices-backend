image:
	@[ "${t}" ] && echo "t: $t" || ( echo "t is not set"; exit 1 )
	@docker build -t registry.shinobidev.com/xxx-backend-user-service:$(t) .
	@docker push registry.shinobidev.com/xxx-backend-user-service:$(t)