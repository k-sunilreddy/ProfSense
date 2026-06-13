# Use an official PHP server image
FROM php:8.2-apache

# Install the mysqli extension your code relies on
RUN docker-php-ext-install mysqli

# Enable Apache routing (important if you use .htaccess files)
RUN a2enmod rewrite

# Copy all your project files into the server
COPY . /var/www/html/

# Expose port 80 for web traffic
EXPOSE 80