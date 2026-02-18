function gt --description "Open Ghostty in the current working directory"
    open -na Ghostty.app --args -e /opt/homebrew/bin/fish -C "cd "(string escape (pwd))
end
