import Graph from 'digraphe';
import { parse, walk, each, serialize, find } from "abstract-syntax-tree";

export default class DFG {


    constructor(source) {
        this.graph = new Graph();
        const tree = parse(source);

        each(tree, 'Identifier', node => {
            this.graph.addNode(node.name);
        })

        const assignmentExpressions = find(tree, "AssignmentExpression");
        const variableDeclarators = find(tree, 'VariableDeclarator');
        // const assignmentExpressions = find(tree, 'AssignmentExpression');

        variableDeclarators.forEach(variableDecleratorNode => {
            this.handle_VariableDeclerationNode(variableDecleratorNode);
        })

        assignmentExpressions.forEach(assignmentExpression => {
            this.handle_AssignmentExpressionNode(assignmentExpression);
        })


    }

    handle_AssignmentExpressionNode(assignmentExpression) {


    }

    handle_VariableDeclerationNode(variableDeclarationNode) {
        let dstNode = variableDeclarationNode.id.name;
        let srcNodes = this.handle_initNode(variableDeclarationNode.init);
    }

    handle_initNode(initNode) {
        let sources = new Set();
        // if (!initNode) return;
        // switch (initNode.type) {
        //     case "BinaryExpression":
        //         sources.push(this.handle_BinaryExpression(initNode, sources));
        //         break;
        // }

        walk(initNode, (node, parent) => {
            this.handle_BinaryExpression(node, sources)
            this.handle_ObjectExpression(node, sources)
            this.handle_MemberExpression(node, sources)
        })
        console.log(sources);
        return sources;
    }


    handle_BinaryExpression(binaryExpressionNode, ret) {
        if (binaryExpressionNode.left && binaryExpressionNode.left.type == 'Identifier') {
            ret.add(binaryExpressionNode.left.name);
        }
        if (binaryExpressionNode.right && binaryExpressionNode.right.type == 'Identifier') {
            ret.add(binaryExpressionNode.right.name);
        }
    }

    handle_ObjectExpression(objectExpressionNode, ret) {
        if (objectExpressionNode.type != 'ObjectExpression') return;
        let properties = find(objectExpressionNode, 'Identifier');
        properties.forEach(property => ret.add(property.name))
    }

    handle_MemberExpression(memberExpressionNode, ret) {
        if (memberExpressionNode.type != 'MemberExpression') return;
        let properties = find(memberExpressionNode, 'Identifier');
        properties.forEach(property => ret.add(property.name))
    }

}