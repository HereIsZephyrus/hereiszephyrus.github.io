# 模型初步定量说明

**`气象前提`**: 接近正午的无云微风中纬度城市.

## 太阳辐射输入

#### 太阳方位
对于使用的经过mosaic的遥感影像, 查阅其组成的若干幅影像的metadata, 根据拍摄时间: (1)计算第$i$幅影像拍摄时的太阳高度角(altitude)$\beta_i$和太阳方位角(azimuth)$\Omega_i$并计算平均: 

$$
\begin{cases}
\beta &= \frac{\sum_{i = 1}^n \beta_i}{n} \\
\Omega &= \frac{\sum_{i = 1}^n \Omega}{n}
\end{cases}
\tag 1
$$

视为当前影像的太阳方位.
(2)查找太阳常数$E_0$和为以日地平均距离为单位的日地距离$D$.

#### 遥感得到地面辐亮度

经大气衰减的地面辐照度$E$来源于太阳直射光$E_s$和天空漫射光$E_d$. 在天气情况良好的情况下, 城乡各区域AVL在白天性质基本相同, 在UBL下有差异, 将这样的差异综合为透射率$\tau$的差异. 则大气衰减后的地面目标辐射亮度$L_{G}$为: 

$$
L_G = \frac{\rho}{\pi}(E_s + E_d) = \frac{\rho}{\pi}(\frac{E_0}{D^2}\cos \theta \cdot \tau + E_d)

\tag 2
$$

其中$\theta$为太阳天顶角(zenith).

$\rho$为地面目标的半球反射率, 由于已经在统计尺度上将单一LCZ地面视为均匀表面, 可将其当做朗伯体以表现这种均一性. 那么物体的表面反射率与半球反射率相同. 特定$\lambda$的观测为: 

$$
L_{G,\lambda} = \frac{\rho_\lambda}{\pi}(\frac{E_0}{D^2}\cos \theta \cdot \tau_\lambda + E_{d,\lambda})

\tag 3
$$

## 地表温度估计

### 构建地温方程

单通道 (single-channel)方法是一种被广泛使用的用于从遥感数据重建地表温度的方法,其核心是根据热辐射收支平衡原构建的辐射传输方程和则计算地表热辐射强度.

对于遥感星上在$\lambda$波长观测的辐射值$L_{\lambda}^{sensor}$构建基本辐射传输方程为:

$$
L_{\lambda}^{sensor} = [
        \varepsilon B(\lambda,T_s) + 
        (1 - \varepsilon) L_{\lambda}^{atm \downarrow} \tau_\lambda +
        L_\lambda^{atm \uparrow}]

\tag 3
$$


其中$L_{\lambda}^{atm \downarrow}$是大气中向下穿过的辐射值,$L_\lambda^{atm \uparrow}$是大气向上穿过的辐射值,$\varepsilon$为地表发射的辐射值,$T_s$为待求地表温度值.而$B(\lambda,T_s)$是温度为$T_s$的黑体辐射值,根据普朗克辐射定律当$\lambda$单位为 $\mu$m时:

$$
B(\lambda,T_s) = \frac{c_1 \lambda^{-5}}{\exp(\frac{c_2}{\lambda T_s}) - 1}

\tag 5
$$

其中定标常数$c_1  = 1.19104 \times 10^8 (w \cdot \mu m^4 \cdot m^{-2} \cdot sr^{-1})$,
$c_2 = 1.43877 \times 10^4 (\mu m \cdot K)$.

由于辐射值与地表温度被揭示线性相关,因此可对其使用泰勒展开并忽略高阶项简化计算:


$$
B(\lambda,T_s) = B(\lambda,T_{sensor}) + 
    \frac{\partial B(\lambda,T_{sensor})}{\partial T} (T_s - T_{sensor})

\tag 6
$$

其中偏微分结果由下式给出:

$$
\frac{\partial B(\lambda,T_{sensor})}{\partial T} = 
    \frac{\int (\partial B(\lambda,T_{sensor} / \partial T) f(\lambda) d \lambda)}{\int f(\lambda)d \lambda}

\tag 7
$$

