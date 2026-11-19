# Evidencias

Capturas del segundo examen parcial (COM610) — Valda Plaza Camila Monserrat.

Cada captura incluye una explicación breve de lo que se hizo y lo que demuestra. Las contraseñas y la IP del equipo local están tapadas con un recuadro negro ("OCULTO").

**URL pública de la API:** http://52.200.202.166 · Volver al [README principal](../README.md)

## Repositorio

**00-01** — Se creó el repositorio **público** `com610-2do-parcial` en GitHub, para que el docente pueda abrirlo sin solicitar permisos.

![00-01](00-01-repo-github-publico-creado.png)

**00-02** — Se subió la estructura inicial: `README.md`, `.gitignore` y `.env.example`.

![00-02](00-02-repo-estructura-inicial.png)

**00-03** — Se agregaron `*.pem` y `*.key` al `.gitignore` (que ya excluía `.env`), para que ninguna clave ni contraseña llegue al repositorio. Luego se ejecutaron `git add`, `git commit` y `git push`.

![00-03](00-03-gitignore-y-push-inicial.png)

**00-04** — El `.env.example` solo contiene valores de ejemplo: indica qué variables necesita la API sin publicar datos reales.

![00-04](00-04-env-example-valores-ficticios.png)

## Ejercicio 1 — API REST en EC2 con RDS

### 1. EC2, RDS y grupos de seguridad (15 pts)

**ej1-01** — Se creó el par de claves `CMVP-key` (RSA, formato `.pem`) para la conexión SSH a la EC2.

![ej1-01](ej1-01-par-claves-crear.png)

**ej1-02** — El par de claves quedó creado. El archivo `.pem` se guardó solo en el equipo local, fuera del repositorio.

![ej1-02](ej1-02-par-claves-creado.png)

**ej1-03** — Se creó el grupo de seguridad `CMVP-ec2-sg` en la VPC predeterminada `vpc-0e74f945b159d53ec`, la misma donde luego se creó la RDS.

![ej1-03](ej1-03-sg-ec2-crear-vpc.png)

**ej1-04** — Se definieron dos reglas de entrada: **SSH 22** solo desde la **IP del equipo local** (`/32`), para que nadie más pueda administrar el servidor, y **HTTP 80** desde `0.0.0.0/0`, para que la API sea pública. No se abrieron los puertos 3000 ni 3306.

![ej1-04](ej1-04-sg-ec2-reglas-22-mi-ip-80-publico.png)

**ej1-05** — El grupo quedó creado con sus 2 reglas de entrada.

![ej1-05](ej1-05-sg-ec2-creado.png)

**ej1-06** — Se creó un grupo **separado** para la base de datos, `CMVP-rds-sg`, en la misma VPC.

![ej1-06](ej1-06-sg-rds-crear-vpc.png)

**ej1-07** — Su única regla permite **MySQL 3306** solo cuando el origen es el grupo de la EC2 (`sg-0b24bdf2736ade74f`). Se usa el grupo y no una IP: así solo las instancias con `CMVP-ec2-sg` pueden conectarse a la base.

![ej1-07](ej1-07-sg-rds-regla-3306-desde-sg-ec2.png)

**ej1-08** — El grupo de RDS quedó creado con esa única regla de entrada.

![ej1-08](ej1-08-sg-rds-creado.png)

**ej1-09** — Se lanzó la instancia `CMVP-ec2-libros` con **Ubuntu Server 24.04 LTS**.

![ej1-09](ej1-09-ec2-lanzar-nombre-ubuntu.png)

**ej1-10** — Se eligió el tipo **t3.micro**, apto para la capa gratuita.

![ej1-10](ej1-10-ec2-tipo-t3-micro.png)

**ej1-11** — Se asignaron el par de claves `CMVP-key`, la VPC predeterminada y una IP pública automática.

![ej1-11](ej1-11-ec2-par-claves-y-red.png)

**ej1-12** — Se usó el grupo existente `CMVP-ec2-sg` y un disco gp3 de **16 GiB**, con espacio para Docker en el ejercicio 2.

![ej1-12](ej1-12-ec2-sg-y-almacenamiento-16gb.png)

**ej1-13** — La instancia quedó *En ejecución*. Su ID de VPC es el mismo de los grupos de seguridad.

![ej1-13](ej1-13-ec2-instancia-en-ejecucion.png)

**ej1-14** — Se asignó una **Elastic IP** (`CMVP-eip`, 52.200.202.166). La IP normal cambia al reiniciar la instancia; esta no, por lo que la URL de la API se mantiene durante la revisión.

![ej1-14](ej1-14-elastic-ip-asignada.png)

**ej1-15** — Se asoció la Elastic IP a la instancia `CMVP-ec2-libros`.

![ej1-15](ej1-15-elastic-ip-asociar-instancia.png)

**ej1-16** — Se eligió la IP privada de la instancia para la asociación.

![ej1-16](ej1-16-elastic-ip-ip-privada.png)

