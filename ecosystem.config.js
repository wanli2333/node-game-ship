module.exports = {
    apps: [
        {
            name: "ship",
            script: "npm run serve",
            // script: "node serve/s.js",
            // watch: [
            //     "src/*",
            // ],
            watch: false,
            // ignore_watch: ["serve/file"],
            log_date_format: "YYYY-MM-DD HH:mm:ss.SSS Z",
            max_restarts: 6,
            env: {
                NODE_ENV: "production",
                APP_ENV: "default",
                PORT: 9000,
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
}