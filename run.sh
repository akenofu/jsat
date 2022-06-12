#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "usage: ./run.sh <file_name>"
    exit 1
fi

 unbuffer  node ./_cli.js -gs $1   2>&1 | tee analysis.out
 mv analysis.out output

