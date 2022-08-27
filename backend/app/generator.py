import os
from typing import List
import openai
import argparse
import re
import boto3
import base64
import json
from botocore.exceptions import ClientError


def get_secret():

    secret_name = os.environb.get("OPENAI_API_SECRET_NAME")
    region_name = os.environ.get("region")

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS key.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            decoded_binary_secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)["value"]   
    # Your code goes here. 

# put secret outside of functions so it can be cached between lambda calls
openApiSecret = get_secret()


def main():
    argParser = argparse.ArgumentParser()
    argParser.add_argument("--input", "-i", type=str, required=True)
    args = argParser.parse_args()
    input = args.input
    print(f"Generating data for the input : {input}")
    if valid_input(input):
        caption_result = generate_instagram_caption(input)
        related_words_result = generate_related_words(input)
        print(f"Generated Caption : {caption_result}")
        print(f"Related Words : {related_words_result}")
    else:
        raise ValueError(f"Make your input shorter!")


def generate_related_words(theme: str) -> List[str]:
    
    # Load the API key generated from OpenAPI
    openai.api_key = openApiSecret

    prompt = f"Generate caption words related to {theme} : "
    response = openai.Completion.create(
        model="text-davinci-002", prompt=prompt, max_tokens=100)
    words = response["choices"][0]["text"]
    words_list = re.split("-|,|\n", words)

    # Keep only alphabets within the generated keywords and for some cases, replace the spaces with underscores
    words_list = [re.sub(r'[^A-Za-z ]+', '', w).strip().replace(' ','_')
                  for w in words_list if len(w) > 0]

    # Convert keywords to uppercase format              
    words_list = [w.upper()
                  for w in words_list]

    return words_list


def generate_instagram_caption(theme: str) -> str:

    # Load the API key generated from OpenAPI
    openai.api_key = openApiSecret

    prompt = f"Generate an instagram caption related to {theme} : "
    response = openai.Completion.create(
        engine="davinci-instruct-beta-v3", prompt=prompt, max_tokens=50)
    caption = response["choices"][0]["text"]

    caption = caption.replace('"','').strip()

    return caption


def valid_input(input: str) -> bool:
    return len(input) <= 20


if __name__ == "__main__":
    main()