**ej1-17** — AWS confirma que la Elastic IP quedó asociada.

![ej1-17](ej1-17-elastic-ip-asociada.png)

**ej1-18** — La lista de instancias muestra `CMVP-ec2-libros` en ejecución, en us-east-1c.

![ej1-18](ej1-18-ec2-lista-instancias.png)

**ej1-19** — El detalle de la instancia muestra la Elastic IP `52.200.202.166 (CMVP-eip)` y la VPC.

![ej1-19](ej1-19-ec2-detalle-elastic-ip-y-vpc.png)

**ej1-20** — Se estableció la conexión desde el equipo local con `ssh -i "CMVP-key.pem" ubuntu@52.200.202.166`. Funciona porque la regla 22 permite esa IP.

![ej1-20](ej1-20-ssh-conexion-desde-pc.png)

**ej1-21** — Dentro de la EC2, `hostname` y `cat /etc/os-release` confirman que la sesión está en el servidor y que el sistema es Ubuntu 24.04.5.

![ej1-21](ej1-21-ssh-hostname-y-ubuntu.png)

**ej1-22** — Se actualizó la lista de paquetes con `sudo apt update` antes de instalar software.

![ej1-22](ej1-22-ec2-apt-update.png)

**ej1-23** — Se creó la base de datos en RDS con motor **MySQL** y **configuración completa**, para definir manualmente la red y la seguridad.

![ej1-23](ej1-23-rds-mysql-configuracion-completa.png)

**ej1-24** — Se nombró `cmvp-rds-libros`, con usuario maestro `admin` y contraseña autoadministrada (no visible en la captura).

![ej1-24](ej1-24-rds-identificador-y-credenciales.png)

**ej1-25** — Se eligió la clase **db.t3.micro**, de la capa gratuita.

![ej1-25](ej1-25-rds-clase-db-t3-micro.png)

**ej1-26** — En conectividad se eligió la **misma VPC** que la EC2 y **Acceso público: No**: la base no tiene IP pública y solo es accesible desde dentro de la VPC.

![ej1-26](ej1-26-rds-misma-vpc-sin-acceso-publico.png)

**ej1-27** — Se asignó solo el grupo `CMVP-rds-sg` (se quitó el `default`).

![ej1-27](ej1-27-rds-sg-cmvp-rds-sg.png)

**ej1-28** — Se definió `db_libros` como nombre de la base de datos inicial.

![ej1-28](ej1-28-rds-base-inicial-db-libros.png)

**ej1-30** — La RDS quedó en estado **Disponible**.

![ej1-30](ej1-30-rds-disponible.png)

**ej1-30b** — Con la RDS ya creada, su regla de entrada muestra como origen `sg-0b24bdf2736ade74f`, el grupo de la EC2.

![ej1-30b](ej1-30b-rds-regla-entrada-desde-sg-ec2.png)

### 2. Modelo SQL, conexión privada y persistencia en RDS (10 pts)

**ej1-29** — En la EC2 se instaló el cliente de base de datos con `sudo apt install -y mariadb-client`.

![ej1-29](ej1-29-ec2-instalar-mariadb-client.png)

**ej1-31** — Se descargó el certificado de RDS (`global-bundle.pem`) y se estableció la conexión desde la EC2 al endpoint de RDS con `mariadb -h ... --ssl-verify-server-cert`. La conexión es privada y cifrada, y ya aparece `db_libros`.

![ej1-31](ej1-31-conexion-ec2-rds-ssl.png)

**ej1-32** — Se escribió el archivo `db.sql`, que crea la base y la tabla, y se subió al repositorio.

![ej1-32](ej1-32-db-sql-commit-y-push.png)

**ej1-33** — Se ejecutó el contenido de `db.sql` en RDS: `USE db_libros` y `CREATE TABLE libros`.

![ej1-33](ej1-33-crear-tabla-libros.png)

**ej1-34** — `DESCRIBE libros` confirma las 4 columnas: `id` (autoincremental), `titulo`, `autor` y `anio_publicacion`.

![ej1-34](ej1-34-describe-tabla-libros.png)

**ej1-35** — Se creó el usuario `usr_libros` para la API, de modo que la aplicación no use el usuario `admin`.

![ej1-35](ej1-35-crear-usuario-api.png)

**ej1-36** — Tras un error de contraseña en la prueba, se redefinió con `ALTER USER` y `FLUSH PRIVILEGES`.

![ej1-36](ej1-36-cambiar-contrasena-usuario-api.png)

**ej1-37** — Se otorgaron permisos con `GRANT` y se revisaron con `SHOW GRANTS`: el usuario solo tiene acceso a `db_libros`, no a todo el servidor.

![ej1-37](ej1-37-permisos-usuario-api.png)

**ej1-56** — Después de las pruebas CRUD, la consulta `SELECT * FROM libros` en RDS muestra el libro 1 con el título actualizado y sin el libro 2. Esto demuestra que los datos se guardan en RDS y no en memoria.

