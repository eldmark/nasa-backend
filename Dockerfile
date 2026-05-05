FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]
