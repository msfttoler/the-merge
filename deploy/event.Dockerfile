FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node event ./event
RUN mkdir -p /app/event/data && chown node:node /app/event/data
USER node
ENV HOST=0.0.0.0 PORT=4173
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:4173/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "event/server.mjs"]
