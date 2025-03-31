---
categories:
  - Blog
tags:
  - Note
  - Ecology
title: 城市热岛热岛模式学习笔记
mathjax: true
description: 城市热岛热岛模式学习笔记
date: 2025-03-27 00:00:00
---
# 构建城市热岛遥感同化模型使用的相关概念整理与辨析

这段时间学习了城市地表的生态过程之后发现自己之前对城市生态过程和城市热岛的认知非常浅薄, 并且之前的认知和看到的文献中的方法和结论存在相当多的问题. 因此在开展城市热岛相关研究前需要先对涉及的相关概念和尺度进行辨析, 这些内容来自TR oke教授等人写的*Urban Climates*这本书.

>  这本书非常厚,内容非常凝练和全面, 看了几个章节有很大的收获. 我才发现之前在学遥感应用模型的时候学习的地表生态过程都是自然表面(森林, 农田等), 赵英时老师的教材对城市地表生态过程几乎没有涉及, 导致我对城市的地表生态过程的认知有很大偏差(这也是很多材料和文献中存在的问题). 实际上城市中的生态过程与自然表面相比在根本上有差异.

## 城市的各个边界与其能量交换形式

### 城市气候学中各个名词的尺度

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/urban_morphological_units.png)

这一个表格很好地划分了城市形态单元的尺度. "城市热岛"是一个城市(City)尺度的现象, 但是其成因和机理是亚城市尺度的. 其中Oke等指出构建Neighbourhood尺度的LCZ可以比较好的反应一个局地的气候特点, 可以通过对其中的Blocks进行刻画和统计得到. 对于卫星遥感手段,Block和Canyon可以说是获取LCZ表面和边界特征的最小尺度.

### 城市地气表面

活动表面的定义是研究任何环境边界层气候的重要第一步.在我们说地表时我们可能有以下内涵: 

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/surface_potential_definitions.png)

习惯上, 理论完全地表是(a)类型, 卫星遥感观测到的地表是(d)类型, 体感上(冠层)是(e)类型. 关于地表热岛和冠层热岛将在下文讨论, 相应的城市地表大气分层可刻画为: 

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/day_urban_layers.png)

这个模型是进行进一步讨论的基础. 其中UCL是我们人类活动的表面, UBL是城市对气候影响的范围. 这一范围中可分出混合层(Mixed layer)和地表层(Surface layer)两层. 城市的郊区的ML都较稳定且性质十分相近, 在无风时可看做只有垂直运动和能量交换. 在表层中, RSL是显著受地表影响的子层, 包含大量的湍流运动, 而ISL也不能简单地简化为垂直运动. 对于这些分层的性质不进一步展开只做概念说明.并鉴于这些分层和性质, 我们将对城市中的透水面和不透水面分开讨论, 分别说明这两种情况主导的Block和LCZ对大气哪些层产生影响并在该限定范围内进行建模.

### 城市地表辐射传输模式的简要说明

在讨论城市热岛问题前需要先对城市地表的辐射收支进行说明. 对于任意表面: 

$$
Q^* = K^* + L^* = K_{\downarrow} - K_{\uparrow} + L_{\downarrow} - L_{\uparrow}
$$

其中$Q^*$, $K^*$和$L^*$分别是净全波辐射通量密度, 净短波辐射通量密度和净长波辐射通量密度.短波辐射收入$K_{\downarrow}$可分为直射($S$)和漫反射($D$)两部分.

$$
K_{\downarrow} = S + D = S_b \cos \hat \theta
$$

其中$D$在气候学角度认为是各向同的, $S$则由到达表面的辐射量$S_b$和光线与表面的夹角$\hat\theta$决定: 

$$
\cos \hat\theta = \cos \hat \beta \sin \beta + \sin \hat \beta \cos \beta \cos(\Omega - \hat \Omega)
$$

可画示意图为: 

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/Radiation_geometry_for_S.png)

$S_b$则可通过时间和大气模型矫正.然而需要注意的是在城市中阴影即非直射是普遍存在的, 并且在中高纬度地区一天中太阳天顶角变化较大, 进一步的说明将在后文给出. 

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/vertical_fish_eye.png)

近似地使用地表反照率$\alpha$计算$K_{\uparrow}$, 从而将短波净辐射表示为$K^* = (1 - \alpha)K_{\downarrow}$. 

长波辐射中$L_{\downarrow}$是最麻烦的, 先把$L_{\downarrow}$带着可以将$L_{\uparrow}$记为: 

$$
L_{\uparrow} = \epsilon \sigma T_0^4 + (1 - \epsilon)L_{\downarrow}
$$

其中地表发射率$\epsilon$和地表温度$T_0$是比较好获取的, $L_{\downarrow}$虽然没有明确的计算公式但却有如下两图的函数关系, 即城市地区和乡村地区的长波下行差异非常可能主要是由人为排放提供的因此具有常数关系; 当转换为辐射通量密度时, 短波损耗在数值上几乎等于地表的长波增益.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/urban_and_rural_Ldown_fluexes.png)

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/urban_KLQ_difference.png)

