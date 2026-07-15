function scratch -d "Open a temporary file in editor"
  set -l tmpfile (mktemp)
  if set -q EDITOR
    $EDITOR $tmpfile
  else
    nano $tmpfile
  end
end
