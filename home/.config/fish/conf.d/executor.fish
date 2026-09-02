# Authenticate Executor CLI processes against the local daemon.
set -l executor_server_file "$HOME/.executor/server-control/server.json"

if test -r "$executor_server_file"; and command -q jq
    set -l executor_auth_token (jq --raw-output '.connection.auth.token // empty' "$executor_server_file")
    if test -n "$executor_auth_token"
        set -gx EXECUTOR_AUTH_TOKEN "$executor_auth_token"
    end
end
