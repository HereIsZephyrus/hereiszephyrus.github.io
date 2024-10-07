---
categories:
  - Blog
tags:
  - notes
  - GIS
title: 地理加权回归模型学习笔记
mathjax: true
description: 一些关于basic GWR的介绍,推导和部分衍生模型的介绍
date: 2024-06-10 00:00:00
---

> 节选自GIS算法课程作业，具体(引用)详见PDF

# 地理加权回归模型基本原理

地理加权回归模型 (geographically weighted regression, GWR)是一种局部回归模型，其基本形式为:

$$
    Y_i = \beta_0(u_i,v_i) + \sum_{k=1}^{p}X_{ik} \beta_k(u_i,v_i) + \varepsilon_i, i = 1, 2,\ldots , n
    \tag{1}
$$

其中$y_i$为因变量,$x_{ij}$表示第$i$个样本的第$j$个变量,$(u_i,v_i)$表示第$i$个样本的经纬度坐标，
$\beta_i = [\beta_1(u_i,v_i),\beta_2(u_i,v_i),\ldots,\beta_p(u_i,v_i)]^T$表示第$i$个样本第$j$个变量的回归系数。

其中$W_i$为距离加权矩阵，为对角矩阵:

$$
    W_i = 
    \begin{pmatrix}
        w_{i1} & 0 & \cdots & 0 \\
        0 & w_{i2} & \cdots & 0 \\
        \vdots & & \ddots & \vdots \\
        0 & 0 & \cdots & w_{in}
    \end{pmatrix}
    \tag{2}
$$

其中对角线值$w_{ij}$表示第$j$个数据点到回归分析点$i$的权重值。
加权函数称为核函数(kernel function)，根据值域分布特折可分为连续型和截断型。卢宾宾教授总结了常用的核函数如下:

$$
    \begin{aligned}
        &\text{Gaussian: } w_{ij} = \exp [-\frac{1}{2} (\frac{d_{ij}}{b})^2]  \\
        &\text{Exponential: } w_{ij} = \exp (\frac{|d_{ij}|}{b} ^2) \\
        &\text{Box-car: } w_{ij} = \begin{cases} 1 & d_{ij} \leq b \\ 0 & d_{ij} > b \end{cases}\\
        &\text{Bi-square: } w_{ij} = \begin{cases} (1 - (\frac{d_{ij}}{b})^2)^2 & d_{ij} \leq b \\ 0 & d_{ij} > b \end{cases} \\
    \end{aligned}
    \tag{3}
$$

其中$w_{ij}$为第$i$个样本到第$j$个样本的距离权重，$d_{ij}$为两点间距离，$b$为带宽。
其中Gussian核函数和Bi-square核函数是最常用的核函数，但截断型核函数对GWR的"局部"这一语义有更好的解释性，但容易造成投影矩阵奇异，在实际运用中需要权衡考量。

其最小二乘估计方程正规化形式为:

$$
    \begin{aligned}
        L_(\beta_i)&= \sum_{j=1}^{n} w_{ij} \cdot (y_j - \beta_{i0}(u_i,v_i)- \sum_{k=i}^{p}X_{jk} \beta_{ik}(u_i,v_i))^2 \\
        \hat{\beta_i}&= argmin_{\beta_i} L(\beta_i)
    \end{aligned}
    \tag{4}
$$

结果可表示为:

$$
    \hat{\beta_i} = (X^T W_i X)^{-1} X^T W_i y, i = 1, 2,\ldots , n
    \tag{5}
$$

从而可根据$\hat{\beta}$构建投影矩阵$S$:

$$
    S = 
    \begin{pmatrix}
        x_1(x^T W_1 x)^{-1} x^T W_1 \\
        \cdots \\
        x_n(x^T W_n x)^{-1} x^T W_1 \\
    \end{pmatrix}_{n \times n}
    \tag{6}
$$

则可以发现其$S$在观测值$x_{ij}$确定时由加权矩阵$W_i$确定，进一步的在函数形式和距离$d_{ij}$计算方式确定时$W_i$由带宽$b$唯一确定，
因此选择合适带宽是求解GWR的关键步骤。若带宽过小会导致局部模型过拟合，带宽过大则可鞥导致GWR模型趋于全局化。
从此视角出发可将GWR模型分为固定型带宽和可变型带宽两种形式。固定型带宽需要人为试验确定合适的带宽，可变型带宽则通过依据$S$构建损失函数确定最佳带宽$b$。
目前基于修正赤池信息量准则 (Akaike information criterion, $AIC_c$)和交叉验证 (cross validation, $CV$)方法被广泛使用，其表达式为:
$$
    \begin{aligned}
        AIC_c &= 2 n \ln (\hat{\sigma}) + n \ln (2\pi ) + n \frac{n + tr(S)}{n-2-tr(S)} \\
        CV(b) &= \sum_{i=1}^{n} [y_i - \hat{y}_{\neq i}(b)]^2
    \end{aligned}
    \tag{7}
