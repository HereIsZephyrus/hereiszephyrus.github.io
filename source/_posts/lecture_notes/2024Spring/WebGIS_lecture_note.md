---
date: 2024-02-26
categories:
  - LectureNote
tags:
  - lecture
  - GIS
title: WebGIS与二次开发课程笔记
draft : true
description : WebGIS与二次开发课程笔记(更新中)
---
# 绪论
> 樊文有,13397119008(Phone),4413363(QQ)
> fanwenyou@cug.edu.cn

```
Web GIS is a type of distributed information system, comprising at least a server and a client,
where the server is a GISserver and the client is a web browser, desktop application, or mobile
application. In its simplest form, web GIS can bedefined as any GIS that uses web technology
to communicate between a server and a client, ESRI,2016
```
### Web发展
1. 从SOAP发展为REST
    REST采用简单的URL代替一个对象,优点是轻量,可读性较好且不需要其他类库的支持.
2. 从Web1.0到Web2.0,3.0
    #### web1.0
    - 基本采用的是**技术创新**主导模式,在创始阶段的技术痕迹相当重
    - Web的盈利主要来自于点击量
    - 逐步向综合门户合流发展
    - 形成了主营与兼营结合的清晰产业结构
    - 动态网站已经广泛应用
    #### web2.0
    - 用户分享.
    - 信息聚合.信息在网络上不断积累,不会丢失.
    - 以兴趣为聚合点的社群.在Web2.0模式下已经产生了细分西昌
    - 开放的平台,活跃的用户.
    > web2.0模式下互联网服务响应是复杂且异步的,用户通过复杂的客户端软件自己生成内容.
    #### web3.0
    - web3.0包含多层含义.包括互联网本身转化为一个泛型数据库;夸浏览器,超浏览器的内容投递和请求机制;人工智能技术的运用;语义网;地理映射网;运用三维技术搭建的网站
    > web3.0和web2.0一样主要是思想的创新,从而指导技术的发展和应用.
    > 

## WebGIS 主要功能
### 1. 地图查询
    - 空间查询
    - 属性查询
### 2. 数据采集
    - 利用互联网来采集地理信息
    - 自发式地理信息
    - 提高数据的现势性
### 3. 地理信息传播
    - 传播地理信息的平台
    - 共享空间信息,促进各部门合作
## WebGIS的挑战
1. **传输速率瓶颈和可视化问题**: 处理大量的图形,图像,三维数据,使得访问WebGIS的速度越来越慢.
2. **网络虚拟地理环境的渲染问题**: 三维模型在网络上渲染速度慢的问题,用户体验不佳;跨平台兼容性问题可能造成渲染效果不一致.
3. **三维模型渲染的数据安全问题**: 如果服务器的安全性不够高,就可能导致三维模型数据泄露或者被篡改.在网络上渲染三维码模型时,用户需要下载渲染软件,这就存在恶意软件的风险.以及三维模型在网络上渲染是,可能会涉及版权问题.
## WebGIS发展机遇
1. 大众化市场和专业化市场都有大量的空白领域有待人们去探索和开发.
2. 大众在线地图和手机应用为广大用户提供了地理可视化和常用的分析功能,展现了WebGIS的巨大商业价值和广泛的应用前景.产生新的专业需求,为专业化市场带来新的机遇.
3. GIS专业人员在开拓WebGIS的潜能方面具有重要的应用.GIS专业人员肩负着提供权威地理信息 ,设计高质量的可视化工具,构建软件的分析模型,是WebGIS成为本单位业务服务系统的有机组成部分,构建地理信息共享平台.
> 地理信息科学的长处是空间分析而非信息获取.

==WebGIS从自上而下的信息流向转为信息的双向流动==.从本地到云端,从封闭的WebGIS网站到基于Web服务的架构,从有限的桌面平台到无线的移动平台.
WebGIS布景提供功能,更提供**数据内容**.从静态数据到实时数据,时空大数据和实时GIS.

## Web技术简介
### Ajax简介
Ajax是一种用于创建动态网页的技术,在2005提出,是一种用来描述使用现偶技术集合的新方法,集合中包括HTML,CSS,JS,DOM,XML和XMLHttpRequest技术.
通过Ajax,在传统的Web应用程序中增加了一个中间层(Ajax引擎),用来**实现客户端操作与服务器相应的异步化**.即==在发送请求后可以继续别的操作,网页不会出现闪烁或消失==,**促进页面表现与数据的分离**.
XMLHTTPRequest对象是客户端应用请求与服务器沟通的桥梁,通过该对象,客户端可以向服务器请求数据从服务器接受数据.
### JASON,XML 简介
一个例子:
```XML
<note>
    <title>XML结构</title>
    <author> TCB </author>
    <url>www.google.com</url>
    <catalogue>
        <li>XML概念</li>
        <li>语法规则</li>
    </catalogue>
</note>
```

<note>
    <title>XML结构</title>
    <author> TCB </author>
    <url>www.google.com</url>
    <catalogue>
        <li>XML概念</li>
        <li>语法规则</li>
    </catalogue>
</note>

| JSON | XML | 
| -- | -- |
| 支持字符串,数字等多个类型 | 仅支持字符串 |
| 没有命名空间 | 可以定义命名空间 |
| 解析更快 | 更安全|

### HTML简介