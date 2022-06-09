import DFG from "./dfg";


export const sinks = {
    'os_command': [
        'eval',
        "sink_hqbpillvul_execFile",
        'sink_hqbpillvul_exec',
        'sink_hqbpillvul_execSync',
        'sink_hqbpillvul_spawn',
        'sink_hqbpillvul_spawnSync',
        'sink_hqbpillvul_db'
    ],
    'xss': [
        'pipe',
        'sink_hqbpillvul_http_write',
        'sink_hqbpillvul_http_setHeader'
    ],
    'proto_pollution': [
        'merge', 'extend', 'clone', 'parse'
    ],
    'code_exec': [
        'Function',
        'eval',
        "sink_hqbpillvul_execFile",
        'sink_hqbpillvul_exec',
        'sink_hqbpillvul_execSync',
        'sink_hqbpillvul_eval'
    ],
    'sanitation': [
        'parseInt'
    ],
    'path_traversal': [
        'pipe',
        'sink_hqbpillvul_http_write',
        'sink_hqbpillvul_http_sendFile'
    ],
    'depd': [
        'sink_hqbpillvul_pp',
        'sink_hqbpillvul_code_execution',
        'sink_hqbpillvul_exec'
    ]

};


export function mark_sinks_as_dangerous_in_ast(ast) {
    ast.body.forEach(astNode => {
        if (astNode.type == 'ExpressionStatement') {
            if (astNode.expression.type == 'CallExpression') {
                for (const [key, value] of Object.entries(sinks)) {
                    try {
                        if (key.includes(astNode.expression.callee.property.name)) {
                            astNode.sink = {
                                type: key
                            }

                        }
                    } catch (excpetion) {
                        continue;
                    }
                }

            }
        }

        if (astNode.type == 'FunctionDeclaration') {
            mark_sinks_as_dangerous_in_ast(astNode.body)
        }
    })
};