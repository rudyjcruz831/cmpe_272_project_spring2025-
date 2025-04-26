FROM postgres:alpine
WORKDIR /docker-entrypoint-initdb.d
COPY users.sql /docker-entrypoint-initdb.d
COPY postgresql.conf /etc/postgresql/postgresql.conf
EXPOSE 5432