$$

其中$\hat{\sigma}$为最小二乘估计结果的标准差，$tr(S)$为投影矩阵$S$的迹，最佳带宽的选择原则是使得选定指标最小。
Lu等近年来还提出了使用Minkowski方法实现寻优带宽等方法，为GWR带宽寻优选取提供了更多选择。
同时回归的残差平方和 (residual sum of squares,$RSS$)和 校正决定系数(adjusted $\text{R}^2$)可以反映模型的预测精度和拟合优度，
将其与一般线性回归模型 (Original Linear Regression Model, OLS)的相关诊断统计量比较可以体现GWR模型相对于OLS方法的改进程度。
一般地，当$ALC_c$的变化值大于3时可以认为模型结果之间具有显著不同。

# 地理加权回归衍生模型及其应用
## 解释异质性的内涵
方创琳院士等对新城市化区域对城乡差异的异质性影响研究中提出了解释异质性的两种内涵:

- 自变量的变化对因变量的影响不一致。
- 自变量对因变量的影响大小和方向随因变量的变化而变化。

其中第一种异质性被广泛考虑，表现为局部回归模型中各地点上自变量对因变量的解释程度不同，
而第二种异质性并没有广泛揭示，而GWR模型已经具有根据局部回归量统计性描述的不同提供异质性的直观解释。
但基本的GWR模型受限于要将全部变量统一到统一尺度，且较难考虑变量在时间上的分布特征，使得其对地理现象的时空异质性的描述不够充分。
因此在近十几年来一些新的GWR衍生模型得到构建和运用，以下简单介绍两类GWR衍生模型。

## 使用地理加权回归模型解释时空二维异质性

GTWR模型的基本形式是在GWR模型的基础上将二维的空间位置增加时间维度为三维的时空位置:

$$
    Y_i = \beta_0(u_i,v_i,t_i) + \sum_{k=1}^{p}X_{ik} \beta_{k}(u_i,v_i,t_i) + \varepsilon_i, i = 1, 2,\ldots , n
    \tag{8}
$$

然而由于时间和空间具有不同的度量单位，且时间距离与空间距离的"接近度"度量并不相同，因此需要定义时空接近度。
记$d^{ST}_{ij}$为$i$和$j$两点间的距离，则:

$$
    d^{ST} = d^S \otimes d_T = \lambda d^S + \mu d^T  = 
    \sqrt{\lambda [(u_i - u_j)^2 + (v_i - v_j)^2] + \mu (t_i - t_j)^2}
    \tag{9}
$$

其中$\lambda$和$\mu$为空间和时空距离的权重参数。则对于Gaussian核函数和bi-square等使用二次项的核函数，
以Gaussian核函数为例其回归权重为:

$$
    \begin{aligned}
        w_{ij} &=\exp \{ - \frac{\lambda [(u_i - u_j)^2 + (v_i - v_j)^2] + \mu (t_i - t_j)^2}{h^2_{ST}} \} \\
        & = \exp\{ - [\frac{(u_i - u_j)^2 + (v_i - v_j)^2 }{h^2_{S}} + \frac{(t_i - t_j)^2 }{h^2_{T}} ]\} \\
        & = \exp\{ - \frac{d^S_{ij}}{h^2_{S}} \} \times \exp \{ \frac{d^T_{ij}}{h^2_{T}} \}  
        = w^S_{ij} \times w^T_{ij}
    \end{aligned}
    \tag{9}
$$

更一般地可以表示为:

$$
    w_{i_{\langle S,T \rangle}}^{(t)} = k_S(d^S_{ij},b_S) \times k_T(d^T_{ij},b_T)
    \tag{10}
$$

其中$k_S$和$k_T$是空间和时空距离的权重函数，$b_S$和$b_T$是空间和时空距离的带宽参数，$d^S_{ij}$和$d^T_{ij}$是空间和时空距离。
相应地，将式(2)中的空间距离加权矩阵$W$拓展为时空距离加权矩阵:

$$
    W_i = diag(
        W_{i_{\langle S,T \rangle}}^{(t)},
        W_{i_{\langle S,T \rangle}}^{(t-1)},
        \ldots,W_{i_{\langle S,T \rangle}}^{(t-q)})
    \tag{11}
$$

$W_i$为分块矩阵，表示在空间上取$n$个数据点和在时间上去$q$取个时刻，其中:

