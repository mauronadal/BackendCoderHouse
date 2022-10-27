nodemon

```bash
nodemon server.js PUERTO MODO(cluster, fork)
```

forever

```bash
forever server.js PUERTO MODO(cluster, fork)
```

PM2 (FORK)

```bash
pm2 start server.js --name="server1" --watch -- -- 8080
```

PM2 (CLUSTER)

```bash
pm2 start server.js --name="server2" --watch -i max
```

Con NGINX

Config 1:

```bash
    start nginx
    pm2 start server.js --name="server1" --watch -- -- 8080
    pm2 start server.js --name="server2" --watch -- -- 8081
```
Config 2:

Se debera ir a la carpeta nginx1.21.6 comentar el METODO 1, y descomentar el METODO 2.


PM2
```bash
    start nginx
    pm2 start server.js --name="server1" --watch -- -- 8081
    pm2 start server.js --name="server2" --watch -- -- 8082
    pm2 start server.js --name="server3" --watch -- -- 8083
    pm2 start server.js --name="server4" --watch -- -- 8084
    pm2 start server.js --name="server5" --watch -- -- 8085
```

Cluster 

```bash
    start nginx
    nodemon server.js 8081 cluster
    nodemon server.js 8082 cluster
    nodemon server.js 8083 cluster
    nodemon server.js 8084 cluster
    nodemon server.js 8085 cluster
```