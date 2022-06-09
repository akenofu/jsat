import Graph from 'digraphe';
import { parse, walk, each, serialize, find } from "abstract-syntax-tree";
import { DataSet, Network } from "vis-network/standalone";
import fs from 'fs';
import path from 'path'
export default class DFG {


    constructor(source) {
        //source += "\nvar mid = base;";
        console.log(source)
        this.graph = new Graph();
        const tree = parse(source);

        each(tree, 'Identifier', node => {
            this.graph.addNode(node.name);
        });
        this.handle_tree(tree, "VariableDeclarator");
        this.handle_tree(tree, "AssignmentExpression");

        this.dot();

    }

    dot() {
        let src = fs.readFileSync(path.join(__dirname, "dfg.html")).toString();
        let nodes = [];
        let i = 0;
        let indexedNode = {};
        for (const property in this.graph.nodes) {
            nodes.push({
                id: i,
                label: property
            });
            indexedNode[property] = i;
            i++;
        }

        this.g
        let edges = this.graph.edges.map(edge => {
            return {
                from: indexedNode[edge.source.id],
                to: indexedNode[edge.target.id],
                arrows: { middle: { scaleFactor: 0.5 }, from: true }
            }
        })

        console.log(edges)
    }



    handle_tree(tree, nodeName) {

        const treeTraverse = find(tree, nodeName);
        let sources = treeTraverse.forEach(childNode => {
            this.handle_childNode(childNode);
        })

    }
    handle_childNode(childNode) {
        let dstNode = null;
        if ('VariableDeclarator' == childNode.type) {
            dstNode = childNode.id.name;
        }
        if ('AssignmentExpression' == childNode.type) {
            dstNode = childNode.left.name;
        }
        let sources = new Set();
        walk(childNode, (node, parent) => {
            this.handle_Identifier(node, sources);
            this.handle_BinaryExpression(node, sources)
            this.handle_ObjectExpression(node, sources)
            this.handle_MemberExpression(node, sources)
        });
        console.log(dstNode, sources);
        sources.forEach(source => {
            if (dstNode)
                this.graph.addEdge(source, dstNode);
        })
    }

    handle_BinaryExpression(node, ret) {
        if (node.left && node.left.type == 'Identifier') {
            ret.add(node.left.name);
        }
        if (node.right && node.right.type == 'Identifier') {
            ret.add(node.right.name);
        }
    }

    handle_ObjectExpression(node, ret) {
        if (node.type != 'ObjectExpression') return;
        let properties = find(node, 'Identifier');
        properties.forEach(property => ret.add(property.name))
    }

    handle_MemberExpression(node, ret) {
        if (node.type != 'MemberExpression') return;
        let properties = find(node, 'Identifier');
        properties.forEach(property => ret.add(property.name))
    }

    handle_Identifier(node, ret) {
        if (node.init && node.init.type == 'Identifier') {
            ret.add(node.init.name);
        }

    }


}