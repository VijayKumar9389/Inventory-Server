# Use a Node.js base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the compiled TypeScript files and Prisma client
COPY dist ./dist
COPY prisma ./prisma

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "./dist/server.js"]
