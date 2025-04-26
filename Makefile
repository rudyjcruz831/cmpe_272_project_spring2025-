up:
	docker-compose up --build -d
down:
	docker-compose down
evans:
	evans -p 50052 -r
up_pg:
	docker-compose up postgresdb

PWD = $(shell pwd)
ACCTPATH = $(PWD)/affordAbode_backend/rsa_keys_tokens

create-keypair:
	@echo "Creating an rsa 256 key pair"
	openssl genpkey -algorithm RSA -out $(ACCTPATH)/rsa_private_$(ENV).pem -pkeyopt rsa_keygen_bits:2048
	openssl rsa -in $(ACCTPATH)/rsa_private_$(ENV).pem -pubout -out $(ACCTPATH)/rsa_public_$(ENV).pem

init: 
	docker-compose up -d && \
	$(MAKE) create-keypair ENV=dev && \
	$(MAKE) create-keypair ENV=test && \
	docker-compose down

rsakeys:
	$(MAKE) create-keypair ENV=dev && \
	$(MAKE) create-keypair ENV=test && \%   