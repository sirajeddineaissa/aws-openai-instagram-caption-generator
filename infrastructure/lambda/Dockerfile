FROM amazonlinux:2022

# Install Python 3.9 and Pip
RUN yum install -y python3.9 && \
    yum install -y python3-pip && \
    yum install -y zip && \
    yum clean all

# Pip and virtualenv config
RUN python3.9 -m pip install --upgrade pip && \
    python3.9 -m pip install virtualenv
RUN python3.9 -m venv env
RUN source env/bin/activate

# Install requirements
COPY ./requirements.txt .
RUN pip install -r requirements.txt -t ./python

# Archive for deployment
RUN zip -r lambda_layer.zip ./python/
ENTRYPOINT [ "/bin/bash", "-1" ]