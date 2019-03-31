FROM       node:10-slim as build
WORKDIR    /app
COPY       . .
RUN        npm ci
CMD        [ "npm", "run", "build" ]

FROM       node:10-slim as test
WORKDIR    /app
COPY       --from=build /app .
ENTRYPOINT [ "npm", "t" ]