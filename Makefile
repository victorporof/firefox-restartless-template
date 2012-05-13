PROJECT="my-addon"
PWD=`pwd`
VERSION=`git describe --tags`
NAME="${PROJECT}-${VERSION}.xpi"
BUILD="build"
XPI="${PWD}/${BUILD}/${NAME}"

.PHONY: xpi latest

xpi:
	@echo "Building '${XPI}'..."
	@mkdir -p ${BUILD}
	@git archive --format=zip -o ${XPI} HEAD

latest:
	@zip -r ${XPI} * -x "${BUILD}/*" -x "Makefile" -x ".git/*"
