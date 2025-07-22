---
categories:
  - Blog
tags:
  - Note
  - Coverage
title: 科学数据计算入门-CHDF5
mathjax: false
description: 写给地信专业的C HDF5计算入门
date: 2025-07-17 14:29:00
---

> **前言**
> 作为地信专业的学生，在日常学习工作中往往离不开与Coverage类型的数据打交道。但是这类数据通常规模很大且数据组织灵活，加上这类数据并不像矢量数据和栅格数据常见，相关资料也比较缺乏。本文是一篇使用C 处理HDF5数据的入门(不用C++的原因后文会提到，其与并行开关不兼容)，包含数据说明，环境安装，API说明和基础操作。

[HDF5官方文档](https://support.hdfgroup.org/documentation/hdf5/latest/index.html)

<u>截止2025年7月HDF5的最新版本是1.15.6, 2.0.0版本不期将发布注意甄别内容时效。</u>

本文使用的样例代码托管在[HDF5-OpenMP-CDemo](https://github.com/geoinformation-wuhan/HDF5-OpenMP-CDemo)

*AI使用说明* 本文有AI辅助完成，提供概念说明，举例等内容。

# 什么是HDF5

**HDF5(Hierarchical Data Format version 5)** 是由一个用于存储和管理科学数据的文件格式和库。具有`自描述`(文件包含数据结构的完整描述)，`高效`(优化的I/O性能和压缩支持)，`优秀的可移植性`(跨平台、跨语言支持)和`优秀的可拓展性`(支持大型数据集和复杂数据结构)等特点而广泛应用于科学计算领域。

HDF5由三个主要部分组成：

1. **文件格式**：文件格式实现了数据模型的物理存储，将逻辑上的组、数据集、属性等对象转换为磁盘上的二进制表示。
2. **数据模型**：用于逻辑组织和访问数据的抽象模型，它定义了数据的逻辑结构和相互关系。
3. **软件库**：包含库、语言接口和工具。HDF5软件用C语言编写，包含可选的多语言包装器，为用户提供完整的开发和使用环境。

我们关心的主要是HDF5文件。HDF5 文件是一个用于存储各种科学数据的容器，由组和数据集两种主要类型的对象构成。任何 HDF5 组或数据集都可以有一个相关联的属性列表，这些概念将在后文展开。

## HDF5数据模型

### 核心概念

**HDF5文件**可以被视为一个容器(`组`)，它包含各种异构数据对象(数据集)包括图像图形、表格甚至是文档(PDF或Excel文件)。每个HDF5文件都包含一个`根组`，可以包含其他组或链接到其他文件中的对象。与UNIX文件系统类似，使用路径名来描述对象:

```
路径命名规则
/           # 表示根组
/foo        # 表示根组的成员foo
/foo/zoo    # 表示组foo的成员zoo，foo是根组的成员
```

#### HDF5有数据共享机制
正如官方文档中展示的，对象可以在组之间共享，即一个组可以创建`链接`对象指向(link)另一个组中的对象，从而实现**同一数据可以属于多个逻辑组**。链接是组拥有的对象，每个链接都有一个名称，每个链接指向一个对象，而每个命名对象可以有一个或多个链接指向它。这意味着**HDF5支持有向图结构**，而不仅仅是树结构，即HDF5数据支持`循环引用`，节省磁盘空间并便于数据重组和访问。

```
文件结构
/
├── GroupA/
│   ├── Dataset1
│   └── GroupB/
│       └── GroupC/
│           └── GroupA (链接回到GroupA)
```

其中链接分为`硬链接(Hard Links)`、`软链接(Soft Links)`和`外部链接(External Links)`，具体的实现详和差异详见官方文档。

### 数据对象与数据集

`数据集(dataset)`组织和包含记录的"原始"数据，其数据集本质上是多维数组，而且支持**分块和压缩**。除了数据本身，还包含描述数据的元数据。

`数据类型(Datatypes)`、`数据空间(dataspaces)`、`属性(properties)`和`属性值(attributes)`等`HDF5对象(HDF5 objects)`是用于描述数据集的。

> 其中attributes比较像元信息，properties则是说明该数据集的特点(是否分块压缩等)，因此我将attributes翻译为属性值(孩子瞎写的)。

#### 数据类型(Datatypes)

数据类型描述数据集中的单个数据元素的数值类型，提供了供数据转换的完整信息。


数据类型包括`预定义数据类型(Pre-Defined Datatypes)`和`派生数据类型(Derived Datatypes)`。预定义数据类型又分标准数据类型(Standard datatypes)和原生数据类型(Native datatypes)，标准数据类型是跨平台的，命名格式为*H5T_ARCH_BASE*(如*H5T_IEEE_F32BE*)，ARCH为架构名称，BASE为类型名称。原生数据类型在不同平台上不同，可以简化内存操作(如*H5T_NATIVE_INT*)。

> 其实我一直不知道Naive到底应该怎么翻译，比如QGIS就有一个Naive库我就不知道该怎么翻译，像是“基于平台原生接口实现的内容而非抽象为跨平台的”，但翻译为原生我总是觉得反了hh.

派生数据类型顾名思义是从预定义数据类型派生来的，包含多字符字符串类和复合数据类型类型等。

#### 数据空间(Dataspaces)

数据空间描述数据集数据元素的布局，可以包含**无元素**、**单个元素**（标量）或**简单数组**。数据空间有两个作用: 

1. 维度数量`秩(rank)`是固定的。即当创建这个数据集的时候，必须指明这个数据集是几维的之后就不能变。
2. 维度大小是可变的。虽然在创建这个数据集的时候需要指定每一维的大小用于创建逻辑布局，但是在描述应用程序的数据缓冲区和参与I/O的数据元素是可变的。即HDF5允许在IO的时候直接只读取和操作某一块数据。

> 不过HDF5允许使用分块存储来定义可扩展数据集，其在定义数据集具有特定的初始维度，稍后可以通过H5Dset_extent函数增加维度大小，甚至可以实现类似于 
> hsize_t maxdims[] = {H5S_UNLIMITED, H5S_UNLIMITED}; 
> 具体见文档[Extendible Datasets](https://support.hdfgroup.org/documentation/hdf5/latest/_l_b_ext_dset.html)
#### 属性(Properties)

属性用于**描述HDF5对象的特征或功能**，包含一些常用属性如如连续/分块/压缩等，还可以通过HDF5属性列表API修改以利用更强大的功能。

> 真是第一次看到一个数据结构能自己定义数据特征的。

#### 属性值（Attributes）

属性值是小型元数据对象，用于描述主数据对象的性质和/或预期用途。属性值包含名称和值两部分，可以与HDF5对象关联，通过打开所附加的对象来访问。通常较小，包含关于所附加对象的用户元数据。因此属性值也有数据类型和数据空间，但不支持I/O操作和压缩等。

# HDF5数据辅助工具

`h5dump`是重要的命令行工具，使用数据描述语言(DDL)格式显示HDF5文件内容。 [h5dump介绍](https://support.hdfgroup.org/documentation/hdf5/latest/_h5_t_o_o_l__d_p__u_g.html#sec_cltools_h5dump)

`HDFView`是图形化HDF5文件浏览器，支持数据可视化和编辑。[HDFView介绍](https://support.hdfgroup.org/documentation/hdf5/latest/_learn_h_d_f_view.html)

`Panoply`是NASA开发的一个Coverage数据(nc/grib/HDF5等)查看器，支持数据查看和导出。比较轻量。[Panoply官网](https://www.giss.nasa.gov/tools/panoply/)

# 编译HDF5

## 构建HDF5应用程序
当构建HDF5库时，会包含以下编译Shell脚本：
| 脚本名称 | 功能描述 |
|----------|----------|
| h5cc | 基于pkg-config的HDF5 C程序编译脚本 |
| h5fc | 基于pkg-config的HDF5 Fortran 90程序编译脚本 |
| h5c++ | 基于pkg-config的HDF5 C++程序编译脚本 |
官方推荐使用CMake。而且HDF5的[代码仓库](https://github.com/HDFGroup/hdf5)已经发出公告，即将将打包方式仅统一到CMake，在2025年3月10日以后官方停止使用除CMake之外的打包工具。以下提供命令行的实现，当然也可以使用CMake-GUI或VS的编译工具。

> Heads Up: HDF5 Drops Autotools March 10th
> The day has arrived: the day we've all been dreading—or eagerly anticipating, depending on your perspective. Yes, we're switching to CMake-only builds in HDF5. Prepare yourselves.
> The PR stripping all autotools will go into the "develop" branch on March 10, 2025. HDF5 2.0, scheduled for release in Fall 2025, will only support the CMake build system.
> If you’d like to learn more about this decision, check out this blog post from November 2022: Can we remove the autotools? And the HDF5 2.0 planning wiki. If you use autotools for your builds, now is a great time to update your workflows to CMake.

### 安装预编译版本
如果只是想简单应用，HDF5在各个平台均有预编译版本，可以通过下载镜像或使用包管理器安装。[HDF5镜像中心](https://www.hdfgroup.org/download-hdf5/)

此外CMake还提供了一个script用户快速从源代码中编译二进制文件，感觉在此时讨论的语境中用不到，详见仓库下INSTALL_CMake.txt文件中的说明。

### CMake安装
> **最低CMake版本要求** HDF5 2.0.x：最低CMake版本3.18; VS2022用户：最低CMake版本3.21
> **支持的生成器**  MinGW Makefiles, NMake Makefiles, Unix Makefiles, Visual Studio 15 2017 到 Visual Studio 17 2022, 其中VS16及以后版本需要打开一个编译开关，参考[Compiling HDF5 Applications](https://support.hdfgroup.org/documentation/hdf5/latest/_l_b_compiling.html)
> 注意新版本的CMake需要指定编译为共享库还是静态库。

#### 使用CMakePresets
官方提供为CMake提供了一套开盖即食的配置写在CMakePresets.json中，也可根据自己的需求修改该配置文件，参考文档为[Building with CMake Presets](https://support.hdfgroup.org/documentation/hdf5/latest/cmake-presets.html#sec_cmake_presets_build)(需要CMake版本在3.24以上)

```bash
cmake --workflow --preset ci-StdShar-<compiler-type> --fresh
```
其中compiler-type为在CMakePresets.json找到的当前平台的编译选项，支持GNUC, Cland或MSVC。以下介绍使用CMake的方法

#### (1)源码安装的前提条件

1. **获取源代码：** 可以从Github仓库的开发分支或发行版获取代码，仓库地址为[https://github.com/HDFGroup/hdf5](https://github.com/HDFGroup/hdf5)
2. **获取插件代码：** 插件代码的获取有两种方式，既可以从插件代码仓库下载[https://github.com/HDFGroup/hdf5_plugins](https://github.com/HDFGroup/hdf5_plugins)，也可以让CMake自己下载缺失的插件，通过设置
```bash
HDF5_ENABLE_PLUGIN_SUPPORT:BOOL=ON
HDF5_ALLOW_EXTERNAL_SUPPORT:STRING=<"GIT">/<"TGZ"> #获取来源
```
3. 可以通过设置CMAKE_INSTALL_PREFIX自定义安装地址。

#### (2)设置CMake编译开关

笔者总结了文档中和CMakeLists中提到的主要编译开关以及约束方便查阅和配置，完整配置请查阅文档。

1. General Build Options

| 选项名称               | 选项描述                          | 默认值                |
|------------------------|-----------------------------------|-----------------------|
| BUILD_SHARED_LIBS      | 构建共享库                        | ON                    |
| BUILD_STATIC_LIBS      | 构建静态库                        | ON                    |
| BUILD_STATIC_EXECS     | 构建静态可执行文件                | OFF                   |
| BUILD_TESTING          | 构建HDF5单元测试                  | ON                    |
| HDF5_DISABLE_PDB_FILES | 不安装PDB文件（仅Windows系统）    | 仅Windows：OFF        |
| HDF5_USE_GNU_DIRS   | ON：使用GNU编码标准安装目录；OFF：使用历史设置                            | OFF    |

2. HDF5 Build Options

| 选项名称                     | 选项描述                                  | 默认值 |
|------------------------------|-------------------------------------------|--------|
| HDF5_BUILD_CPP_LIB           | 构建HDF5 C++库                            | OFF    |
| HDF5_BUILD_EXAMPLES          | 构建HDF5库示例                            | ON     |
| HDF5_BUILD_FORTRAN           | 构建FORTRAN支持                           | OFF    |
| HDF5_BUILD_JAVA              | 构建JAVA支持                              | OFF    |
| HDF5_BUILD_HL_LIB            | 构建高级HDF5库（HL Library）              | ON     |
| HDF5_BUILD_TOOLS             | 构建HDF5工具                              | ON     |
| HDF5_BUILD_PARALLEL_TOOLS    | 构建并行HDF5工具                          | OFF    |
| HDF5_BUILD_STATIC_TOOLS      | 构建静态工具（而非共享工具）              | OFF    |

3. HDF5 Advanced Options

| 选项名称                                   | 选项描述                                                                 | 默认值                                  |
|--------------------------------------------|--------------------------------------------------------------------------|-----------------------------------------|
| HDF5_ONLY_SHARED_LIBS                      | 仅构建共享库                                                             | OFF                                     |
| HDF5_ALLOW_UNSUPPORTED                     | 允许不支持的配置选项组合                                                 | OFF                                     |
| HDF5_ENABLE_PARALLEL                       | 启用并行（需MPI）                                                   | OFF                                     |
| HDF5_ENABLE_THREADSAFE                     | 启用线程安全                                                             | OFF                                     |
| HDF5_ENABLE_CONCURRENCY                    | 启用多线程并发                                                           | OFF                                     |
| HDF5_DIMENSION_SCALES_NEW_REF              | 维度缩放API使用新样式引用                                               | OFF                                     |
| HDF5_EXTERNAL_LIB_PREFIX                   | 自定义库命名前缀                                                         | ""                                      |
| HDF5_EXTERNAL_LIB_SUFFIX                   | 自定义库命名后缀                                                         | ""                                      |
| HDF5_DISABLE_COMPILER_WARNINGS             | 禁用编译器警告                                                           | OFF                                     |
| HDF5_ENABLE_ALL_WARNINGS                   | 启用所有警告                                                             | OFF                                     |
| HDF5_SHOW_ALL_WARNINGS                     | 显示所有警告（不抑制内部“嘈杂”警告）                                     | OFF                                     |
| HDF5_ENABLE_COVERAGE                       | 启用库和程序的代码覆盖率                                                 | OFF                                     |
| HDF5_ENABLE_DEBUG_APIS                     | 开启所有包的额外调试输出                                                 | OFF                                     |
| HDF5_ENABLE_DEPRECATED_SYMBOLS             | 启用已弃用的公共API符号                                                   | ON                                      |
| HDF5_ENABLE_EMBEDDED_LIBINFO               | 将库信息嵌入可执行文件                                                   | ON                                      |
| HDF5_ENABLE_PREADWRITE                     | 在sec2/log/core VFD中使用pread/pwrite替代read/write（若可用）             | ON                                      |
| HDF5_ENABLE_TRACE                          | 启用API跟踪功能                                                         | OFF                                     |
| HDF5_ENABLE_USING_MEMCHECKER               | 指示使用内存检查工具                                                     | OFF                                     |
| HDF5_ENABLE_MAP_API                        | 构建map API                                                             | OFF                                     |
| HDF5_GENERATE_HEADERS                      | 重新生成文件                                                             | OFF                                     |
| HDF5_JAVA_PACK_JRE                         | 打包JRE安装目录                                                         | OFF                                     |
| HDF5_NO_PACKAGES                           | 不包含CPack打包                                                         | OFF                                     |
| HDF5_PACK_EXAMPLES                         | 打包HDF5库示例压缩文件                                                   | OFF                                     |
| HDF5_PACK_MACOSX_FRAMEWORK                 | 将HDF5库打包为Frameworks（macOS）                                        | OFF                                     |
| HDF5_BUILD_FRAMEWORKS                      | TRUE：构建为框架库；FALSE：按BUILD_SHARED_LIBS构建                       | FALSE                                   |
| HDF5_PACKAGE_EXTLIBS                       | CPack包含外部库                                                         | OFF                                     |
| HDF5_STRICT_FORMAT_CHECKS                  | 执行严格的文件格式检查                                                   | OFF                                     |
| HDF5_WANT_DATA_ACCURACY                    | 数据转换期间保证数据准确性                                               | ON                                      |
| HDF5_WANT_DCONV_EXCEPTION                  | 数据转换期间检查异常处理函数                                             | ON                                      |
| HDF5_DEFAULT_API_VERSION                   | 启用默认API（v16、v18、v110、v112、v114、v200）                          | "v200"                                  |
| HDF5_USE_FOLDERS                           | IDE中启用项目文件夹分组                                                 | ON                                      |
| HDF5_MSVC_NAMING_CONVENTION                | 共享库使用MSVC命名约定                                                   | OFF                                     |
| HDF5_MINGW_STATIC_GCC_LIBS                 | 静态链接libgcc/libstdc++（MinGW）                                        | OFF                                     |
| HDF5_BUILD_WITH_INSTALL_NAME               | 库安装名称设为安装路径（仅Apple）                                        | OFF                                     |
| HDF5_ENABLE_INSTRUMENT                     |  instrumentation库（仅Debug构建）                                        | OFF                                     |
| HDF5_INSTALL_MOD_FORTRAN                   | 将FORTRAN mod文件复制到include目录                                       | 需结合BUILD_SHARED_LIBS和BUILD_STATIC_LIBS：<br>- 两者都启用/仅共享：SHARED<br>- 仅静态：STATIC |
| HDF5_ENABLE_ANALYZER_TOOLS                 | 启用Clang工具                                                           | OFF                                     |
| HDF5_ENABLE_SANITIZERS                     | 执行Clang sanitizer                                                     | OFF                                     |
| HDF5_ENABLE_FORMATTERS                     | 格式化源文件                                                             | OFF                                     |
| HDF5_BUILD_DOC                             | 构建文档                                                                 | OFF                                     |
| HDF5_ENABLE_DOXY_WARNINGS                  | Doxygen解析有警告时失败                                                 | OFF                                     |
| HDF5_H5CC_C_COMPILER                       | h5cc中使用的C编译器                                                     | ${CMAKE_C_COMPILER}                     |
| HDF5_H5CC_CXX_COMPILER                     | h5cc中使用的C++编译器                                                   | ${CMAKE_CXX_COMPILER}                   |
| HDF5_H5CC_Fortran_COMPILER                 | h5cc中使用的Fortran编译器                                               | ${CMAKE_Fortran_COMPILER}               |

4. HDF5 Advanced Test Options（仅当BUILD_TESTING=ON时生效）

| 选项名称                                   | 选项描述                                                                 | 默认值                                  |
|--------------------------------------------|--------------------------------------------------------------------------|-----------------------------------------|
| HDF5_TEST_SERIAL                           | 执行非并行测试                                                           | ON                                      |
| HDF5_TEST_TOOLS                            | 执行工具测试                                                             | ON                                      |
| HDF5_TEST_EXAMPLES                         | 执行示例测试                                                             | ON                                      |
| HDF5_TEST_SWMR                             | 执行SWMR测试                                                            | ON                                      |
| HDF5_TEST_PARALLEL                         | 执行并行测试                                                             | ON                                      |
| HDF5_TEST_FORTRAN                          | 执行Fortran测试                                                         | ON                                      |
| HDF5_TEST_CPP                              | 执行C++测试                                                             | ON                                      |
| HDF5_TEST_JAVA                             | 执行Java测试                                                            | ON                                      |
| HDF_TEST_EXPRESS                           | 控制测试框架（0-3）                                                      | "3"                                     |
| HDF5_TEST_PASSTHROUGH_VOL                  | 使用不同的passthrough VOL连接器执行测试                                  | OFF                                     |
| HDF5_TEST_FHEAP_PASSTHROUGH_VOL            | 使用不同的passthrough VOL连接器执行fheap测试（需HDF5_TEST_PASSTHROUGH_VOL=ON） | ON                                      |
| HDF5_TEST_VFD                              | 使用不同的VFD执行测试                                                   | OFF                                     |
| HDF5_TEST_FHEAP_VFD                        | 使用不同的VFD执行fheap测试（需HDF5_TEST_VFD=ON）                         | ON                                      |
| HDF5_TEST_SHELL_SCRIPTS                    | 启用shell脚本测试                                                       | ON                                      |
| HDF5_DISABLE_TESTS_REGEX                   | 禁用特定测试的正则表达式模式                                             | ""                                      |
| HDF5_USING_ANALYSIS_TOOL                   | 指示使用分析检查工具                                                     | ON                                      |

**特别注意并行功能与高级API并不兼容！** 包含两层含义(1)并行工具不是线程安全的(2)线程锁没有提到封装的高级API(C++, Fortran, Java, etc)的层级。具体说明请查阅文档。具体地有如下规则：

1. 并行选项(`HDF5_ENABLE_PARALLEL`)与线程安全(`HDF5_ENABLE_THREADSAFE`)，C++接口(`HDF5_BUILD_CPP_LIB`)，Java接口(`HDF5_BUILD_JAVA`)不兼容。
2. 线程安全选项(`HDF5_ENABLE_THREADSAFE`)与高级库(`HDF5_BUILD_HL_LIB`)，C++接口(`HDF5_BUILD_CPP_LIB`)，Fortran接口(`HDF5_BUILD_FORTRAN`)，Java接口(`HDF5_BUILD_JAVA`)不兼容。
3. 多线程并发选项(`HDF5_ENABLE_CONCURRENCY`)与线程安全选项(`HDF5_ENABLE_THREADSAFE`)互斥，与高级库(`HDF5_BUILD_HL_LIB`)，C++接口(`HDF5_BUILD_CPP_LIB`)，Fortran接口(`HDF5_BUILD_FORTRAN`)，Java接口(`HDF5_BUILD_JAVA`)，线程安全(`HDF5_ENABLE_THREADSAFE`)不兼容。

但是所有这些不兼容限制可以通过指定`HDF5_ALLOW_UNSUPPORTED`选项来覆盖，~~如果你知道你在做什么，那么伟大的C语言什么都不会拦着你。~~

#### (3)构建CMake指令

本文的核心目标是构建HDF的并行版本，但是此处我们讨论的并行(平时大家能接触到的)是“单机多核”的模型，即以OpenMP为代表的共享内存模型，既不是CUDA层级的并发也不是MPI层级的跨节点/进程的并行I/O。因此此时应当开启线程安全开关而非并行开关，使用以下编译开关设置: 

```bash
# 创建构建目录，CMake中约定构建目录和源代码目录不能是同一个
mkdir build
cd build

# 配置编译目标Unix Makefiles，安装路径为/usr/local，如果使用VS(windows)自行修改
cmake --fresh .. \
-DCMAKE_BUILD_TYPE=RelWithDebInfo \
-DHDF5_ENABLE_THREADSAFE=ON \
-DHDF5_BUILD_HL_LIB=OFF \
-DHDF5_ENABLE_ALL_WARNINGS=ON \
-DHDF5_BUILD_TOOLS=ON \
-DHDF5_ENABLE_SZIP_SUPPORT=OFF \
-DHDF5_ENABLE_ZLIB_SUPPORT=ON \
-DCMAKE_INSTALL_PREFIX=/usr/local

cmake --build . --config RelWithDebInfo --parallel

# 可以使用正则表达式构造测试项目，详见文档
ctest .

# 安装项目
sudo cmake --install .

# 测试HDF5工具是否能正确使用
which h5dump
```
> RelWithDebInfo编译选项是进行一定编译优化但是保留部分Debug输出用于调试，还有Debug和Developer编译选项支持更复杂和全面的调试方法。
> 以下是文档中提供的外部依赖地址[plugins](https://github.com/HDFGroup/hdf5_plugins), [ZLIB](https://github.com/madler/zlib/releases/download/v1.3.1/zlib-1.3.1.tar.gz), [ZLIBNG](https://github.com/zlib-ng/zlib-ng/archive/refs/tags/2.2.4.tar.gz), [LIBAEC](https://github.com/MathisRosenhauer/libaec/releases/download/v1.1.3/libaec-1.1.3.tar.gz)

如果没有打开`HDF5_ALLOW_UNSUPPORTED`那么编译开关冲突会在build的时候报错，可参考上述编译开关排查。**注意不要使用release提供的压缩包而是直接拉源码，预编译选项在这里有冲突（血泪教训）**

如果从网络获取插件的话需要下载和解压中间一些步骤会比较慢请耐心等待，本项目没启用压缩等插件功能，可自行安装。

#### (4)设置动态库连接

在使用CMake构建并安装HDF5库后，设置HDF5环境变量用于动态库运行(当然也可以自己写启动脚本): 

```bash
# Windows
HDF5_ROOT=C:/Program Files/HDF_Group/HDF5/2.0.x/
PATH=%PATH%;C:/Program Files/HDF_Group/HDF5/2.0.x/bin
HDF5_PLUGIN_PATH=C:/Program Files/HDF_Group/HDF5/2.0.x/lib/plugin
   
# Unix
HDF5_ROOT=<install folder>
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:<HDF5_ROOT>/lib
HDF5_PLUGIN_PATH=<HDF5_ROOT>/lib/plugin
```
至此HDF5已成功配置，可在IDE中进一步配置语法高亮等内容。

### 使用VS编译

> 说真的到今年我才意识到大家被VS惯得太坏了以至于对C程序是如何编译的很少有概念。还有MSVC的ABI实在有很多乱七八糟的东西，所以还是尊重一下。但是**以下内容仅翻译自官方文档并未充分测试，请自行甄别**。

#### 基本设置
1. 64位Windows：在"Platform"下拉菜单中选择"x64"
2. 选择正确的Configuration（Debug、Release、RelWithDebInfo等）
头文件路径设置
3. 修改项目属性: Project → Properties → Configuration Properties → C/C++
4. 包含目录：General → Additional Include Directories
5. 添加头文件路径：例如"C:\Program Files\HDF_Group\HDF5\1.10.9\include"
6. 动态库编译：需要添加"H5_BUILT_AS_DYNAMIC_LIB"定义C/C++ → Preprocessor → Preprocessor Definitions
7. 链接器设置：Project → Properties → Configuration Properties → Linker
8. 附加依赖项：Linker → Input → Additional Dependencies
9. 添加库路径：例如"C:\Program Files\HDF_Group\HDF5\1.10.9\lib\hdf5.lib"
10. *静态构建的外部库时对于C/C++应用程序，需要添加：
```
libhdf5_cpp.lib libhdf5.lib libz.lib libszaec.lib libaec.lib
```
具体的库见文档

# HDF5基础编程操作

## HDF5编程模型和API介绍

### 基本编程范式
HDF5采用面向对象的编程范式，所有操作可以划分为“打开对象”，“访问对象”，“关闭对象”三类基本模式，HDF5库**通过参数依赖关系对操作强制执行顺序约束**:
1. **文件必须在数据集之前打开**，因为数据集打开调用需要文件句柄作为参数
2. **对象可以以任何顺序关闭**
3. **对象一旦关闭，就不能再被访问**

### HDF5 API

C语言API函数前缀以`H5*`开头，其中`*`是单个字母，表示操作对象的类型，常用有:
- `H5A`：Attribute Interface（属性接口）
- `H5D`：Dataset Interface（数据集接口）
- `H5F`：File Interface（文件接口）
- `H5G`：Group Interface（组接口）
- `H5S`：Space Interface（数据空间接口）
- `H5T`：Type Interface（数据类型接口）

> 其他语言API类似，如**Fortran**中函数以`h5*`开头，以`_f`结尾；**Java**中函数名以`H5*`开头，前缀`H5.`作为类名等。像 C++、Java 和 Python 等语言的 API 使用与特定对象相关的方法。具体内容详见文档[Programming Issues-APIs vary with different languages](https://support.hdfgroup.org/documentation/hdf5/latest/_l_b_prog.html)

HDF5除了提供核心API以外，还提供高级API简化常见操作的步骤。高级API提供存储对象的模板且更易于使用。根据文档，HDF5提供以下高级API：

1. **HDF5 Lite APIs (H5LT, H5LD)** 简化创建数据集和属性的步骤；提供便捷的读写函数。
2. **HDF5 Images API (H5IM)** 定义在HDF5中存储图像的标准，提供图像特定的操作。
3. **HDF5 Table APIs (H5TB)** 简化创建表格所需的步骤，提供表格操作的高级接口。
4. **HDF5 Dimension Scales APIs (H5DS)** 提供维度比例存储的标准，支持科学数据的坐标系统。
5. **HDF5 Packet Table APIs (H5PT)** 提供存储包数据的标准，适用于流式数据处理。

但是这些和线程安全模式不是官方兼容的，可以自行查阅相关文档。

### C HDF5数据类型
为了保证跨平台兼容性，HDF5库定义了自己的数据类型：

```c
hid_t    // 用于对象句柄
hsize_t  // 用于维度
herr_t   // 用于返回值
```

如前文介绍，HDF5数据类型可以分为预定义数据类型和派生数据类型两大类。以下列举部分数据类型说明。

**标准数据类型**是我们在HDF5文件中看到的数据类型，通常用于创建数据集时指定存储格式。可分为以下两类: 

1. **原子数据类型类别:** Integer, Float, Character, Bitfield, Opaque(用于存储固定长度的字节序列, 数据对HDF5库是不透明的), Reference, Enumeration.

2. **复合数据类型:** Array, Variable-length(类似C字符串的指针实现，但包含显式长度信息，不同位置的数据元素可以有不同的长度), Compound(类似于C结构体).

> 下文中`大端(Big Endian)`指最高有效字节存储在最低地址，符合人类阅读数字的习惯。`小端(Little Endian)`指最低有效字节（Least Significant Byte, LSB）存储在最低地址，与人类阅读习惯相反。

```c
// 8位整数,16/32/64位同理
H5T_STD_I8BE     // 8位大端有符号整数
H5T_STD_I8LE     // 8位小端有符号整数
H5T_STD_U8BE     // 8位大端无符号整数
H5T_STD_U8LE     // 8位小端无符号整数

// IEEE 754 浮点数,32/64位同理
H5T_IEEE_F16BE   // 16位大端浮点数
H5T_IEEE_F16LE   // 16位小端浮点数

H5T_C_S1         // 单字节，null结尾的8位字符串

H5T_STD_REF      // 对象引用
```

**本地数据类型**类似于C类型名称，HDF5库自动进行转换，可以在用于内存操作简化内存操作。具体类型见参考文档[Datatype Basics](https://support.hdfgroup.org/documentation/hdf5/latest/_l_b_datatypes.html)。

## 第一个程序
完整代码实现请见[basic_operation.c](https://github.com/geoinformation-wuhan/HDF5-OpenMP-CDemo/blob/main/basic_operation.c)以下内容均整理自官方文档"learn basic"栏目。

首先包含头文件依赖并声明一些标识符变量
```c
#include <stdio.h>
#include <hdf5.h>

int main(void) {
    // 声明变量
    const int rank = 2;       /* 数据空间维度数 */
    const int nrow = 4;       /* 数据行数 */
    const int ncol = 6;       /* 数据列数 */
    hid_t file_id;      /* 文件标识符 */
    herr_t status;      /* 函数返回状态 */
    hid_t dataspace_id; /* 数据空间标识符 */
    hid_t dataset_id;   /* 数据集标识符 */
    hid_t attr_id;      /* 属性标识符 */
    hid_t attr_dataspace_id; /* 属性数据空间标识符 */
    hid_t group_id;     /* 组标识符 */
    hid_t subgroup_id;  /* 子组标识符 */
    hsize_t dims[rank];    /* 数据空间维度 */
    hsize_t attr_dims[1]; /* 属性数据空间维度 */
    //...
}
```

需要创建/获取文件ID并在操作后将文件关闭。
```c
int main(void) {
    // 创建新的HDF5文件
    // H5F_ACC_TRUNC: 如果文件已存在，则删除当前内容；如不存在则创建新文件
    // H5P_DEFAULT: 使用默认文件创建属性列表
    // H5P_DEFAULT: 使用默认文件访问属性列表
    // ...声明变量
    file_id = H5Fcreate("example.h5", H5F_ACC_TRUNC, H5P_DEFAULT, H5P_DEFAULT);
    if (file_id < 0) {
        printf("Error: Could not create HDF5 file.\n");
        return -1;
    }
    // ...进一步操作

    status = H5Fclose(file_id);
    return 0;
}
```
根据前文提到的代码组织方式，所有dataset均在group下，以下创建两级group作为示范。
```c
int main(void){
    // ...创建文件
    // 1. 使用绝对路径创建主组
    group_id = H5Gcreate(file_id, "/DataGroup", H5P_DEFAULT, H5P_DEFAULT, H5P_DEFAULT);
    // 2. 使用绝对路径创建子组A
    subgroup_id = H5Gcreate(file_id, "/DataGroup/Matrices", H5P_DEFAULT, H5P_DEFAULT, H5P_DEFAULT);
    H5Gclose(subgroup_id);
    // 3. 使用相对路径创建子组B（相对于DataGroup）
    subgroup_id = H5Gcreate(group_id, "Attributes", H5P_DEFAULT, H5P_DEFAULT, H5P_DEFAULT);
    H5Gclose(subgroup_id);
    // ...进一步操作
    // 关闭组
    H5Gclose(group_id);
    // ...关闭文件
}
```
创建组后可在目标组路径下创建dataset以及属性信息。
```c 
int main(void){
    // ...创建组结构
    // 设置数据空间维度
    dims[0] = nrow;     dims[1] = ncol;
    
    // 创建简单的数据空间-H5Screate_simple的参数：维度数，当前维度，最大维度（NULL表示固定大小）
    dataspace_id = H5Screate_simple(rank, dims, NULL);
    // 在Matrices子组中创建数据集
    dataset_id = H5Dcreate(file_id, "/DataGroup/Matrices/matrix_data", H5T_STD_I32BE, dataspace_id,
                          H5P_DEFAULT, H5P_DEFAULT, H5P_DEFAULT);
    // 创建示例数据
    int data[nrow][ncol];
    for (int i = 0; i < nrow; i++)
        for (int j = 0; j < ncol; j++)
            data[i][j] = i * ncol + j + 1;
    // 写入数据集
    status = H5Dwrite(dataset_id, H5T_NATIVE_INT, H5S_ALL, H5S_ALL,
                      H5P_DEFAULT, data);

    // 创建属性（附加到数据集）
    attr_dims[0] = 2;
    attr_dataspace_id = H5Screate_simple(1, attr_dims, NULL);
    attr_id = H5Acreate(dataset_id, "dimensions", H5T_STD_I32BE, attr_dataspace_id,H5P_DEFAULT, H5P_DEFAULT);
    // 准备属性数据（存储矩阵维度）
    int attr_data[2] = {nrow, ncol};
    // 写入属性
    status = H5Awrite(attr_id, H5T_NATIVE_INT, attr_data);
    // 关闭属性和属性数据空间
    H5Aclose(attr_id);
    H5Sclose(attr_dataspace_id);
    // ...其他操作
    // 关闭数据集
    H5Dclose(dataset_id);
    printf("Dataset closed.\n");
    // 关闭数据空间
    H5Sclose(dataspace_id);
    // ...关闭组
}
```
在写入数据后，可用以下方式从数据库中读取数据，此时dataset需要处于打开状态。
```c
int main(void){
    // ...写入数据
    // 从数据集读取数据
    int data_read[nrow][ncol];
    status = H5Dread(dataset_id, H5T_NATIVE_INT, H5S_ALL, H5S_ALL,
                     H5P_DEFAULT, data_read);
    printf("Matrix data from /DataGroup/Matrices/matrix_data:\n");
    for (int i = 0; i < nrow; i++) {
        for (int j = 0; j < ncol; j++)
            printf("%3d ", data_read[i][j]);
        printf("\n");
    }
    printf("Dividing the %dx%d matrix into four quarters and reading each separately...\n\n", nrow, ncol);
    // 打开已存在的属性
    attr_id = H5Aopen(dataset_id, "dimensions", H5P_DEFAULT);
    int attr_read_data[2];
    // 读取属性数据
    status = H5Aread(attr_id, H5T_NATIVE_INT, attr_read_data);
    printf("Matrix dimensions from attribute: %d x %d\n", attr_read_data[0], attr_read_data[1]);
    // 关闭属性
    H5Aclose(attr_id);
    // ...其他操作
}
```
此外正如前文提到的，HDF支持局部地读取和写入数据，以下展示只读取数据子集，这也为进一步使用OpenMP并行提供基础。
```c
int main(void){
    // 获取数据集的文件数据空间
    hid_t file_dataspace_id = H5Dget_space(dataset_id);
    // 定义四个象限的参数
    struct {
        const char* name;
        hsize_t offset[2];
        hsize_t count[2];
    } quarters[4] = {
        {"Top-Left",     {0, 0}, {nrow/2, ncol/2}},  // 左上角
        {"Top-Right",    {0, ncol/2}, {nrow/2, ncol/2}},  // 右上角
        {"Bottom-Left",  {nrow/2, 0}, {nrow/2, ncol/2}},  // 左下角
        {"Bottom-Right", {nrow/2, ncol/2}, {nrow/2, ncol/2}}  // 右下角
    };
    
    // 循环读取四个象限
    for (int q = 0; q < 4; q++) {
        printf("Reading %s quarter (offset: [%llu,%llu], size: [%llu,%llu]):\n", 
                quarters[q].name, 
                (unsigned long long)quarters[q].offset[0], 
                (unsigned long long)quarters[q].offset[1],
                (unsigned long long)quarters[q].count[0], 
                (unsigned long long)quarters[q].count[1]);
        // 选择文件数据空间的子集（hyperslab selection）
        status = H5Sselect_hyperslab(file_dataspace_id, H5S_SELECT_SET,
                                    quarters[q].offset, NULL,  // stride为NULL表示使用默认值1
                                    quarters[q].count, NULL);  // block为NULL表示使用默认值1
        // 为内存数据创建数据空间（必须与选择的元素数量匹配）
        hid_t mem_dataspace_id = H5Screate_simple(rank, quarters[q].count, NULL);
        // 分配内存来存储子集数据
        int quarter_size_0 = (int)quarters[q].count[0];
        int quarter_size_1 = (int)quarters[q].count[1];
        int quarter_data[quarter_size_0][quarter_size_1];
        // 读取子集数据
        status = H5Dread(dataset_id, H5T_NATIVE_INT, mem_dataspace_id, file_dataspace_id,
                        H5P_DEFAULT, quarter_data);
        for (int i = 0; i < quarter_size_0; i++) {
            for (int j = 0; j < quarter_size_1; j++)
                printf("%3d\t", quarter_data[i][j]);
            printf("\n");
        }
        // 关闭内存数据空间
        H5Sclose(mem_dataspace_id);
        printf("\n");
    }
    // 关闭文件数据空间
    H5Sclose(file_dataspace_id);
}
```

> 我在实验的时候发现一个有意思的现象，实际上对HDF5的读写操作是IO瓶颈的，分配内存时并行化的加速比轻松达到物理核数量，但是在读写时甚至是串行代码更快，读者可使用[openmp_operation.c](https://github.com/geoinformation-wuhan/HDF5-OpenMP-CDemo)亲自试验。在这种场景下需要使用MPI等方法进行并发(进一步的讨论可见[Write many datasets at the same time using OpenMP](https://forum.hdfgroup.org/t/write-many-datasets-at-the-same-time-using-openmp/6624/2))，OpenMP只适合计算加速。但使用线程安全的库依然是有益的，因为大部分的性能开销依然会来自计算。这一部分内容笔者在研究后（也许）会继续更新吧。