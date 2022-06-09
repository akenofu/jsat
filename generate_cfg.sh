#!/bin/bash
nodejs /home/akenofu/gp/ast-flow-graph/_cli.js -gs $1 | graph-easy --as_html > /tmp/out.html ; firefox /tmp/out.html


