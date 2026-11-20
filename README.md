# API REST de libros en EC2 con RDS y CI/CD

**Segundo examen parcial: Trabajando en la Nube (COM610)**

- **Estudiante:** Valda Plaza Camila Monserrat
- **Carrera:** Ingeniería de Sistemas
- **Docente:** Ing. Marcelo Quispe Ortega
- **Universidad:** Universidad Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca
- **Semestre:** 2/2026

API para gestionar un catálogo de libros. Se ejecuta en **Amazon EC2**, guarda los datos en **Amazon RDS for MySQL**, se publica con **Nginx** en el puerto 80 y se prueba y despliega automáticamente con **GitHub Actions**.

📄 **Informe completo, con carátula, cada paso y cada comando explicado:** [INFORME.md](INFORME.md)

## URL pública de la API

| Ruta | URL |
|---|---|
| Inicio | http://52.200.202.166 |
| Estado del servicio | http://52.200.202.166/health |
| Lista de libros | http://52.200.202.166/libros |

La IP es una Elastic IP, por lo que no cambia aunque la instancia se reinicie.

## Ejecuciones de GitHub Actions

| Workflow | Resultado | Enlace |
|---|---|---|
| CI | Exitoso | https://github.com/CamilaMonserratValdaPlaza26/com610-2do-parcial/actions/runs/44635262211 |
| CD, primer despliegue | Exitoso | https://github.com/CamilaMonserratValdaPlaza26/com610-2do-parcial/actions/runs/44641776176 |
| CD, versión 2.0.0 | Exitoso | https://github.com/CamilaMonserratValdaPlaza26/com610-2do-parcial/actions/runs/44644853092 |
| CD, versión con error | Falló y conservó la versión anterior | https://github.com/CamilaMonserratValdaPlaza26/com610-2do-parcial/actions/runs/44647195460 |
| CD, después del revert | Exitoso | https://github.com/CamilaMonserratValdaPlaza26/com610-2do-parcial/actions/runs/44647649574 |
| CI del pull request #1 | Falló por una prueba rota; no hubo CD | https://github.com/CamilaMonserratValdaPlaza26/com610-2do-parcial/actions/runs/44648413222 |

## Contenido del repositorio

| Archivo o carpeta | Para qué sirve |
|---|---|
| server.js y src/ | Código de la API con Node.js y Express. |
| db.sql | Crea la base db_libros y la tabla libros. |
| tests/libros.test.js | Pruebas con Jest y Supertest, sin RDS. |
| package.json y package-lock.json | Dependencias y scripts (npm test, npm start). |
| Dockerfile y .dockerignore | Imagen Docker de la API. |
| .github/workflows/ci.yml | Workflow de integración continua. |
| .github/workflows/cd.yml | Workflow de despliegue continuo en EC2. |
| .env.example | Variables de entorno con valores ficticios. |
| [evidencias/](evidencias/) | Capturas del examen (135 imágenes). Para verlas todas con su explicación, abrir [📷 Ver evidencias con fotos](evidencias/README.md). |
| INFORME.md | Informe completo del examen. |

El .env real, las claves .pem, los tokens y las contraseñas **no** están en el repositorio: el .gitignore los excluye y en las capturas se taparon.

## Recursos de AWS utilizados

Región **us-east-1**, VPC predeterminada vpc-0e74f945b159d53ec, recursos identificados con las iniciales **CMVP**.

| Recurso | Nombre | Configuración |
|---|---|---|
| Instancia EC2 | CMVP-ec2-libros | Ubuntu 24.04 LTS, t3.micro, gp3 de 16 GiB |
| Elastic IP | CMVP-eip | 52.200.202.166 |
| Par de claves | CMVP-key | RSA .pem, solo en el equipo local |
| Instancia RDS | cmvp-rds-libros | MySQL 8.4, db.t3.micro, base db_libros, acceso público: No |
| Grupo de seguridad de EC2 | CMVP-ec2-sg | SSH 22 solo desde la IP local; HTTP 80 desde Internet |
| Grupo de seguridad de RDS | CMVP-rds-sg | MySQL 3306 solo desde CMVP-ec2-sg |
| Usuario IAM | CMVP-github-deploy | Solo puede abrir y cerrar SSH en CMVP-ec2-sg durante el despliegue |

Los puertos 3000 (API) y 3306 (MySQL) no están abiertos a Internet.

