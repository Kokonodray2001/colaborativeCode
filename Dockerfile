# FROM node:20-alpine

# COPY bin /app/
# COPY model /app/
# COPY public /app/
# COPY routes /app/
# COPY views /app/
# COPY .env /app/
# COPY app.js /app/
# COPY package-lock.json /app/
# COPY package.json /app/

# WORKDIR /app

# RUN npm install
# CMD ["node","./bin/www"]
# Use an official Node.js runtime as the base image

FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Express.js application will run on
EXPOSE 5000

# Define the command to start your application
CMD ["npm", "dev"]
