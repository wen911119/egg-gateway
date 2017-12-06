#!/usr/bin/env bash

echo "start cloning proto..."

if [ -d proto ]
then cd proto &&  git pull
else git clone $1 proto -b $2
fi

echo "fetch proto done !"






