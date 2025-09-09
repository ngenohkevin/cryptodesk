FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code  
COPY . .

# Debug: List files before build
RUN echo "Files before build:" && ls -la

# Build the application for static export
RUN npm run build

# Debug: List files after build
RUN echo "Files after build:" && ls -la && echo "Contents of out directory:" && ls -la out/ || echo "No out directory found"

# Install nginx
RUN apk add --no-cache nginx

# Clear default nginx html and copy our files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files or fallback to a simple test page
RUN if [ -d "out" ]; then \
      echo "Copying built files from out/" && \
      cp -r out/* /usr/share/nginx/html/; \
    else \
      echo "No out directory, creating test page" && \
      echo "<h1>CryptoDesk - Build Failed</h1><p>Next.js build did not produce output</p>" > /usr/share/nginx/html/index.html; \
    fi

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx directories and set permissions
RUN mkdir -p /run/nginx && chown -R nginx:nginx /var/log/nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]