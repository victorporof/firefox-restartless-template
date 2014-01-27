#!/bin/bash

files='find . -type f -not \( -path "*$0*" -o -path "*git*" -o -path "*skin*" -o -path "*.md*" -o -ipath "*make*" \)'

function replace {
  if [[ $1 == $2 ]]; then
    echo "The add-on already uses this $3."
    exit 1
  fi
  read -p "This add-on's $3 will be changed from '$1' to '$2'. Continue? (y/n)? "
  if [[ $REPLY == "y" ]]; then
    eval $files -print0 | xargs -0 sed -i '' 's/'$1'/'$2'/g'
    printf "Done. Modified files:\n\n"
    eval $files | xargs egrep $2 -l
    printf "\nMake sure you also update the extension proxy file's name.\nRefer to the README.md for more information.\n"
  else
    echo "No changes were made to the addon's $3."
  fi
}

while getopts "i:n:" opt; do
  case $opt in
    i)
      replace "my-addon" $OPTARG "id"
      ;;
    n)
      replace "MyAddon" $OPTARG "name"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done
