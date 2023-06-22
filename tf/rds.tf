resource "aws_db_instance" "my-rds" {
  allocated_storage     = 20
  engine                = "mysql"
  engine_version        = "8.0.32"
  instance_class        = "db.t3.micro"
  username              = "Iam_user"
  password              = "12345678"
  skip_final_snapshot = true
  
# Storage ( 스토리지 섹션 기본 값으로 설정 )
  # No changes, keeping the default values

  # Connections
  # No changes, keeping the default values

  # Compute resource
  # No changes, as the connection is established using depends_on

  depends_on = [aws_instance.my-ec2]
    # Specify the subnet IDs for the RDS instance
  db_subnet_group_name = aws_db_subnet_group.default.name
}

resource "aws_db_subnet_group" "default" {
  name        = "default-subnet-group"
  description = "Default subnet group for RDS"
  subnet_ids  = [
    aws_subnet.PrivateSubnet01.id,
    aws_subnet.PrivateSubnet02.id,
  ]
  tags = {
    Name = "DefaultSubnetGroup"
  }
}