$$
    W_{i_{\langle S,T \rangle}}^{(t)} = diag(
        w^{t}_{i1_{\langle S,T \rangle}},
        w^{t}_{i2_{\langle S,T \rangle}},
        w^{t}_{i{n_t}_{\langle S,T \rangle}})
    \tag{12}
$$

其中$w^{t}_{ij_{\langle S,T \rangle }}$是数据点在$t$时刻根据两点的时空距离得到。

进一步地可使用交叉验证的方式来确定最佳带宽参数$b_S$和$b_T$:

$$
    CV(b_S,b_T) = \sqrt{\sum_{i=1}^{n}\frac{(y_i - \hat{y}^{(-i)}(b_S,b_T))^2}{n}}
    \tag{13}
$$

将时间异质性纳入模型，其具体为:

$$
    CV(b_{St},b_{S(t-1)},\ldots,b_{S(t-q)},b_T) = \\\sqrt{\sum_{i=1}^{n}\frac{(y_i - \hat{y}^{(-i)}(b_{St},b_{S(t-1)},\ldots,b_{S(t-q)},b_T))^2}{n}}
    \tag{14}
$$

以上我们将二维回归模型推广到三维回归模型。
此外黄波教授团队还提出了时空地理加权自回归(geographically and temporally weighted autoregressive regression, GWTAR)模型
以及Liu, Yang等提出的时空地理加权逻辑回归 (geographically and temporally weighted logistic regression, GWTALR)模型，此处不再展开。

## 使用MGWR提取自变量在空间分布解释异质性

因此可以发现，传统的GWR模型需要将各自变量数据统一到同一尺度下即使用同一带宽，而不同的自变量可能具有不同的最佳带宽。
fotheringham在SGWR和距离-变量对应的地理加权回归
(geographially weighted regression with parameter-specific distance metrics, PSDM GWR)模型，卢宾宾教授在2015年进一步改进了他的带宽确定方法，提出了多尺度地理加权回归 (multiscale geographically weighted regression, MGWR)模型，
突破了所有自变量需要使用同一带宽的限制，使更强大的多尺度回归模型的构建成为可能。
MGWR的基本形式可写作:

$$
    Y_i = \beta_0(u_i,v_i) + \sum_{k=1}^{p}X_{ik} \beta_{bwk}(u_i,v_i) + \varepsilon_i, i = 1, 2,\ldots , n
    \tag{15}
$$

即将式(1)的$\beta_k$从依赖于自变量$k$的值修正为同时依赖自变量$k$与该自变量选取带宽$bw$的值。
由于回归方程的建立在此时依赖于带宽的选取，从而原先基于最小化$AIC_c$的带宽选择方法不再适用。
因此卢宾宾教授和Fotheringham教授在2017年分别提出了使用back-fitting的方式确定各自变量的最佳带宽的方法，
其基本思想是通过改变参数估计和带宽选取的顺序采用先确定回归系数$\beta$，
再依据$\beta$确定带宽$\tau$并不断迭代的方法，依次确定各自变量的最佳带宽，
从而得到$\hat{\beta}$。算法可描述如下:

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/GWR_principle.png)

从地理学角度出发，该变量的最佳带宽即为该自变量对因变量解释程度最大的最佳地理尺度。
而一个自变量的最佳地理尺度可以反映在该样本集中自变量的空间异质性:
若该变量带宽较大，即说明其在各个局部对因变量的解释程度接近，即其解释异质性较低；
相反若该变量带宽较小，即说明其在各个局部对因变量的解释程度差距较大，即其解释异质性较高。

但是，由于在MGWR中不同变量使用了不同带宽，使得GWR模型的推断难以进行。该问题将在后文进一步讨论。

## 使用GWQR提取自变量在因变量值分布解释异质性
地理加权回归模型可以识别解释变量对因变量的影响是否存在空间异质性，
但是传统的GWR模型使用最小二乘法对局部模型进行拟合，即主要反映了数据的均值特征，而对于数据的分布特征解释程度较弱。
Koenker与Bassett在1978年在中位数回归方法上进一步发展了分位数回归 (quantile regression)基本形式为:

$$
Y_i = X_i^T \beta^\tau + \varepsilon_i    
\tag{16}
$$

其中$\beta^\tau$表示对$y$的$\tau^{th}$分位数回归的系数，
其含义为$q_\tau (x_i) \equiv \inf \{ y:F(y|X_i) \geq \tau \}= X_i^T \beta^\tau$,有$P(Y \leq Q_Y(\tau)) = \tau$,
并有$P(\varepsilon \leq 0) = \varepsilon$。

其正规化形式为:

$$
    \begin{aligned}
        L(\beta) &= \sum_{i=1}^{n}\rho_\tau(y_i - x_i \beta) \\
        \hat{\beta}(\tau) &= argmin_{\beta} L(\beta)
    \end{aligned}
    \tag{17}