![ej1-56](ej1-56-persistencia-rds-select.png)

### 3. Endpoints CRUD, respuestas HTTP y validación (15 pts)

**ej1-38** — Se creó el proyecto con `npm init -y` y se instalaron `express` (servidor), `mysql2` (conexión a MySQL) y `dotenv` (lectura del `.env`).

![ej1-38](ej1-38-npm-init-y-dependencias.png)

**ej1-39** — Se instalaron como dependencias de desarrollo `jest` y `supertest` (pruebas) y `eslint` (revisión de código).

![ej1-39](ej1-39-npm-dependencias-desarrollo.png)

**ej1-40** — `npm list --depth=0` muestra todas las dependencias instaladas.

![ej1-40](ej1-40-npm-list.png)

**ej1-41** — Al ejecutar `npm test` pasan las **8 pruebas** sin RDS, porque la capa de datos se simula con `jest.mock`.

![ej1-41](ej1-41-npm-test-8-pruebas.png)

**ej1-42** — Se subió el código de la API (`src/`, `server.js`, `tests/`, `package.json` y `package-lock.json`) con `git add`, `commit` y `push`.

![ej1-42](ej1-42-commit-y-push-api.png)

**ej1-43** — En la EC2 se agregó el repositorio de Node.js 20 y se instalaron `nodejs`, `git` y `nginx`.

![ej1-43](ej1-43-ec2-instalar-node-git-nginx.png)

**ej1-44** — El `.env` se creó **solo en la EC2**, con el endpoint de RDS y el usuario `usr_libros` (contraseña oculta). Este archivo no se sube a GitHub.

![ej1-44](ej1-44-ec2-env-configurado.png)

**ej1-45** — Se clonó el repositorio, se instalaron las dependencias de producción con `npm ci --omit=dev` y se protegió el `.env` con `chmod 600`.

![ej1-45](ej1-45-ec2-clonar-repo-npm-ci.png)

**ej1-47** — Se instaló **PM2** y se arrancó la API con `pm2 start server.js --name api-libros`, para que se ejecute en segundo plano.

![ej1-47](ej1-47-pm2-instalar-y-arrancar.png)

**ej1-48** — Prueba dentro de la EC2: `/health` responde ok y `/libros` devuelve `[]`, lo que confirma la conexión con RDS. Con `pm2 save` y `pm2 startup` la API vuelve a arrancar sola si la EC2 se reinicia.

![ej1-48](ej1-48-pm2-health-libros-startup.png)

**ej1-46** — `pm2 list` muestra `api-libros` en estado **online**.

![ej1-46](ej1-46-pm2-api-online.png)

### 4. Publicación con Nginx y verificación externa (10 pts)

**ej1-49** — Se configuró Nginx como **proxy inverso**: recibe en el puerto 80 y reenvía a `127.0.0.1:3000`, donde escucha la API. Así el puerto 3000 nunca se expone.

![ej1-49](ej1-49-nginx-proxy-config.png)

**ej1-50** — Se activó el sitio con `ln -s`, se quitó el sitio por defecto, se verificó la sintaxis con `nginx -t` y se recargó Nginx.

![ej1-50](ej1-50-nginx-test-y-reload.png)

**ej1-51** — Desde el navegador del equipo local, `http://52.200.202.166/health` responde `status: ok`.

![ej1-51](ej1-51-navegador-health.png)

**ej1-52** — **Crear:** desde el equipo local se enviaron dos `POST /libros` con curl; cada uno respondió **201 Created** con el libro y su `id`. La cabecera `Server: nginx` confirma que la petición pasó por Nginx.

![ej1-52](ej1-52-crud-post-crear.png)

**ej1-53** — **Consultar:** `GET /libros` respondió **200** con los dos libros. **Actualizar:** `PUT /libros/1` respondió **200** con el título nuevo.

![ej1-53](ej1-53-crud-get-y-put.png)

**ej1-54** — **Eliminar:** `DELETE /libros/2` respondió **200**. La consulta posterior `GET /libros/2` respondió **404**, porque el libro ya no existe.

![ej1-54](ej1-54-crud-delete-404-y-400.png)

**ej1-55** — Se enviaron datos inválidos (título vacío y año "mil") y la API respondió **400** con la lista de errores.

![ej1-55](ej1-55-validacion-400.png)

**ej1-59** — `PUT` y `DELETE` sobre un id inexistente (999) responden **404**. Además, `curl` al puerto 3000 termina en *timeout*: ese puerto no está abierto a Internet.

![ej1-59](ej1-59-put-delete-404-y-puerto-3000-cerrado.png)

**ej1-57** — En el navegador, `/libros` muestra el libro guardado en RDS, igual que el `SELECT`.

![ej1-57](ej1-57-navegador-libros.png)

**ej1-58** — La página raíz `/` lista todos los endpoints de la API.

![ej1-58](ej1-58-navegador-raiz-endpoints.png)
