module.exports = {
    "hooks": {
        "pre-commit": "npm run prettier && npm run lint:fix",
        "pre-push": "npm test"
    }
}