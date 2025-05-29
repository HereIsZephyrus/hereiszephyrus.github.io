# 使用CMake 配置 Windows QGIS开发环境

> 因为要项目协作想着用CMake组织一下吧这样分发源码就很方便了，然后开启了我痛苦的三天...在Windows上配置开发环境实在太痛苦了😭

## 省流--如何使用OSGeo4W快速在Windows上配置开发环境

1. 下载OSGeo4W
2. 在OSGeo4W中下载QGIS(QGIS还有dev,ltr-dev等版本可自由选择)以及Qt开发工具qt5-devel,qt5-libs,qt5-tools,qt5-libs-symbols
3. 打开系统环境变量配置：
    1. OSGEO4W_ROOT=C:\OSGeo4W
    2. Qt5_DIR=\$OSGEO4W_ROOT\$\apps\Qt5
4. 在系统环境变量PATH中添加配置：
    1. \$Qt5_DIR\$\bin
    2. \$OSGEO4W_ROOT\$\bin
    3. \$OSGEO4W_ROOT\$\apps\qgis\bin
    > 类似的一些库如gdal-dev等也需要如此配置。
5. 找到QGIS下的FindQGIS.cmake文件，将其添加到当前的CMAKE_MODULE_PATH中。
6. 将OSGEO4W_ROOT\bin下的文件**复制**到\OSGEO4W_ROOT\apps\qgis\bin中(建议先备份bin)。
6. **使用MSVC**构建CMakeLists

如果想启用编译器的编译提示，可以把对应的头文件加载到IDE的搜索路径中(如VScode就是C/C++ Extension的include dir)

## 排坑--CMake环境相关问题杂谈

你说的对但是Windows绝不会让你就此结束...以下是一些遇到的坑（和遗留问题）

1. **使用MSVC进行编译！** 由于OSGeo4W的QGIS等库是MSVC编译的，无法使用MinGW64链接MSVC编译的库。（~~微软~~ 资本你赢了）
2. **检查环境路径的优先级** 检查Path中同一软件的环境优先级，提高新填写的环境变量的优先级，否则可能会找到老的依赖。
3. **记得清理CMake构建目录缓存的Qt缓存** 这东西普遍比较玄学，没有头绪可以试一试，以及在CMakeLists有重大改动后要注意。
4. **Q: 提示找不到qt5-qca.dll/qt5-webkit.dll/qt5-keychain等错误如何解决**
这个问题的来源是Qt依赖的更新。在qt5.6之后的版本默认不包含这些库，因此大家使用的qt5.15.2等版本是默认不包含这些库的，因此需要配置PATH能够找到OSGeo4W下的qt5
5. **Q: 提示entry point not found XX in qgis_core.dll如何解决**
这个问题到根源在于如OSGeo4W使用的部分库与其他软件使用的库版本不兼容，如JAVA默认的zip库就无法在OSGeo4W的qgiscore中使用，因此需要提高OSGeo4W中库的优先级。当然这可能导致其他软件的环境出错，为什么要把OSGEO4W_ROOT\bin复制到qgis\bin下。(或者一些土方法是把对应的dll移到当前文件目录下)
6. **Q: QGIS提示Application PATH not found如何解决**
在使用QgsApplication等函数前记得配置prefix，详见文档。
7. **Q: 我可以使用qt6构建QGIS项目吗？**
答案是非常困难四舍五入不可以，因为这(尤其是对于Windows)意味着要把QGIS从源码重新编译一遍。当然通过QGIS的GitHub仓库下的install的提示是可以做到的(笔者在Debian上尝试过，Debian的qt包比较老各种不兼容非常抽象)，但这需要花费很大精力并且要处理qt5到qt6的webengine兼容问题。