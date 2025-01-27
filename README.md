# t1-calendar

서버 실행하는 방법

```bash
docker-compose up app
```

개발 서버 실행하는 방법

```bash
docker-compose up dev
```

패키지 설치/삭제하는 방법

```bash
docker exec -t bun-app-dev bun <add/remove> <package-name>
```

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
