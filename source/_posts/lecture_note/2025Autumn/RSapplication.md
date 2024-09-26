---
categories:
  - LectureNote
tags:
  - lecture
  - RS
title: 遥感应用模型课程笔记
mathjax: true
description: 遥感应用模型课程笔记(更新中)
date: 2024-09-03 00:00:00
---

> 徐世武,中国地质大学(武汉) 地理与信息工程学院

# 遥感应用模型绪论
在构建遥感应用模型时的一个关键问题是确定模型在有效性上的侧重.遥感应用水平要提高,遥感定量化是必由之路.

遥感数据获取具有多层次,多时相,多功能,多专题的特点;在应用方面具有多元数据处理,多学科综合分析,多维动态监测和多用途的特点.

遥感应用模型是**地球信息模型**发展的一个重要分支,是**概念模型**,**物理模型**和**数学模型**的综合集成.用遥感信息中的独立变量和地理信息影像化的变量,针对像元做**基于物理机理**的数学模型运算(DCNN), 而不能过分依赖于非参方法.

### 遥感应用模型这门课关心的主题: 
- 空间几何分析
- **遥感定量模型**
- **地表反演模型**

### 点云是新本体的最佳选择
要真正实现地理实体多重表达(多测合一)需要回归地理信息本身的本体.
激光雷达点云+高精度几何标记给构建本体提供了一个有力手段.
激光雷达点云包含网络码,XYZ空间信息,RGB可视化信息和BAND特征选择等.

### 自然资源统一调查检测

| 类型 | 优点 | 缺点 |
| -- | -- | -- |
| 基于像元的变化检测 | 对变化非常敏感 | 噪声很大 |
| 面向对象的变化检测 | 很稳定 | 不敏感 |
| 综合检测 | 结合像元方法和对象方法 |  |
| 面向典型地物的变化检测 | | |
| 深度学习的变化检测 | 自动化程度高,精度高 | 运算多数据需求大,是黑箱 |

> 遥感图像处理常用关键技巧
> 1. 物理机理
> 2. 分块&合并
> 3. 膨胀&侵蚀: 方便解译&精确边界

# 遥感定量模型建模
> 应用模型是实现分析结果定量化的手段,定量遥感是遥感技术发展从粗放到精确的飞跃.(梁顺林)

## 遥感应用不确定性分析理论和方法
### 一些基本概念
`误差` 观测值与真实值之间的差别
`精度` 观测计算或估计值域真实值之间的接近程度
`精确程度` 测量精度
`不确定度` 表达信息的不确定性或不可知性

> 早期研究集中在遥感分类或解译结果的精度评价,而目前集中在分类不确定性研究,<u>对反演中的不确定性研究较小,定量遥感不确定性的研究是一个研究热点,是决策者关心的指标</u>.

### 不确定性来源
1. **数据获取** 几何关系,传感器系统,卫星平台,地面控制,地面景影响
2. **数据处理** 几何校正,辐射校正,数据转换
3. **数据分析** 定量分析,分类,数据综合
4. **数据转换** 栅格-矢量转换

**不确定性避免方法** 摄法纠正数据获取过程引入的不确定性;选取合适的,对误差不敏感的处理和分析方法,使最后提取的信息包含最好的不确定性.

### 不确定性问题分类
- 反演不确定性
- 分类不确定性

#### 不确定性问题研究方法分类
- 基于误差矩阵
- 基于模糊评价
- 基于像元尺度不确定性评价
- 其他方法

`遥感数据分类不确定性评价体系`要**统一**,将分类方法的像元尺度上的遥感分类不确定性评价**模型与指标体系独立**.

> 用多层感知器(MLP)可以很好处理模糊性问题

### 反演不确定性研究
聚焦于数据**产品验证**
真实性检验的数据产品包括地表反射率,地表温度,雪冰图,反照率,BRDF,植被指数,叶面积指数,植被覆盖度,土地覆被等.

#### *真实性检验三阶段
- 通过选择少量测量点和时间段的地面测量数据进行产品真实性检验
- 对时空范围更高的地面测量点和测量时间段的数据进行产品真实性检验
- 在统计上具有全球时空分布代表性的产品真实性检验

#### 真实性检验框架-自下而上
基本构成是根据不同的地表类型或生物群落的全球分布，在全球设置一定数据量的真实性检验样地，每个样地内有**若干基本采样单元**，每个ESU内进行一定数量的单点调量，然后通过一定的转换方法将单点测量值转换到ESU尺度上：再结合高分辨率遥感影像，建立**基本采样单元与样地之间的尺度转换关系**。得到样地水平上的地表参数值：最后，通过全球**不同地表类型多个样地与陆地遥感数据产品**进行比较和**相关性分折**，评价全球遥感数据产品的精度.

### 专题分类不确定性研究
1. 目视判断,定性评价
2. 通过比较分类得到的专题度中各类别面积范围和地面数据比较
3. 一定位类别比较和精度测量为特征,将特定位置的分类结果中的类别和地面实况和其他参考数据中相应点的类别进行比较
4. 混淆矩阵评价

### 误差评价
1. `混淆矩阵` 每个地表真实像元的位置和分类与分类图像中的响应位置和分类像比较计算.
2. `错分误差` 指被氛围用户感兴趣的类而实际不是,是混淆矩阵的行
3. `漏分误差` 指本属于地表真实分类但没有被正确分类,是混淆矩阵的列

## 定量遥感信息模型与反演
## 土地利用/覆盖自动更新技术
## 农田旱情遥感监测模型与方法