PROJECT="my-addon"
PWD=`pwd`
BUILD="build"
VERSION=`git describe --tags`
NAME="${PROJECT}-${VERSION}.xpi"
XPI="${PWD}/${BUILD}/${NAME}"

.PHONY: xpi latest clean

xpi:
	@echo "Building '${XPI}'..."
	@mkdir -p ${BUILD}
	@git archive --format=zip -o ${XPI} HEAD

latest:
	@echo "Building latest '${XPI}'..."
	@mkdir -p ${BUILD}
	@zip -r ${XPI} * -x "${BUILD}/*" -x "Makefile" -x ".git/*"

clean:
	@echo "Removing '${PWD}/${BUILD}'..."
	@rm -rf ${BUILD}
