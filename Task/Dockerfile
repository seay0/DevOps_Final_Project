FROM node:16-alpine
# node 16 버전을 사용한다.

WORKDIR /app
# /app 디렉토리를 작업 디렉토리로 설정한다.

COPY package*.json ./
# package*.json 형식으로 생긴 파일을 WORKDIR 위치에 복사한다.

RUN npm install
# WORKDIR에서 npn install을 통해 node_modules를 설치해준다.

COPY . .
# WORKDIR에 있는 전체 파일을 가져와서 이미지에 소스 코드를 추가한다.

EXPOSE 3000
# 컨테이너가 3000 포트를 노출하도록 설정한다.

CMD ["npm", "run", "start"]
# 컨테이너가 시작되었을 때 실행되는 명령을 설정한다.