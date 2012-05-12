PROJECT="my-addon"
PWD=`pwd`
VERSION=`git describe --tags`
XPI="${PWD}/build/${PROJECT}-${VERSION}.xpi"

.PHONY: xpi

xpi:
	@echo "Building '${XPI}'..."
	@mkdir -p build
	@git archive --format=zip -o ${XPI} HEAD
