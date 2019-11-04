SHELL:=/bin/bash

# host
# These commands are meant to run on the host machine
ssh:
	docker-compose run --rm service /bin/bash

ssh-test:
	docker-compose -f docker-compose.test.yml run --rm service /bin/bash

ssh-postgres:
	docker-compose run --rm postgres /bin/bash

ssh-postgres-test:
	docker-compose -f docker-compose.test.yml run --rm postgres-test /bin/bash

start:
	docker-compose up

halt:
	docker-compose stop

halt-test:
	docker-compose -f docker-compose.test.yml stop

test:
	docker-compose -f docker-compose.test.yml run --rm service make service-test

migrate:
	docker-compose run --rm service make service-db-migrate

clean:
	docker-compose down --remove-orphans && docker volume ls -qf dangling=true | xargs --no-run-if-empty docker volume rm

clean-test:
	docker-compose -f docker-compose.test.yml down --remove-orphans && docker volume ls -qf dangling=true | xargs --no-run-if-empty docker volume rm

rm:
	docker ps -qa | xargs --no-run-if-empty docker rm

rebuild:
	docker-compose build

rebuild-test:
	docker-compose -f docker-compose.test.yml build

# service
# The following commands are meant to run inside the docker service container
service-start:
	yarn start

service-test:
	yarn test:nocheck; test $${PIPESTATUS[0]} -eq 0

service-db-drop:
	yarn db drop

service-db-migrate:
	yarn db migrate

service-db-migrateDown:
	yarn db migrate-down

service-db-import:
	yarn db import

service-db-dropMigrateAndImport:
	yarn db drop-migrate-and-import

service-db-setUserPassword:
	yarn db set-user-password


# create-aaa-backend connected cli commands
# Build docker image and Copy node_modules and build to the working directory
create-aaa-backend-docker-setup: 
	docker rm aaa_backend_demo_container >> /dev/null 2>&1 || true
	docker rmi -f allaboutapps/aaa_backend_demo_image >> /dev/null 2>&1 || true
	docker build -t="allaboutapps/aaa_backend_demo_image" .
	docker create --name aaa_backend_demo_container allaboutapps/aaa_backend_demo_image
	docker cp aaa_backend_demo_container:/app/node_modules .
	docker cp aaa_backend_demo_container:/app/build .
