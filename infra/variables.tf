# infra/variables.tf

variable "aws_region" {
  description = "Région AWS par défaut"
  type        = string
  default     = "us-east-1"
}
