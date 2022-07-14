docker rm layer-container

# Build the Lambda layer
docker build -t lambda-layer

# Rename it to layer-container
docker run --name layer-container lambda-layer

# Copy the layer zip for the CDK to use
docker cp layer-container:lambda_layer.zip . && echo "Created lambda_layer.zip with updated lambda layer"
