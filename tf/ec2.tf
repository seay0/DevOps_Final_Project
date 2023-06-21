variable "server_port" {
  description = "The port number for the HTTP server"
  type        = number
  default     = 80
}

resource "aws_key_pair" "ec2-key" {
  key_name   = "terraTest"
  public_key = file("./testPubkey.pub")
}

resource "aws_instance" "my-ec2" {
  ami                    = "ami-0cb1d752d27600adb"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.my-public-SG.id]
  subnet_id              = aws_subnet.PublicSubnet01.id
  key_name               = aws_key_pair.ec2-key.key_name

  root_block_device {
    volume_size = 200
    volume_type = "gp3"
  }

  user_data = <<-EOF
    #!/bin/bash
    echo "Hello, World" > index.html
    nohup busybox httpd -f -p ${var.server_port} &
  EOF
}
