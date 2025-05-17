# infra/outputs.tf

output "web_server_ip" {
  description = "IP publique du web server"
  value       = aws_instance.web_server.public_ip
}

output "db_server_ip" {
  description = "IP publique du db server"
  value       = aws_instance.db_server.public_ip
}
