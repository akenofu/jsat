const { exec } = require('child_process');

function ping(ip) {
    
	exec('ping -c 1 ' + ip, function(error, stdout, stdin) {
        console.log(stdout);
    });
}


ping('127.0.0.1 ; id')
