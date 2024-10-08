---
categories:
  - LectureNote
tags:
  - lecture
  - GIS
title: 空间统计与分析课程笔记
mathjax: true
description: 空间统计与分析课程笔记
abbrlink: 4cd094ab
date: 2024-02-26 00:00:00
---
# 绪论

空间分析两条技术路径
1. GIS --- 空间分析
2. CS --- 数据分析 

地理信息科学的任务是分析综合应用地理科学和GIS技术分析地学现象
## GIS相关研究应用领域
- 数据生产 : 描述
- 工具开发 : 解释
- 空间分析 : 应用
## 空间统计在做什么事情
- 传统统计学 : 数值统计
- 地图可视化 : 将属性值映射到地图中
- 空间统计学 : 将映射后的数据进行数据统计分析并赋予地理学解释 --- 从描述到分析
**空间统计学关心的问题是在什么地方发生了什么事情**
to find the parttern, trend, process and relation of Geo-data.
空间统计基本单元 : 地点
    地名属性的动态性和模糊性

# 地理信息分析的概念和挑战
## 空间概念基础
### 距离
- 笛卡尔/欧式距离
- 曼哈顿距离
- 球面距离
- 网络距离

### 领域
基于距离衡量的邻接的空间邻域
### 相互作用
## 空间分析定义
1. 描述: 使用GIS技术清晰描述显示世界.
2. 分析: 试图理解现实世界中某种**模式**及其产生**过程**.
    *理解过程可以挖掘其科学本质,做出更好的决策*

作用在空间上的过程产生了模式,但是在观察时间断面时无法观察时间上连续的过程.不过,我们可以通过观察若干连续断面可以一定程度识别理解过程.
即,**空间分析的目的**是<u>识别和描述模式,进一步识别和理解过程</u>.

### 空间分析四个层次
#### 1. 空间数据描述
- 重点在对现实世界描述,并用数字化形式表示

#### 2. 探索性空间数据分析
- 寻找模式和可能的解释,使用数据图表和地图可视化.

#### 3. 空间统计分析和假设检验
#### 4. 空间建模和预测
- 构建模型(过程)以预测空间结果(模式),如建立回归模型预测点位置模型

## 空间分析中的关键问题
### 1. 空间自相关
### 2. 可变面元问题
可变面元问题(MAUP)包含三部分: 
1. **分区效应**同样的尺寸和单元数,但是边界不一样时结果可能产生差异.
> 这揭示了把某组单元上的研究结果推广到其他区域可能是危险的.
> 分区效应揭示了空间异质性不可忽略.
*空间异质性: 现象在空间的分布并不是均匀的.
2. **尺度效应**增加尺寸减少单元数结果可能产生差异.
> 聚合函数选取要考虑数据特征
3. **个体效应(生态谬论)** 某个聚合数据(地理单元)上的结论不能应用到个体上.
> 因为分析过程没有考虑全部因素(遗漏变量),从而无法揭示相关性和因果关系之间的练习.

### 3. 边界效应
> 每个研究区都有边界
> 研究区外的数据会对研究区内的数据产生影响(空间自相关)
> 无数据的地图边界对结果影响很大

可能的解决方案:
- 引入核心/外围概念
- 引入环的概念

# 空间分布的描述性统计

## intro-传统统计分析
### 1. 描述统计Descriptive sataistics
- **描述**样本的**统计特征**
- 计算少数数值来描述所有数据,通过`概述性指标`描述数据集.

#### 三种类型的统计量
1. 集中趋势: 平均值mean,中位数median,众数mode,etc
2. 离散程度: 方差,标准差
3. 频数分布: 正态分布,偏态分布(正偏态--右)
### 2. 推断统计Inferential statistics
- 研究如何根据样本数据去**推断总体数据特征**.

## 空间统计
### 数据属性的测度特征
#### 名义属性norminal
对**地理实体的分类**,名义属性包括数字,文字,甚至颜色.<u>对数字的名义属性进行运算没有任何意义.</u>

> 名义属性只有等或不等的判断

#### 序数属性 ordinal
序数属性的类型存在**等级关系**,<u>序数属性的算数运算没有任何意义.</u>

> 序数属性不能做算术运算,但可以做等级比较,即可以生成结果集.

#### 间距属性 interval
**一个值对另一个之的差异幅度,而不是该值与真实零点之间的差值**.因此<u>数量运算受到限制,加减运算有效,乘除运算无意义</u>.

#### 比率属性 ratio
**数值与真实零点之间的差异幅度**的度量,两个比数值之间的<u>加减乘除运算是有效的</u>.

### 属性数据的连续特征
#### 连续性数据
取值从理论上不间断,在任意区间内都可以无限多个取值,可以无线的细分到任意小数位.

#### 离散型数据
不连续数据,数值之间是间断的,即只能取任意区间中的部分值.

### 属性数据的结构特征
#### 结构化数据
数值型属性

#### 非结构化数据
图片,文字,音频,视频
> 我们希望多元数据能够相互印证.

### 描述性空间统计Centrographic Statistics
1. 集中趋势指标: 中心,质心,加权中心,最小距离中心
> 质心不一定在多边形内部(新月形)