其中$T_{sensor}$为基于传感器结果得到的温度数据,$f(\lambda)$表示表示给定波段的频谱响应函数.由 (Wang, et al. 2016)提供的模拟结果可以近似地认为:

$$
\frac{\partial B(\lambda,T_{sensor})}{\partial T} = a T_{sensor} + b

\tag 8
$$

其中$a$和$b$分别为传感器参数,对于LandSat8的热传感器$a = 0.001190$,$b = -0.21298$,确定系数$R^2 = 1$.

联立得到
$$
T_s = \{ (1 - \varepsilon \tau)L_{sensor} - [1 + (1 - \varepsilon) \psi] \varphi\}(\varepsilon \tau \gamma)^{-1} + T_{sensor}

\tag 9
$$

其中:
$$
\begin{aligned}
        \psi&= \frac{L_{\lambda}^{atm \downarrow} \tau(\theta)}{L_{\lambda}^{atm \uparrow} } \\
        \varphi&=L_{\lambda}^{atm \uparrow} \\
        \gamma&=a T_{sensor} +b
    \end{aligned}        
\tag {10}
$$

整理得到,三个辐射参数 (地表发射的辐射值$\varepsilon$,传感器辐射值$L_{sensor}$和传感器获得温度$T_{sensor}$)和三个大气参数 ($\tau$,$\psi$, and$\varphi$)是计算地表温度$T_s$所需的参数.

### 获取计算参数
#### 获取大气参数
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

\tag {11}
$$

使用 (Wang, et al. 2016)基于MODTRAN 4模拟结果得到的Landsat8卫星传感器校正系数:

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

#### 获取地表辐射发射值
许多地表辐射发射值计算方法被发展,其中以TES算法,NDVI阈值法和基于地表真值的方法被广泛应用.本文使用基于NDVI阈值的方法计算地表辐射发射值.

$NDVI$阈值法使用两个$NDVI$阈值$NDVI_s$和$NDVI_v$将土地分为裸地 $(NDVI < NDVI_s)$,
植被茂盛 $(NDVI_v < NDVI)$和混合 $(NDVI_s < NDVI < NDVI_v)$三种类型.从而计算植被覆盖度为:

$$
P_v=(\frac{NDVI - NDVI_s}{NDVI_v - NDVI_s})^2 \tag {12}
$$

并构建地表辐射发射值$\varepsilon_\lambda$计算方程:

$$
\varepsilon_\lambda = 
    \begin{cases}
        a_\lambda + b \lambda \rho_{red} &, NDVI < NDVI_s \\
        \varepsilon_{v \lambda} P_v + \varepsilon_{s \lambda} (1 - P_v) + C_\lambda     &, NDVI_s \leq NDVI < NDVI_v \\
        \varepsilon_{v \lambda} + C_\lambda &, NDVI_v \leq NDVI
    \end{cases}

\tag{13}
$$

其中$\rho_{red}$为红色波段的反射率值,系数$a$和$b$为查阅光谱数据得到.$\varepsilon_{v \lambda}$是植被的辐射发射值,$\varepsilon_{s \lambda}$是裸地的辐射发射值,$C_\lambda$一个考虑到表面粗糙度引起的空腔效应的项,由下式给出:

$$
C_\lambda = (1 - \varepsilon_{s \lambda} \varepsilon_{v \lambda}) \cdot F' \cdot (1 - P_v)

\tag{14}
$$

其中$F'$是一个0到1之间的几何参数,为了简化计算,我们根据经验结果对植被茂密类型的区域取$C = 0.005$,
对于混合类型的区域按土地利用类型设置不同的$F'$值.


### 大气光学特性

考察任意LCZ volume上方大气, 记其反射率为$R$, 透射率为$T$, 吸收率为$A$, 且有$A + R + T = 1$, 由于在晴朗条件下, 故使用和地温计算使用的同一套大气参数得大气吸收的能量和地表接受的能量.

## LCZ内能量平衡

### 垂直方向能量交换

不考虑地表下能量交换, 看做**地面热通流$Q_G$为关于地温$T_0$的函数**: 
$$Q_G = f(T_0) \tag {15}$$

已知**地气表面显热交换**: 

