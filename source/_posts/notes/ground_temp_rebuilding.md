---
categories:
  - Blog
tags:
  - RS
  - notes
title: 地温重建方法笔记
draft: true
description: 一些基本的单通道方法的推导
mathjax: true
---
# 地温重建方法笔记

> 后来看到一篇博客写的很好,分享一下: https://www.cnblogs.com/enviidl/p/16285384.html

## 构建地温计算方程
单通道 (single-channel)方法是一种被广泛使用的用于从遥感数据重建地表温度的方法,其核心是根据热辐射收支平衡原构建的辐射传输方程和则计算地表热辐射强度.

对于遥感星上在$\lambda$波长观测的辐射值$L_{\lambda}^{sensor}$构建基本辐射传输方程为:

$$
L_{\lambda}^{sensor} = [
        \varepsilon B(\lambda,T_s) + 
        (1 - \varepsilon) L_{\lambda}^{atm \downarrow} \tau_\lambda +
        L_\lambda^{atm \uparrow}]
$$


其中$L_{\lambda}^{atm \downarrow}$是大气中向下穿过的辐射值,$L_\lambda^{atm \uparrow}$是大气向上穿过的辐射值,$\varepsilon$为地表发射的辐射值,$T_s$为待求地表温度值.而$B(\lambda,T_s)$是温度为$T_s$的黑体辐射值,根据普朗克辐射定律当$\lambda$单位为 $\mu$m时:

$$
B(\lambda,T_s) = \frac{c_1 \lambda^{-5}}{\exp(\frac{c_2}{\lambda T_s}) - 1}
$$

其中定标常数$c_1  = 1.19104 \times 10^8 (w \cdot \mu m^4 \cdot m^{-2} \cdot sr^{-1})$,
$c_2 = 1.43877 \times 10^4 (\mu m \cdot K)$.

由于辐射值与地表温度被揭示线性相关,因此可对其使用泰勒展开并忽略高阶项简化计算:

$$
B(\lambda,T_s) = B(\lambda,T_{sensor}) + 
    \frac{\partial B(\lambda,T_{sensor})}{\partial T} (T_s - T_{sensor})
$$

其中偏微分结果由下式给出:

$$
\frac{\partial B(\lambda,T_{sensor})}{\partial T} = 
    \frac{\int (\partial B(\lambda,T_{sensor} / \partial T) f(\lambda) d \lambda)}{\int f(\lambda)d \lambda}
$$

其中$T_{sensor}$为基于传感器结果得到的温度数据,$f(\lambda)$表示表示给定波段的频谱响应函数.由 (Wang, et al. 2016)提供的模拟结果可以近似地认为:

$$
\frac{\partial B(\lambda,T_{sensor})}{\partial T} = a T_{sensor} + b
$$

其中$a$和$b$分别为传感器参数,对于LandSat8的热传感器$a = 0.001190$,$b = -0.21298$,确定系数$R^2 = 1$.

联立得到
$$
T_s = \{ (1 - \varepsilon \tau)L_{sensor} - [1 + (1 - \varepsilon) \psi] \varphi\}(\varepsilon \tau \gamma)^{-1} + T_{sensor}
$$

其中:
$$
\begin{aligned}
        \psi&= \frac{L_{\lambda}^{atm \downarrow} \tau(\theta)}{L_{\lambda}^{atm \uparrow} } \\
        \varphi&=L_{\lambda}^{atm \uparrow} \\
        \gamma&=a T_{sensor} +b
    \end{aligned}        
$$

整理得到,三个辐射参数 (地表发射的辐射值$\varepsilon$,传感器辐射值$L_{sensor}$和传感器获得温度$T_{sensor}$)和三个大气参数 ($\tau$,$\psi$, and$\varphi$)是计算地表温度$T_s$所需的参数.

## 获取计算参数
### 获取大气参数
大气参数受到众多大气成分的影响,其中大气水分含量 (water vapor)的变化最大且影响对热辐射吸收能力最强,而其他成分则相对稳定.
因此可对大气参数关于水汽含量建模:

$$
\begin{pmatrix}
        \tau \\
        \psi \\
        \varphi_b \\
        \Delta \varphi_l \\
        \Delta \varphi_t 
    \end{pmatrix}
    =
    C
    \cdot
    \begin{pmatrix}
        w^2 \\
        w \\
        1
    \end{pmatrix}
    =
    \begin{pmatrix}
        c_{11} & c_{12} & c_{13} \\
        c_{21} & c_{22} & c_{23} \\
        c_{31} & c_{32} & c_{33} \\
        c_{41} & c_{42} & c_{43} \\
        c_{51} & c_{52} & c_{53} \\
    \end{pmatrix}
    \cdot
    \begin{pmatrix}
        w^2 \\
        w \\
        1
    \end{pmatrix}
$$

本文使用 (Wang, et al. 2016)基于MODTRAN 4模拟结果得到的Landsat8卫星传感器校正系数:

$$
C_{L8B10} = 
    \begin{pmatrix}
        -0.0027 & -0.0978 & -0.9949 \\
        0.0404 & -0.4839 & -2.0436 \\
        -0.0389 & 1.2263 & -0.4706 \\
        0.1709 & -0.9764 & 0.5466 \\
        0.0219 & -0.1080 & 0.0741
    \end{pmatrix} 
$$

### 获取地表辐射发射值
许多地表辐射发射值计算方法被发展,其中以TES算法,NDVI阈值法和基于地表真值的方法被广泛应用.本文使用基于NDVI阈值的方法计算地表辐射发射值.

$NDVI$阈值法使用两个$NDVI$阈值$NDVI_s$和$NDVI_v$将土地分为裸地 $(NDVI < NDVI_s)$,
植被茂盛 $(NDVI_v < NDVI)$和混合 $(NDVI_s < NDVI < NDVI_v)$三种类型.从而计算植被覆盖度为:

$$
P_v=(\frac{NDVI - NDVI_s}{NDVI_v - NDVI_s})^2
$$

并构建地表辐射发射值$\varepsilon_\lambda$计算方程:

$$
\varepsilon_\lambda = 
    \begin{cases}
        a_\lambda + b \lambda \rho_{red} &, NDVI < NDVI_s \\
        \varepsilon_{v \lambda} P_v + \varepsilon_{s \lambda} (1 - P_v) + C_\lambda     &, NDVI_s \leq NDVI < NDVI_v \\
        \varepsilon_{v \lambda} + C_\lambda &, NDVI_v \leq NDVI
    \end{cases}
$$

其中$\rho_{red}$为红色波段的反射率值,系数$a$和$b$为查阅光谱数据得到.$\varepsilon_{v \lambda}$是植被的辐射发射值,$\varepsilon_{s \lambda}$是裸地的辐射发射值,$C_\lambda$一个考虑到表面粗糙度引起的空腔效应的项,由下式给出:

$$
C_\lambda = (1 - \varepsilon_{s \lambda} \varepsilon_{v \lambda}) \cdot F' \cdot (1 - P_v)
$$

其中$F'$是一个0到1之间的几何参数,为了简化计算,我们根据经验结果对植被茂密类型的区域取$C = 0.005$,
对于混合类型的区域按土地利用类型设置不同的$F'$值:

### 获取遥感辐射亮度值
对遥感影像进行辐射校正后即可获得星上辐亮度,并根据公式进行亮温换算:

$$
T = \frac{K_2}{\ln (\frac{1}{K_1 / L} + 1)}
$$

其中$K_1$,$K_2$为辐射校正常数,查阅元数据信息可知对于Landsat8数据产品$K_1 = 774.8853$,$K_2 = 1321.0789$.