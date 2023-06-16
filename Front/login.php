<?php
  // 데이터베이스 연결 설정
  $servername = "localhost";
  $username = "사용자이름";
  $password = "비밀번호";
  $dbname = "데이터베이스이름";

  // 데이터베이스 연결 생성
  $conn = new mysqli($servername, $username, $password, $dbname);

  // 연결 확인
  if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
  }

  // 사용자 입력 처리
  $submittedUsername = $_POST["username"];
  $submittedPassword = $_POST["password"];

  // 로그인 정보 조회 쿼리
  $sql = "SELECT * FROM 사용자테이블 WHERE 사용자이름='$submittedUsername' AND 비밀번호='$submittedPassword'";

  // 쿼리 실행 및 결과 가져오기
  $result = $conn->query($sql);

  // 결과 확인
  if ($result->num_rows > 0) {
    // 로그인 성공
    echo "로그인 성공!";
    // 이곳에서 작업 조회 페이지로 이동하는 등의 추가 동작을 수행할 수 있습니다.
  } else {
    // 로그인 실패
    echo "사용자 이름 또는 비밀번호가 올바르지 않습니다.";
  }

  // 연결 종료
  $conn->close();
?>
