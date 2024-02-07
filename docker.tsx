docker build -t myapp .

docker run -d -p 8080:80 --name myapp_container myapp
