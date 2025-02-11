# Use official Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the entire project into the container (including server.js)
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