**加权平均中心**
$$
\begin{cases}
\bar{X} &= \frac{\sum_{i=1}^n w_i x_i}{\sum_{i=1}^n w_i}\\
\bar{Y} &= \frac{\sum_{i=1}^n w_i y_i}{\sum_{i=1}^n w_i}
\end{cases}
$$
**最小距离中心(中值中心)**
最小距离中心也叫最小旅行中心.
该点是**到每个点的加权距离之和的最小的点**(MD).通过迭代算法估计,可能有多个点满足.
$$
f = \min \sum d_{iMD}
$$

2. 离散程度指标: 标准距离,极值距离,标准距离椭圆.
> 对分布中心指标的补充

**标准距离方差**
$$
\sqrt{\frac{\sum_{i=1}^n (X_i-\bar{X}_{mc})^2+\sum_{i=1}^n (Y_i-\bar{Y}_{mc})^2}{N}}
$$
**标准差椭圆**
- 标准差椭圆从二维角度反映了点的分布特征,分布的各项异性.
- 三个定义参数: 旋转角度,长轴(最大离散程度方向),短轴.
- 长半轴$a$主要反映了`数据分布的方向`,短半轴$b$主要反映了`数据分布的范围`.**短半轴越短表示数据呈现的向心力越明显**,反之,短半轴越长,表示数据的离散程度越大.扁率$\frac{a}{b}$越大说明数据方向性越明显.
**核密度估计**
- 点模式的"视觉增强"
- 探测性空间数据分析
1. 简单核(离散量统计)
简单核的枚举对象是**栅格单元**.
- 以栅格单元为中心,定义个半径为r邻域.
- 统计数量
- 计算密度(点数/核面积)
2. 密度核(密度函数统计)
密度核的枚举对象是**兴趣对象**.
- 对每一个点定义一个核函数(如二次核函数,跟一口钟一样)
- 计算单元密度值(所有核函数值在该处的和)

## 标准推断统计
> 从观察到的模式推断潜在过程.

| 总体 | 样本 | 参数 | 统计量 |
| -- | -- | -- | -- |
| 一组特定研究元素的全部的集合 | 总体的子集 | 根据总体计算 | 根据样本计算 |

`统计量是对参数的估计`,因此统计量的选取--合适的样本很重要.

### 抽样分布
随机抽样
抽样误差: <u>由于抽取样本的随机性所造成的样本值与总体值之间的差异</u>,也称为代表性误差.
抽样分布: 样本统计量的概率分布.
标准误: 抽样分布的标准差
标准误是样本统计量偏离总体参数的程度.标准误越大,越难拒绝零假设.
## 空间推断统计
### 点模式分析
> How to measure and test if spatial patterns are clustered or dispersed.
#### 检验过程
待检验的分布模式
- 点呈现聚集分布
- 点呈现离散分布
- 点呈现随机分布
1. 随机or不随机
    零假设: 空间随机模式
    备择假设: 空间模式不是随机的,聚集or离散

2. 若不随机,聚集or离散
    零假设: 空间聚集模式
    备择假设: 空间离散模式

#### 检验方法
1. 基于点的密度-- 样方分析法quadrat analysis
    **把一个$(x,y)$的二维坐标转换为一维的数量统计量**
    $\sum_{i=1}^{q} m_i = n$
    1. 生成格网,每个单元格作为一个样方
    2. 统计每个样方中的点数m
    3. 计算方差/均值比$VMR = \frac{Variance}{Men}$

| 均匀分布 | 完全随机分布 | 完全聚集模式 |
| -- | -- | -- |
| VMR=0 | VMR=1(泊松分布,K-S检验) | VMR>>1(卡方检验) |

2. 基于点对之间的关系-- 最近邻分析Nearest neighbor

3. 基于距离的检验方法Nearest-Neighbor Index(NNI)
$NNI$描述的事每个点到其他点的平均距离

$$
NNI = \frac{\text{Observed Average Distance}}{\text{Expected Average Distance}}
$$

$$
NNI = \frac{\bar{d}}{E(\bar{d})}
$$
where $\bar{d}=\frac{\sum_{i=1}^n d_i}{n}$,$E(\bar{d}) = 0.5 \cdot \sqrt{\frac{A}{n}}$ .$A$为研究区面积.

- For random pattern: NNI = 1
- For clustered pattern: NNI = 0
- For dispersed pattern: NNI = 2.149

可以发现$NNI$指数与$A$的选取是相关联的.对$A$不同的选取会产生完全不同的结果,从而我们采取下列方法对$NNI$的计算进行修正: 