关于$L_{\downarrow}$我还要再研究一下在特定条件下的简化表示(没看完), 可以相信和$T_0$间有密切联系.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/T0_and_Ldown.png)

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/radiation_diurnal_course.png)

上图很清楚地表达了城市和郊区辐射净变化. 虽然这是在温哥华进过非常长期的观测得到的结果, 不过以占文凤老师团队为代表发展的一些差值方法能部分刻画辐射通量的日变化, 不过在当下讨论时完整刻画辐射通量日变化不是必要的.

### 城市地表的能量平衡

下图是一个典型的SEB能量平衡模型.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/SEB_fluxes.png)

前文已经说明了$Q^*$的组成, 在城市环境中,人为排放源$Q_F$也是不可忽视的一环. 其中$Q_G$表示通过显热(这一项不太需要考虑潜热)传递到地表基底的地热通量密度, $Q_H$和$Q_E$分别为系统交换的显热和潜热通量, $\Delta Q_S$是地表系统(下图中的built system)的能量变化, $\Delta Q_A$是水平方向上的能量收支.

进一步地, $Q_H$是由地表和大气之间的温差驱动, 通过冷暖涡流进行能量交换. $Q_E$是由蒸散发主导的. 作为简要说明不对这两个复杂项进一步展开说明, 只说明Bowen ratio $\beta = Q_H / Q_E$是一个衡量地表属性的关键量.

> 虽然$Q_E$相当棘手, 但是实验表明在白天接近中午的时候$Q^*$和$Q_E$有相当好的线性关系, 因此可以做一些线性的近似.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/structure_of_TEB_model.png)

本文讨论的场域聚焦在上图TEB模型中的辐射交换. 这个模型巧妙地将热能量交换与电路进行类比, 从而清晰了讨论并引入强大的分析工具. 虽然我们不考虑Element尺度的过程但是这一模型我认为在分析LCZ边界时会比较有用.

而在Urban canyon中情况又不同, 这一部分在模型讨论中继续说明.

## 关于城市热岛影响因素的一些说明

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/urban_compoents.png)

城市环境可以大体上分为五个部分, 在城市环境中文化环境(Cultural environment)和生态环境(Biophysical environment)是相互交叠的. 城市化过程对城市环境的影响主要为地表形态的改变和地表功能的改变两部分, 对城市环境的五部分都有影响. 在考虑城市热岛时,这些影响大致可以分为四部分: 

1. 城市地表属性的变化(城市系统的反照率和发射率等)
2. 城市地表几何结构的变化极大增加了地表的复杂性而不能像自然生态系统那样看成若干层平面.必须三维地看待城市峡谷(Urban canyon)等.
3. 人为排放增加了城市系统能量的净输入.
4. 人为排放对城市气溶胶有显著影响, 影响气体组成, 云, 风等诸多大气特征, 直接和间接地城市系统的辐射交换产生影响.

### Mark1

地表城市热岛(Surface urban heat island, 以下记SUHI)和冠层城市热岛(Canopy layer urban heat island, 以下记CUHI)的性质, 成因和性质有很大差异. CUHI几乎完全是一种"夜间现象", 如下图所示. 在人为排放较小时(没有大型工业区),城市热岛产生的原因并非由于在早晨时地表升温比郊区快, 而是因为在夜间郊区地区气温更低. 从而虽然在日出后郊区升温更快但温差依然存在.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/canopylayer_UHI_schematic.png)

这一过程看似并不太符合直觉: 郊区地表湿度更大,如果看SUHI的话在早晨城市地区地表确实升温速度明显高于郊区, 但实验数据呈现了完全不同的结论. 实际上这一现象的原因到目前没有很完备的解释, 但可以确定的是城市的几何特征在CUHI中发挥了很关键的作用, 实际上阴影和局部环流的影响是相当不可忽视的.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/UCL_heat_canopy_influence.png)

### Mark2

已经提到的城市几何结构的影响甚至在我之前关注的关于SUHI的文献中也被广泛忽视了. 貌似通过卫星数据可以很方便地读取地表温度$T_0$, 但这一结果在相当大程度上**忽视了建筑的垂直表面对地表温度的影响**.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/complete_and_plan_urban_surface.png)

如上图所示, Plan虚线为将城市看做二维平面的观测模拟结果, Complete为考虑城市的全部表面的观测模拟结果. 可以发现在将城市的垂直面等纳入考虑时城市与郊区热岛现象呈现了非常不同的特征. 因此我认为这一点在构建同化模型时要重点关注.

### Mark3

如下图所示, 在白天SUHI比CUHI要显著很多(白天的SUHI也是大量遥感影像的研究对象). 而白天的CUHI在接近中午的时间(比如Landsat过境武汉的时间)是几乎观测不到的.并且实际上在高密度的城市中心白天的近地表空气温度甚至略低于郊区. 在晚上, CUHI和SUHI的模式比较相同. 这其实给基于遥感观测的冠层城市热岛研究提出了非常严峻的挑战, 进一步思考将在后文讨论.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/UCL_and_SR_UHI_difference.png)

