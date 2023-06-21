resource "aws_vpc" "my-vpc-0515" {
  cidr_block = "10.0.0.0/16"
  instance_tenancy = "default"
  
  tags = {
    Name = "my-vpc-0515"
  }
}

# 서브넷
resource "aws_subnet" "PublicSubnet01" {
  vpc_id = aws_vpc.my-vpc-0515.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-northeast-2a"
  tags = {
    Name = "public-subnet01"
  }
}

resource "aws_subnet" "PublicSubnet02" {
  vpc_id = aws_vpc.my-vpc-0515.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-northeast-2c" # b는 t2 micro 적용이 안된다.
  tags = {
    Name = "public-subnet02"
  }
}
resource "aws_subnet" "PrivateSubnet01" {
  vpc_id = aws_vpc.my-vpc-0515.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "ap-northeast-2a"
  tags = {
    Name = "private-subnet01"
  }
}
resource "aws_subnet" "PrivateSubnet02" {
  vpc_id = aws_vpc.my-vpc-0515.id
  cidr_block = "10.0.4.0/24"
  availability_zone = "ap-northeast-2c"
  tags = {
    Name = "private-subnet02"
  }
}

# 인터넷 게이트웨이 ( 외부 인터넷에 연결하기 위함 )
resource "aws_internet_gateway" "my-IGW-0515" {
  vpc_id = aws_vpc.my-vpc-0515.id
  tags = {
    Name = "my-IGW-0515"
  }
}

# 라우팅 테이블
## 1. 퍼블릭 라우팅 테이블 정의
resource "aws_route_table" "my-public-route01" {
  vpc_id = aws_vpc.my-vpc-0515.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my-IGW-0515.id
  }
  tags = {
    Name = "my-public-route01"
  }
}
resource "aws_route_table" "my-public-route02" {
  vpc_id = aws_vpc.my-vpc-0515.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my-IGW-0515.id
  }
  tags = {
    Name = "my-public-route02"
  }
}

## 2. 프라이빗 라우팅 테이블 정의
resource "aws_route_table" "my-private-route01" {
  vpc_id = aws_vpc.my-vpc-0515.id

  tags = {
    Name = "my-private-route01"
  }
}
resource "aws_route_table" "my-private-route02" {
  vpc_id = aws_vpc.my-vpc-0515.id

  tags = {
    Name = "my-private-route02"
  }
}

## 퍼블릭 라우팅 테이블 연결
resource "aws_route_table_association" "my-public-RT-Assoication01" {
  subnet_id = aws_subnet.PublicSubnet01.id
  route_table_id = aws_route_table.my-public-route01.id
}
resource "aws_route_table_association" "my-public-RT-Assoication02" {
  subnet_id = aws_subnet.PublicSubnet02.id
  route_table_id = aws_route_table.my-public-route02.id
}

## 프라이빗 라우팅 테이블 연결
resource "aws_route_table_association" "my-private-RT-Assoication01" {
  subnet_id = aws_subnet.PrivateSubnet01.id
  route_table_id = aws_route_table.my-private-route01.id
}
resource "aws_route_table_association" "my-private-RT-Assoication02" {
  subnet_id = aws_subnet.PrivateSubnet02.id
  route_table_id = aws_route_table.my-private-route02.id
}


## 퍼블릭 보안 그룹
resource "aws_security_group" "my-public-SG" {
  vpc_id = aws_vpc.my-vpc-0515.id
  name = "my public SG"
  description = "my public SG"
  tags = {
    Name = "log public SG"
  }
}

## 프라이빗 보안 그룹
resource "aws_security_group" "my-private-SG" {
  vpc_id = aws_vpc.my-vpc-0515.id
  name = "my private SG"
  description = "private SG"
  tags = {
    Name = "log private SG"
  }
}

## 퍼블릭 보안 그룹 규칙
resource "aws_security_group_rule" "my-public-SG-Rules-HTTPingress" {
  type = "ingress"
  from_port = 80
  to_port = 80
  protocol = "TCP"
  cidr_blocks = [ "0.0.0.0/0" ]
  security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_security_group_rule" "my-public-SG-Rules-HTTPegress" {
  type = "egress"
  from_port = 80
  to_port = 80
  protocol = "TCP"
  cidr_blocks = [ "0.0.0.0/0" ]
  security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_security_group_rule" "my-public-SG-Rules-HTTPSingress" {
  type = "ingress"
  from_port = 443
  to_port = 443
  protocol = "TCP"
  cidr_blocks = [ "0.0.0.0/0" ]
  security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_security_group_rule" "my-public-SG-Rules-HTTPSegress" {
  type = "egress"
  from_port = 443
  to_port = 443
  protocol = "TCP"
  cidr_blocks = [ "0.0.0.0/0" ]
  security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_security_group_rule" "my-public-SG-Rules-SSHingress" {
  type = "ingress"
  from_port = 22 # ssh 연결 : 22
  to_port = 22
  protocol = "TCP"
  cidr_blocks = [ "211.202.142.3/32" ]
  security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_security_group_rule" "my-public-SG-Rules-SSHegress" {
  type = "egress"
  from_port = 22
  to_port = 22
  protocol = "TCP"
  cidr_blocks = [ "211.202.142.3/32" ]
  security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}

### 프라이빗 보안 그룹 규칙 ( RDS )
resource "aws_security_group_rule" "my-private-SG-Rules-RDSingress" {
  type = "ingress"
  from_port = 3306
  to_port = 3306
  protocol = "TCP"
  security_group_id = aws_security_group.my-private-SG.id
  source_security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_security_group_rule" "my-private-SG-Rules-RDSegress" {
  type = "egress"
  from_port = 3306
  to_port = 3306
  protocol = "TCP"
  security_group_id = aws_security_group.my-private-SG.id
  source_security_group_id = aws_security_group.my-public-SG.id
  lifecycle {
    create_before_destroy = true
  }
}

