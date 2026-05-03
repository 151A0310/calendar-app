FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# Linux で mvnw を実行できるようにする
RUN chmod +x mvnw

# Maven ビルド（jar を生成）
RUN ./mvnw -B -DskipTests clean package

# jar を自動検出して起動
CMD ["sh", "-c", "java -jar target/*.jar"]