卫星遥感研究的另一个隐患是其几乎只能选择无云微风(无风)的晴天进行观测(实际上我看到很多热岛研究的数据都没有考虑无风这件事情, 而材料揭示不大的风就可以对城市热岛产生非常显著的影响). 这一个问题我在这一阶段先按下不表, 并且后续的讨论都在无云微风的环境下进行. (注: 微风指的是背景气候上的, 由城乡温差引起的梯度风应当在简化后纳入同化模型的考量).

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/typical_overall_urban_boundary.png)

并且, 虽然直觉上微风时城市环流是'dome'形态的, 但实际上'plume'也依然有可能(即形成plume不只有风一种因素),将在之后再讨论.

### Mark4

影响城市热岛的因素很多, 之前关注到一些基于经验(统计)方法和数值模拟的研究(~~包括之前的我~~)有不少采用数值回归方法进行量化和归因. 但是这一类方法需要解决的一个关键问题在于**参照点的选取**,即在讨论"温差"时是城市地区温度与哪一个地区温度的比较. 实际上,城市周围的郊区由于地表性质差异很大, 选取不同的参考点会得到**空间上和时间上变异都很大**的参照值. Oke等教授认为基于城乡温差的热岛强度研究在方法上是有根本缺陷的, 如下图所示参考点的差异会产生相当不同的结论. 以至于"量化城市热岛的绝对强度"是需要非常谨慎对待的概念.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/role_of_element_site.png)


因此, 在进行城市热岛的空间分布研究时需要适当扩展边界**并且对郊区地表属性进行评估**, 在使用遥感数据时需要同时获取其之前若干天的天气状况并结合季节和物候情况进行控制和描述.

### Mark5

以下讨论我认为是一个十分挑战但值得尝试的. 目前遥感数据的时空分辨率逐渐上升, 各类统计学习方法发展很快, 为城市气候研究提供了更好的数据支撑和方法指导. 但是作为地信遥感的学生, 我们平时接触的卫星遥感数据能提供的信息在这一方向是非常受限的. 这段时间在学习了城市气候的一些机理后, 我意识到(多光谱)卫星遥感得到的信息只有有限的观测区域有限的辐射信息. **但是城市热岛等模式的发生机理太复杂了, 因此完全通过统计的方法去解算产生这一模式的过程中各个要素的相对贡献等我看来是相当"危险的"**, 并且一些方法论的研究说明用现有一些研究进行跨城市的比较和迁移是比较困难的.

# 2. 一种城市热岛遥感同化模型的初步构想

城市表面的高度异质性使得城市表面属性相差很大, 但是经过众多实测研究和数值模拟研究验证的LCZs模型中单一LCZ可认为其地表属性是相对均一的. 这样的构想提供了一种依据即多大程度上可以认为地表是均一的. 

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/three_complexity_reduce_approaches.png)

从(a)到(c)是对地表模式不同简化程度的表述, 其中(a)过于复杂不使用; 用(c)的方式将单一LCZ看做一个黑箱是模型的基础,在此基础上对LCZ在垂直方向上进行少量分层并认为除湍流外(即将局部风进行平滑)每个LCZ具有单一的"盛行风向". 那么, 地表模式就是一个**多个以盛行风向为x轴垂直方向为y轴的"二维"空气剖面的组合**. ~~我突然不知道这一部分我写的草稿在哪里了找一下~~.

并且研究表明, 地表性质的突变会使得能量和物质交换有明显的前缘效应, 即不同性质的地表类型(这里的LCZ)之间地温等因素是会突变的,如下图所示.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/sharp_transitions_in_surface.png)

实际上城市热岛的形态并非我之前臆想的"高斯型", 如下图所示虽然在城市尺度上冠层热岛和地表热岛是一脉相承的, 但是在局地上却表现出比较sharp的边缘, 即**在较低的空气层中更像"城市热高原"**, 在高原上由于地表性质的不同存在山和谷. 我认为这一形态观念对正确认识热岛是重要的.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/dipiction_typical_UHIUBL.png)

**那么以卫星遥感数据为主要数据源构建这样的模型的关键问题是什么呢?** 我认为在于<u>对水平对流的表示和近地表RSL子层(即受地表属性影响显著的近地表大气)高度差的描述</u>. 而实现这一描述的关键在于**边界条件控制**. 即使用城市尺度比较好确定的整体热岛形态对内部的小热岛模型进行约束. 在上述的城市地表大气模式为这一思路提供了两个关键前提: 1. 在微风条件下LCZ的水平对流只会影响到相邻LCZ(有实验支撑). 2. 在RSL中平滑了湍流影响后垂直交换相对于水平交换是明显占有主导地位的.

> remark
> 最近这些内容看得还是有点眼花缭乱, 所以数学部分还相当凌乱(我自己思路上还有一些不清楚的地方). 感觉自己的语言能力还是不太行, 看英国人写的材料明显会比国人写的英文吃力非常多(慢而且难懂)...导致效率不高.