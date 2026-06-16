FROM node:24-alpine

# COPY app/package*.json ./

# RUN npm install

EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
CMD ["sh"]