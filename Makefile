PROJECT="my-addon"
PWD=`pwd`
BUILD="build"
VERSION=`git describe --tags`
NAME="${PROJECT}-${VERSION}.xpi"
XPI="${PWD}/${BUILD}/${NAME}"

.PHONY: latest xpi clean

latest:
	@echo "Building latest '${XPI}'..."
	@mkdir -p ${BUILD}
	@zip -r ${XPI} * -x "${BUILD}/*" -x "Makefile" -x ".git/*"

xpi:
	@echo "Building '${XPI}'..."
	@mkdir -p ${BUILD}
	@git archive --format=zip -o ${XPI} HEAD

clean:
	@echo "Removing '${PWD}/${BUILD}'..."
	@rm -rf ${BUILD}
