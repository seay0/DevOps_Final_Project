resource "aws_alb" "myALB" {
  name = "my-alb"
  internal = false
  load_balancer_type = "application"
  security_groups = [aws_security_group.my-public-SG.id]
  subnets = [aws_subnet.PublicSubnet01.id, aws_subnet.PublicSubnet02.id]
  enable_cross_zone_load_balancing = true
}

resource "aws_autoscaling_group" "my-ASG" {
  name                 = "my-auto-scaling-group"
  launch_configuration = aws_launch_configuration.my-lc.name
  min_size             = 2
  max_size             = 10
  desired_capacity     = 2
  target_group_arns    = [aws_lb_target_group.my-target-group.arn]
  vpc_zone_identifier  = [aws_subnet.PublicSubnet01.id, aws_subnet.PublicSubnet02.id]
}

resource "aws_lb_target_group" "my-target-group" {
  name     = "my-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.my-vpc-0515.id
}

resource "aws_launch_configuration" "my-lc" {
  name                 = "my-launch-configuration"
  image_id             = "ami-0cb1d752d27600adb"
  instance_type        = "t2.micro"
  security_groups      = [aws_security_group.my-public-SG.id]
  key_name             = aws_key_pair.ec2-key.key_name
  associate_public_ip_address = true
  user_data = <<-EOF
    #!/bin/bash
    echo "Hello, World" > index.html
    nohup busybox httpd -f -p ${var.server_port} &
  EOF
}