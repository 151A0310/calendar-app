FROM eclipse-temurin:17-jdk

WORKDIR /app

# backend ディレクトリだけをコピーする
COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# jar 名を自動で拾う
CMD ["sh", "-c", "java -jar target/*.jar"]