1. 检查空间中是否相对的存在聚集效应
$$
G(d) = \frac{\#(d_{\min}(S_i)<d)}{n}
$$
where,$S_i$代表第$i$个点,$n$为总点数.

2. 检查空间中总体上分布是否相对均匀(是否去中心的)

$$
F(d) = \frac{\#[d_{\min}(\mathbf{p}_i,S)<d]}{m}
$$
where,$\mathbf{p}_i$表示选取的第$i$个中心,$m$表示中心点数量.

> 一阶效应和二阶效应
> **一阶效应是指一个变量对结果的直接影响,关注的是单个变量对结果的直接影响**.它表示变量的单位变化对结果的变化量,通常用斜率来表示一阶效应.如果一阶效应为正,表示变量的增加与结果的增加正相关;如果一阶效应为负,表示变量的增加与结果的减少负相关.
> **二阶效应是指一个变量对结果的间接影响,关注的是多个变量之间的相互作用对结果的影响**.它表示变量的变化与其他变量之间的交互作用,二阶效应通常用曲率或交互项来表示.二阶效应描述的是变量之间的相互影响,即当两个或更多的变量同时变化时,它们之间的关系如何影响结果.

考察$G$和$F$在各个距离的斜率就可以知道点在不同距离的分布.

3. 检查聚类的直径和聚类之间的距离Ripley K(d)

$$
K(d) = \frac{\sum_{i=1}^n \#[S \in C(\mathbf{s}_i,d)]}{n \lambda}
$$

K(d)函数的问题: 
- Dependent on study area boundary(边界效应)
- Affected by circle radii selected(步长和起始距离)
- Each point has unit value -- no magnitude or quantity(无法构造更复杂的线性函数)

### 空间自相关
**How to define spatial autocorrelation?**

#### 1. Base on Tober's Law(the first law of geography)

> Everything is related to everything, but near things are more related than distant things.

So spatial autocorrelation is a **degree of relative similarity**.

we call `lag-x` or `wx` replacing of  `y` in the scatter of spatial autocorrelation.

two patterns : Positive spatial autocorrelation; Negative spatial autocorelation.

#### 2. Base on Similarity

> The degree to which characteristics at one location are similar(or dissimilar) to those nearby.

`Similarity` is a futher description of spatial autocorrelation than Tober first law of geography.

#### 3. Based on Probability

> Measure of the extent to which the occurence of an event in one geographic unit makes more probable, or less probable, the occurence of a similar event in a neighboring unit.

If this attribute shows a spatial autocorrelation, it creates a **"field"**.

The concept of clustered, random or dispersed is the spatial autocorrelation of location itself!

get further...

#### 4. Using correlation

> The correlation between an ovservation's value on a variable and the value of near-by observations on the same variable.

*Correlation = "Similarity", "association", or "relationship".*

**Why are standard statistical tests wrong?** The assumption of independence failed.

**If spatial autocorrelation exists:**
1. Correlation coefficients bigger than they really are.
2. More likely to appear "statistically significant".

### Measuring Spatial Autocorrelation
> to solve the problem of measuring "nearness" or "proximity" by computer science.

Row-standardized geographic contiguity matrices

## Global Measures of Spatial autocorrelation

### Global Measures and Local Measures

- Global Measures: A single value which applies to the entire data set.
- Local Measures: A value calculated for each observation unit

### How to measure
#### Join Count Statistic
- Polygons only
- biary data only
- Based on examining polygons which share a border

Test Statistic given by: 
$$
Z = \frac{\text{observed} - \text{expected}}{\text{SD of expected}}
$$

Expected: 
$$
\begin{cases}
    E(J_{BB}) &= k \cdot p_B^2 \\
    E(J_{WW}) &= k \cdot p_W^2 \\
    E(J_{BW}) &= 2k \cdot p_Bp_W \\
\end{cases}
$$

#### Moran's I
> THe most common measure of Spatial Autocorrelation.


#### Geary's C

#### Grtis-ord G

### Local Indicators of Spatial Association(LISA)
> Moran's I is most commonly userd, and the local version is often called Anselin's LISA, or just LISA.

What are we doing?
- The statistic is calculated for each areal unit in the data.
- For each polygon, the index is calculated based on neighboring polygons with which it shares bordens.
- Since a measure is avaliable for every polyen, these can be mapped to indicate how spatial autocoreelation varies over the study regon.

## Spatial Regression
What is spatial regression doing?

To figure out the spatial relation bwteen bivariate or multivarivate.

**clearfication**: 
- univariate: All measures so far have focused on one variable at a time
- bivariate: Often we are interested in the association or relationship between two vaiables.
- multivariate: Or more than two variables.

**Correlation and Regression**
> Mathematically, they are identical.

Correlation means relationship or association but no direction or causation is implied.

Regression means implies but doesn't prove, trying to make out independent variable how predict dependent variable.

### Simple Linear regression
Concerned with predicting one varable from another variable.

$$
Y = a + bX + \epsilon
$$

a - interpret
b - X correlation coeffcient

Ordinary Least Squares(OLS)

**Always look at your data. Don't just rely on the statistics.**

### Fix SA
...

### Spatial regression
#### 1. Spatial Autoregressive Models
**Spatial lag model**
$$
Y = \beta_0 + \lambda WY + X \beta + \epsilon
$$
$W$ is the spatial weights matrix. Consider lag-x as the second independent variable.

**Spatial error model**
$$
Y = \beta_0  + X \beta + \rho W \epsilon + \xi
$$

$W$ is the spatial weights matrix. $\xi$ is "white noise".

## 空间插值
> 注意,很多数据的**采样是点数据**,本质是**场数据**,常常**绑定在面属性**上.