$$\frac{Q_H}{Q_G} = \frac{\mu_a}{\mu_s} \tag{16}$$

在空气垂直方向: 

$$
\frac{\partial T_a}{\partial t} = \frac{1}{C_a}(\text{div} Q_z^* + \text{div} Q_{Hz}) \tag{17}
$$

其中$C_a$为大气热导率, 使用经验项.

地表长波上行: 

$$L_{\uparrow}=\epsilon T_0^4 + (1 - \epsilon)L_{\downarrow} \tag{18}$$

在匀质LCZ中, $Q_{Hz}$由$L_{\uparrow}$决定. 不过一般性将三个热流项抽象表示关于$T_0$的函数(equlibrium surface temperature)为: 

$$
\begin{cases}
L_{\uparrow} &= f(T_0) & \\
Q_H &= f \frac{\Delta T_a}{\Delta z} = f \frac{T_2 - T_0}{z_2 - z_0}T_0 & \text{boundary } T_a(z) \\
Q_E &= f \frac{\Delta q}{\Delta z} = f \frac{q_2 - q_0}{z_2 - z_0} & \text{boundary } q(z) \\
Q_G &= f \frac{\Delta T_s}{\Delta d} = f \frac{T_2 - T_0}{d} & \text{boundary } T_s(z) \\
\end{cases}

\tag{19}
$$

其中长波下行项区分天空和建筑: 

$$
L_{\downarrow} = L_{\downarrow,sky} +  L_{\downarrow,env} \tag{20}$$

### LCZ内部能量收支
对于自然(郊区)表面和城市表面分别建立能量平衡方程: 

$$
\begin{cases}
\text{rural:} & Q^* = Q_H + Q_E + Q_G \\
\text{urban:} & Q^* + Q_F = Q_H + Q_E + \Delta Q_S + \Delta Q_A
\end{cases}

\tag{21}
$$

自然表面情况使用基本的地表能量收支进行表述(需要进一步补充). 以下考察不透水面项.

其中$Q^*$由太阳辐射通量进行估算. $Q_F$为人工排放为独立项, $\Delta Q_A$在下文表达.

对于不透水面, 土壤湿度情况和植被情况直接反映了$Q_E$, 使用经验方程$\lambda = k Q_E / (Q^* - \Delta Q_S)$表达,$k$为线性拟合项.

$\Delta Q_S$则与建筑表面积和建筑材料相关. **在较大尺度的研究中约定建筑外立面和建筑屋顶的物理性质相近并不做区分.** 那么外立面总表面积和总体的储热能力可以估算.(这一部分和大气交互需要补充.)

人为排放$Q_F$无法直接观测, 但是其出口为近地表大气,即只对湍流项($Q_H$和$Q_E$)和$\Delta Q_A$产生影响. 进一步的为了计算方便,将对$Q_E$的增加划转给$Q_H$.

## 水平运动 $\Delta Q_A$和边界过程

### 主要道路分割情况

宽路的能量收支差异主要来源于不同反照率带来的能量差异, 根据遥感数据可计算各个LCZ的平均反照率. canyon系统的反照率估算为: 

$$
\alpha_{surf} = \frac{W_{\alpha,floor}+ H(\alpha_{LCZ1}+ \alpha_{LCZ2})}{H_1 + H_2 +W}
\tag {22}
$$

其中$H_1$和$H_2$分别为两个LCZ的UCL高度. 峡谷的吸收效率可表示为: 

$$
R_C = \frac{1 - \alpha_{top}}{1 - \alpha_{surf}} \tag{23}
$$

### 跨LCZ显热对流

平流是跨LCZ显热对流的主要组成部分, 垂直分量可由两者同高度空气温差$\frac{\partial T_a}{\partial z}$控制, 水平对流由于前沿效应的存在使用与式(17)相同的法则表示: 

$$
\frac{\partial T_{ax}}{\partial t} = \frac{\gamma |\vec{u}|}{C_a}(\text{div} Q_z^* + \text{div} Q_{Hz}) \tag{24}
$$

其中$\gamma |\vec{u}|$是用风速表示的对流交换强度因子.(没有考虑清楚).