#!/bin/bash

IP=$(minikube --profile xxx-backend ip)
HOSTNAME=xxx-backend

# Check if the /etc/hosts file already contains an entry for the Minikube IP and hostname
if ! grep -q "$IP $HOSTNAME" /etc/hosts; then
  echo "Adding entry to /etc/hosts"
  echo "$IP $HOSTNAME" | sudo tee -a /etc/hosts >/dev/null
else
  echo "Entry for $IP $HOSTNAME already exists in /etc/hosts"
fi