import DFG from "./dfg";
import chalk from 'chalk';

const dangerous = chalk.red;
const safe = chalk.green;
const keyword = chalk.blue
const identifier = chalk.yellow;

export var vulnerable_pathes = [];

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


export function identify_sinks(ast) {
    ast.body.forEach(astNode => {
        if (astNode.type == 'ExpressionStatement') {
            if (astNode.expression.type == 'CallExpression') {
                for (const [key, value] of Object.entries(sinks)) {
                    try {
                        if (key.includes(astNode.expression.callee.property.name)) {
                            astNode.sink = {
                                type: key,
                                name: astNode.expression.callee.property.name
                            }

                        }
                    } catch (excpetion) {
                        continue;
                    }
                }

            }
        }

        if (astNode.type == 'FunctionDeclaration') {
            identify_sinks(astNode.body)
        }
    })
};


export function identify_vulnerable_sinks(cfg, dfg) {
    let params = null;
    if (cfg.params.length > 0) {
        params = cfg.params.map(p => p.name)
    }
    if (params) {
        cfg.bm.forEach(block => {
            if (block.sinks.length > 0) {
                block.sinks.forEach(sink => {
                    let isSinkMarked = false;
                    const sink_args = sink.expression.arguments.map(x => x.name)
                    params.forEach(param => {
                        let pathes = sink_args.map(sink_arg => {
                            return dfg.graph.routes({ from: sink_arg, to: param });
                        });
                        if (pathes.length > 0 && pathes[0].length > 0) {
                            if (!isSinkMarked) {
                                block.vulnerable_sinks.push(sink);
                                isSinkMarked = true;
                            }

                            const sink_args = pathes.map(path => path.map(routes => routes.path[0].id))
                            vulnerable_pathes.push({
                                sink: sink.sink.name,
                                sink_args: sink_args,
                                sink_node: sink,
                                sink_block: block,
                                function_param: param,
                                pathes: pathes,
                                function_name: cfg.name,
                                cfg: cfg
                            });

                        }
                    })
                })
            }
        })
    }

}

function str_ascii_route(route) {
    let ascii_route = ''
    for (let i = route.length - 1; i >= 0; i--) {
        ascii_route += `${ i == 0 || i == route.length - 1? dangerous(route[i].id): route[i].id} ${ i == 0  ? '': '-> '}`

    }
    return ascii_route;
}

export function pretty_print_vulnerable_sinks_(name) {
    if (!vulnerable_pathes.length > 0) {
        console.log(safe(`No injection vulnerabilities found in ${name}`));
        return;
    }

    console.log(dangerous(`Injection Vulnerabilities found in ${name}!!!`))
    vulnerable_pathes.forEach(vulnerable_path => {
        const {
            function_name,
            function_param,
            sink,
            sink_args,
            pathes
        } = {...vulnerable_path };
        pathes.forEach(path => {
            path.forEach(route => {
                let ascii_route = str_ascii_route(route.path)
                const str = `${keyword('Function')} ${identifier(function_name)} (${dangerous(function_param)}, ...) {\n\t${identifier(sink)}(${dangerous(sink_args[0])}, ...)\n\t${ascii_route}`
                console.log(str);
            })
        })
    })
}