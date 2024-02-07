# PHP image with Apache
FROM php:8.0-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy source files to the Apache document root
COPY . /var/www/html/

# Expose port 80 to access your app
EXPOSE 80