$$

最小，其中$\rho_\tau$为修正函数，有$\rho_\tau(u) = u \cdot [\tau - I(u<0)]$,
$I(\cdot) = 
\begin{cases}
    1 & u < 0 \\
    0 & u \geq 0
\end{cases}$
为判定函数。

Chen等人将其引入GWR模型并提出了地理加权分位数回归模型(geographically weighted quantile regression, GWQR)，并使用该技术在不同人口占比分位数下各自变量的显著性指数。
该模型能更好地反映以因变量不同分位数的为目标下各解释变量的影响，
并且通过QR解决了GWR中不同地区残差项独立但不同分布的问题，从而提高了模型的解释能力。
GWQR的基本形式为:

$$
    Y_i = \beta_0(u_i,v_i) + \sum_{k=1}^{p}X_{ik} \beta_k^\tau(u_i,v_i) + \varepsilon_i^\tau, i = 1, 2,\ldots , n
    \tag{18}
$$

其中$\tau^{th}$分位数的含义为:

$$
    q_\tau (X_i,u_i,v_i) = X_i^T \beta^\tau(u_i,v_i) = \beta_0(u_i,v_i) + \sum_{k=1}^{p}X_{ik} \beta_k^\tau(u_i,v_i)
    \tag{19}
$$

chen提出的估计方式为:

$$
    \beta_k^\tau (u_i,v_i) \approx \beta_k^\tau(u_0,v_0) + \beta_k^{\tau(u)}(u_0,v_0)(u - u_0) + \beta_k^{\tau(v)}(u_0,v_0)(v - v_0)
    \tag{20}
$$

对于$(u_0,v_0)$的一个邻域$(u_0,v_0)$,其中

$$
\beta_l^{\tau(u)} (u_0,v_0) = \frac{\partial}{\partial u} \beta_k^\tau (u,v) \mid _{(u,v) = (u_0,v_0)},
\beta_l^{\tau(v)} (u_0,v_0) = \frac{\partial}{\partial v} \beta_k^\tau (u,v) \mid _{(u,v) = (u_0,v_0)}
\tag{21}
$$

从而将原先的$\beta$估计方法式(4)中的损失函数修改修改为:

$$
    L_i(h) = \sum_{i =1}^{n} \rho_t (Y_i - \tilde{X_i}^T \theta^\tau (u_0,v_o)) \cdot K(\frac{d_{ij}}{h})
    \tag{22}
$$

其中$\tilde{X_j}$和$\mathbf{\theta_i}^\tau(u_i,v_i)$分别为对$X$和$\beta$及其邻域的线性估计，即
$\tilde{X_j} = [1,X_{j1},X_{j2},\ldots,X_{jp},(u_j-u_i),X_{j1}(u_j-u_i),X_{j2}(u_j-u_i),\ldots,X_{jp}(u_j-u_i),(v_j-v_i),X_{j1}(v_j-v_i),X_{j2}(v_j-v_i),\ldots,X_{jp}(v_j-v_i)]^T$,
$\mathbf{\theta}^\tau (u_i,v_i)= [\beta_0^\tau(u_i,v_i),\ldots,$ \\$\beta_p^\tau(u_i,v_i),\beta_0^{\tau(u)}(u_i,v_i),\ldots,\beta_p^{\tau(u)}(u_i,v_i),\beta_0^{\tau(v)}(u_i,v_i),\ldots,\beta_p^{\tau(v)}(u_i,v_i)]^T$。

从而在GWQR模型中设立不同的分位数，可以进一步地解释各自变量对因变量的不同分位值的贡献情况。
例如分位数$\tau$接近1时，其回归系数大的自变量对因变量的高值影响较大，
而分位数$\tau$接近0时，其回归系数大的自变量对因变量的低值影响较大。
通过对自变量对不同分位数的因变量的解释程度可以衡量其在因变量上的解释异质性。

其余部分与GWR处理方法基本保持一致，但是使用$AIC_c$作为最佳带宽确定准则的方式不再适用,为此chen对其构建交叉验证得分求解的方法,表达式为:

$$
    CV(h) = \sum_{i=1}^{n}\rho_\tau (Y_i - \hat{q}_\tau^{(-i)}(X_i,u_i,v_i))
    \tag{23}
$$

使得$CV(h)$最小即为最佳带宽的位置。

实际上使用$CV$值寻找最佳带宽本身也是在基本的GWR模型中寻找最佳带宽被广泛使用的方法,而由于其可以很好地求解广义加性模型,使得$CV$值在GWR模型求解中有了更多应用,在PDF中有完整叙述。

{% pdf /pdf/GWRmodel.pdf %}