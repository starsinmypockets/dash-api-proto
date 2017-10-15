provider "aws" {
    region = "us-east-1"
}

resource "aws_iam_role" "validate_json_schema_1" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
resource "aws_lambda_function" "validate_json_schema_1" {
    function_name="validate_json_schema_1"
    handler = "index.handler"
    runtime = "nodejs4.3"
    filename = "function.zip"
    source_code_hash = "${base64sha256(file("function.zip"))}"
    role = "${aws_iam_role.validate_json_schema_1.arn}"
}
