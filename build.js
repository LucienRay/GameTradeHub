const { exec } = require("child_process");

const runCommand = (command, workingDir) => {
    return new Promise((resolve, reject) => {
        const process = exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${command} in ${workingDir}:`, error.message);
                return reject(error);
            }
            if (stderr) {
                console.error(`Stderr for ${command} in ${workingDir}:\n${stderr}`);
            }
            console.log(`Output for ${command} in ${workingDir}:\n${stdout}`);
            resolve();
        });

        process.stdout.pipe(process.stdout);
        process.stderr.pipe(process.stderr);
    });
};

const main = async () => {
    try {
        console.log("Building frontend...");
        await runCommand("npm run build", "./Frontend");

        console.log("Building backend...");
        await runCommand("npm run build", "./Backend");

        console.log("Starting application...");
        await runCommand("npm run start", "./Backend");
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

main();