## ¿Cómo ejecutar las pruebas?

Las pruebas no necesitan RDS: la capa de datos se reemplaza con jest.mock. Basta con Node.js 20.

**Comando:** npm ci

Instala exactamente las versiones de package-lock.json.

**Comando:** npm test

Ejecuta las 8 pruebas: /health, creación válida (201), datos inválidos (400) y libro inexistente (404).

## ¿Cómo ejecutar la API?

La API se ejecuta en la EC2 como contenedor Docker. La configuración de RDS está en /home/ubuntu/api-libros.env, fuera del repositorio y de la imagen:

**Comando:** docker run -d --name api-libros --restart unless-stopped --env-file /home/ubuntu/api-libros.env -p 127.0.0.1:3000:3000 monsievalda/api-libros:&lt;SHA&gt;

- **--env-file**: entrega la configuración de RDS como variables de entorno.
- **-p 127.0.0.1:3000:3000**: el puerto 3000 solo es accesible dentro de la EC2; Nginx lo publica en el puerto 80.
- **--restart unless-stopped**: el contenedor vuelve a arrancar si la EC2 se reinicia.

Este comando lo ejecuta automáticamente el workflow de CD en cada push a main. Para crear la tabla en RDS se usa db.sql. El paso a paso completo está en el [informe](INFORME.md).

## ¿Cómo verificar el despliegue?

**Comando:** curl -i http://52.200.202.166/health

curl envía una petición HTTP y -i muestra el código de respuesta. Debe responder **200** con "status":"ok", la versión y el commit desplegado.

**Comando:** curl -i -X POST http://52.200.202.166/libros -H "Content-Type: application/json" -d '{"titulo":"Rayuela","autor":"Julio Cortazar","anio\_publicacion":1963}'

-X POST indica que se crea un registro, -H avisa que los datos van en JSON y -d contiene el libro. Debe responder **201** con el libro creado.

**Comando:** curl -i http://52.200.202.166/libros

Lista los libros guardados en RDS: **200**.

## Evidencias solicitadas

Las capturas están en [evidencias/](evidencias/) y su [índice](evidencias/README.md) explica cada una. Las principales que pide la entrega:

- **Instancia EC2 y sus reglas de seguridad:** [ej1-19](evidencias/ej1-19-ec2-detalle-elastic-ip-y-vpc.png), [ej1-04](evidencias/ej1-04-sg-ec2-reglas-22-mi-ip-80-publico.png), [ej1-05](evidencias/ej1-05-sg-ec2-creado.png)
- **RDS sin acceso público y su regla de entrada:** [ej1-26](evidencias/ej1-26-rds-misma-vpc-sin-acceso-publico.png), [ej1-30b](evidencias/ej1-30b-rds-regla-entrada-desde-sg-ec2.png), [ej1-07](evidencias/ej1-07-sg-rds-regla-3306-desde-sg-ec2.png)
- **Operaciones CRUD y su persistencia:** [ej1-52](evidencias/ej1-52-crud-post-crear.png), [ej1-53](evidencias/ej1-53-crud-get-y-put.png), [ej1-54](evidencias/ej1-54-crud-delete-404-y-400.png), [ej1-56](evidencias/ej1-56-persistencia-rds-select.png)
- **Ejecución de las pruebas:** [ej1-41](evidencias/ej1-41-npm-test-8-pruebas.png), [ej2-13](evidencias/ej2-13-ci-pruebas-aprobadas.png)
- **Imagen publicada:** [ej2-37](evidencias/ej2-37-dockerhub-tag-sha.png), [ej2-47](evidencias/ej2-47-cd-imagen-tag-sha-version-2.png)
- **Despliegue exitoso en GitHub Actions:** [ej2-33](evidencias/ej2-33-cd-trabajos-en-orden.png), [ej2-39](evidencias/ej2-39-cd-despliegue-exitoso.png), [ej2-46](evidencias/ej2-46-cd-version-2-tres-trabajos.png)
- **Conservación de la versión anterior ante un fallo:** [ej2-59](evidencias/ej2-59-cd-falla-se-conserva-version-anterior.png), [ej2-60](evidencias/ej2-60-health-sigue-version-2-tras-fallo.png)
- **Un pull request no despliega:** [ej2-69](evidencias/ej2-69-pr-ci-fallido-sin-cd.png)
