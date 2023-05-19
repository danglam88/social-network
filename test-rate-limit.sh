#!/bin/bash -e

for i in {1..1000}
do
    curl -kI https://localhost:8080
done
