FROM amazonlinux:2

# Install Python 3.9 and Pip
RUN yum install -y python37 && \
    yum install -y python3-pip && \
    yum install -y zip && \
    yum clean all

# Pip and virtualenv config
RUN python3.7 -m pip install --upgrade pip && \
    python3.7 -m pip install virtualenv 
RUN python3.7 -m venv env
RUN source env/bin/activate

# Install requirements  
COPY ./requirements.txt .
RUN pip install -r requirements.txt -t ./python

# Archive for deployment
RUN zip -r lambda_layer.zip ./python/
ENTRYPOINT [ "/bin/bash", "-l" ]