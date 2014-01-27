#!/bin/bash

files='find . -type f -not \( -path "*$0*" -o -path "*git*" -o -path "*skin*" -o -path "*.md*" -o -ipath "*make*" \)'

function replace {
  fieldName=$1
  oldValue=$2
  newValue=$3
  verbose=$4
  forced=$5

  if [[ $forced -ne 1 ]]; then
    if [[ $oldValue == $newValue ]]; then
      echo "The add-on already uses this $fieldName."
      exit 1
    fi
    if [ -z "`eval $files | xargs egrep $oldValue -l`" ]; then
      echo "The addon's $fieldName was already customized."
      exit 1
    fi
  fi

  if [[ $verbose -ne 1 ]]; then
    read -p "This add-on's $fieldName will be changed. Continue? (y/n)? "
  else
    read -p "This add-on's $fieldName will be changed from '$oldValue' to '$newValue'. Continue? (y/n)? "
  fi

  if [[ $REPLY == "y" ]]; then
    eval $files -print0 | xargs -0 sed -i '' 's/'"$oldValue"'/'"$newValue"'/g'

    if [ $verbose == "1" ]; then
      printf "Done. Modified files:\n\n"
      eval $files | xargs egrep $newValue -l
    fi
    if [[ $fieldName == "id" ]]; then
      printf "\nMake sure you also update the extension proxy file's name.\nRefer to the README.md for more information.\n"
    fi
  else
    echo "No changes were made to the addon's $fieldName."
  fi
}

while getopts "i:n:d:v:" opt; do
  case $opt in
    i)
      replace "id" "my-addon" $OPTARG 1
      ;;
    n)
      replace "name" "MyAddon" $OPTARG 1
      ;;
    d)
      regex="\(<em:description>\).*\(<\/em:description>\)"
      replace "description" $regex '\1'"$OPTARG"'\2' 0 1
      ;;
    v)
      regex="\(<em:version>\).*\(<\/em:version>\)"
      replace "version" $regex '\1'"$OPTARG"'\2' 0 1
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
