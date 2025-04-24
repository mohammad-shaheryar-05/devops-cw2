FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY server.js ./

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]
