FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start"]