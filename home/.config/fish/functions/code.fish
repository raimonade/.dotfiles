# Open paths in a new Zed workspace; default to the current directory.
function code -d "Open a project in Zed"
  set -l paths $argv
  if test (count $paths) -eq 0
    set paths .
  end

  if type -q zed
    command zed --new $paths
  else if type -q zed-preview
    command zed-preview --new $paths
  else
    echo "Zed CLI was not found." >&2
    return 1
  end
end
