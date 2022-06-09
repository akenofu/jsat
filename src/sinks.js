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

// function mark_vulnerable_sinks_in_cfgBlock(cfgMaster, cfg, sinkNodes) {
//     sinkNodes.forEach(sinkNode => {
//         let sinkArguments = sinkNode.expression.arguments.map(argument => argument.name);
//         let parent = sinkNode.parent;

//     })

// }

export function mark_vulnerable_sinks_in_cfgMasterBlock(cfgMaster) {
    // cfgMaster.cfgs.forEach(cfg => {
    //         let sinkNodes = [];
    //         cfg.bm.blocks.forEach(block => {
    //             if (block.sinks.length > 0) {
    //                 sinkNodes = sinkNodes.concat(block.sinks);
    //             }
    //         })
    //         if (sinkNodes.length > 0) mark_vulnerable_sinks_in_cfgBlock(cfgMaster, cfg, sinkNodes)
    //     }

    // )


    let dfg = new DFG(cfgMaster);

}