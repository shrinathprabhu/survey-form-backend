module.exports = {
    apps: [{
        name: "Survey form APIs",
        script: "./dist/server.js",
        instances: "max",
        node_args: "-r dotenv/config",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}