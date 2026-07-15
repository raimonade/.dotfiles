function fvim
    set -l selected
    if test (count $argv) -eq 0
        set selected (fd -H -t f | fzf --header "Open File in Zed" --preview "cat {}")
    else
        set -l query (string join " " $argv)
        set selected (fd -H -t f | fzf --header "Open File in Zed" --preview "cat {}" -q "$query")
    end

    test -n "$selected"; and code "$selected"
end

function vim
    code $argv
end

function vi
    code $argv
end
