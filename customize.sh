#!/bin/bash

files='find . -type f -not \( -path "*$0*" -o -path "*git*" -o -path "*skin*" -o -path "*.md*" -o -ipath "*make*" \)'

function replace {
  fieldName=$1
  oldValue=$2
  newValue=$3

  if [[ $oldValue == $newValue ]]; then
    echo "The add-on already uses this $fieldName."
    exit 1
  fi
  if [ -z "`eval $files | xargs egrep $oldValue -l`" ]; then
    echo "The addon's $fieldName was already customized."
    exit 1
  fi

  read -p "This add-on's $fieldName will be changed from '$oldValue' to '$newValue'. Continue? (y/n)? "
  if [[ $REPLY == "y" ]]; then
    eval $files -print0 | xargs -0 sed -i '' 's/'$oldValue'/'$newValue'/g'
    printf "Done. Modified files:\n\n"
    eval $files | xargs egrep $newValue -l
    printf "\nMake sure you also update the extension proxy file's name.\nRefer to the README.md for more information.\n"
  else
    echo "No changes were made to the addon's $fieldName."
  fi
}

while getopts "i:n:" opt; do
  case $opt in
    i)
      replace "id" "my-addon" $OPTARG
      ;;
    n)
      replace "name" "MyAddon" $OPTARG
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
