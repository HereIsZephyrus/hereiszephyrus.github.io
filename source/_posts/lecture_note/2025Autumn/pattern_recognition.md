---
categories:
  - LectureNote
tags:
  - lecture
  - RS
title: 模式识别课程笔记
mathjax: true
description: 模式识别课程笔记(更新中)
date: 2024-09-02 00:00:00
---

> 田玉刚,中国地质大学(武汉) 地理与信息工程学院

# 模式识别基本概念
`模式(pattern)`存在于时间,空间中**可观测的事物**,具有时间或空间分布的**信息或规律**.`模式类`相应地是**具有某些共同特征的模式的集合**.
从另一个角度而言,`模式`是事物的标准样式,`特征`是客体共有特性的抽象概念,`范式`是符合某一种级别的关系模式的集合,表示一个关系内部各属性之间的联系的合理化程度.

`模式识别`是用计算机实现人对各种事物或现象的各种形式的信息进行处理,分析,描述,判断与解释.

> 在做模式识别的时候,探索性统计是非常重要的,可以先看一下直方图

模式识别利用海量的数字数据,其中的**非结构化**的数据是模式识别的难点.

## 模式识别分类
| 名称 | 表达 | 识别函数 | 判定准则 |
| -- | -- | -- | -- |
| 模板匹配 | 样本,像元,曲线 | 相关,距离度量 | 分类错误 |
| 统计方法 | 特征 | 决策函数 | 分类错误 |
| 句法方法 | 基元 | 准则,语法 | 接受错误 |
| 神经网络 | 样本,像元,特征 | 网络函数 | 均值方差错误 |
### 模板匹配
首先对每个类别建立一个活多个模板,然后将输入样本和数据库中诶个类别的模板进行比较,计算相关关系或距离.然后根据相似性(相关性/距离)进行决策.
### 统计方法 
根据训练样本建立决策边界.
- 统计决策理论-- 根据每一类总体的概率分布决定决策边界
- 判别式分析方法-- 给出带参数的决策边界,根据某种准则,由训练样本决定"最优"参数


### 句法方法
许多复杂的模式可以分解为简单的子模式即`基元`.每个模式都可以由基元根据一定的关系来组成.基元即词语,每个模式可以认为是一个`句子`,词语之间的关系是`语法`.那么**模式的相似性由句子的相似性来决定**.**优点**是适合结构性强的模式, **缺点**是抗噪声能力差,计算复杂度高.

### 神经网络
神经网络是**进行大规模并行计算的数学模型**.具有学习,推广,自实行,容错,较大和计算能力.**优点**是可以有效的解决一些复杂的非线性问题,**缺点**是缺少有效的学习理论.

## 模式识别系统
1. **信息获取**通过传感器将光或声音等信息转换为电信息.
2. **预处理**包括A/D,二值化,图像平滑,变换,增强,恢复,滤波等.主要是图像处理.
3. **特征抽取与选择**在测量空间的原始数据通过变换获得在特征空间最终能反映分类本质的特征.
4. **分类器设计**通过训练确定判定规则,使按此类别规则分类时,错误率最低.把这些判决建成标准库.
5. **分类决策**在特征空间中对被识别对象进行分类.

# 模式识别任务
## 特征抽取
### 形状特征
任何物体的形状特征可由其`几何特征`,`统计属性`和`拓扑属性`来描述.
可供选择的几何特征: 周长,面积,偏心率,欧拉数,角点,横轴长度和纵轴长度等.
### 颜色特征
颜色具有**旋转不变性**和**尺度不变性**.大部分系统都采用颜色比例分布作为颜色基本特征,即图像领域中的直方图法.
`相似度量`是如何使用数值有效表示图像在颜色上的相似程度的问题.相似度量是直接影响识别效果的重要环节,在模式识别中,<u>特征的相似度量均采用举例法,</u>即特征的相似程度用特征向量的空间距离表示.

#### Spectral Angle Mapper (SAM)
Spectral Angle Mapper (SAM) is a physically-based spectral classification that uses an n-D angle to match pixels to reference spectra. The algorithm determines the spectral similarity between two spectra by calculating the angle between the spectra and treating them as vectors in a space with dimensionality equal to the number of bands. This technique, when used on calibrated reflectance data, is relatively insensitive to illumination and albedo effects. 

SAM是一种用于遥感图像分析和光谱分类的算法，主要用于识别和分类地物或材料。它通过比较光谱特征来评估不同物体之间的相似性。
SAM 的核心思想是将光谱数据视为高维空间中的向量，并通过计算光谱向量之间的角度来评估相似性。具体步骤如下：

1. **光谱向量化**
将每个地物的光谱特征表示为一个向量，通常是在多光谱或高光谱图像中提取的。
2. **计算角度**
对于待分类的光谱向量和参考光谱向量，计算它们之间的夹角。
光谱角的定义为 (Kruse et al., 1993): 
$$
\theta(x,y) = \cos^{-1} (\frac{\sum_{i=1}^n x_iy_i}{\sqrt{||x||^2 \cdot ||y||^2}})
$$
其中: 
$x$是参考光谱的光谱特征向量,$y$是训练区域的光谱特征向量,$n$为光谱数.

3. **相似性评估**
角度越小，表示两个光谱向量越相似，反之则越不同。则最小角度光谱向量$x$使得: 
$$
x \in C_k \Leftrightarrow \theta(x,y_k) < \theta(x,y_j) \forall k \neq j
$$

其中$C_k$是第$k$中土地覆盖,$y_k$是$k$类的光谱特征,$y_j$是$j$类的光谱特征.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/SAMexample.png)