---
categories:
  - Blog
description: Zotero+Notion+Dify 打造AI文献知识库
tags:
  - Notion
  - Workflow
  - Zotero
title: 从文献库到知识管家—AI赋能Zotero一站式文献知识管理
id: 1ef5f278-d14b-80ae-9925-f26f585af073
created: 2025-05-10 06:20:00
updated: 2025-05-10 06:59:00
date: 2025-05-10 06:20:00
---

# 前言

在一年前我写了一篇博客记录了我将 Zotero+Marginnote+Notion 结合起来实现”统一入库,多端阅读,结构化数据管理”的文献管理阅读工作流.

<div style="width: 100%; margin-top: 4px; margin-bottom: 4px;"><div style="display: flex; background:white;border-radius:5px"><a href="https://blog.channingtong.cn/undefined/7356b54a.html"target="_blank"rel="noopener noreferrer"style="display: flex; color: inherit; text-decoration: none; user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; flex-grow: 1; min-width: 0px; flex-wrap: wrap-reverse; align-items: stretch; text-align: left; overflow: hidden; border: 1px solid rgba(55, 53, 47, 0.16); border-radius: 5px; position: relative; fill: inherit;"><div style="flex: 4 1 180px; padding: 12px 14px 14px; overflow: hidden; text-align: left;"><div style="font-size: 14px; line-height: 20px; color: rgb(55, 53, 47); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 24px; margin-bottom: 2px;">Margin zotero——文献工作流分享</div><div style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.65); height: 32px; overflow: hidden;">将zotero,margin note3,notion无缝缝合的文献阅读工作流,支持一键导出为PDF或beamer</div><div style="display: flex; margin-top: 6px; height: 16px;"><img src="https://blog.channingtong.cn/fa-solid%20fa-cubes-stacked"style="width: 16px; height: 16px; min-width: 16px; margin-right: 6px;"><div style="font-size: 12px; line-height: 16px; color: rgb(55, 53, 47); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">https://blog.channingtong.cn/undefined/7356b54a.html</div></div></div><div style="flex: 1 1 180px; display: block; position: relative;"><div style="position: absolute; inset: 0px;"><div style="width: 100%; height: 100%;"><img src="https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/Zephyrus_avatar.JPG" referrerpolicy="no-referrer" style="display: block; object-fit: cover; border-radius: 3px; width: 100%; height: 100%;"></div></div></div></a></div></div>

但当我在前段时间写结题报告整理引用时,我发现有相当多我看过的文献他被我遗忘在文献库中,有大量我看过的研究方法和研究结论没有对我的学习研究产生帮助,这时我才终于意识到写好文献笔记有多重要.之前的这个工作流建立在早期我相当慢的文献阅读速度,但当我的文献阅读速度提高后就已经懒得去整理文献笔记了. 这促使我思考怎么样坚持写好文献笔记,并将文献笔记转换为有用的知识呢? 这一年中随着 AI 服务的快速发展,知识管理工具也日新月异,因此我想使用 AI 帮我解决这一问题.

# 工作流概述

本工作流分为两部分,第一部分是延续了之前的工作流,使用 Notero 插件将 Zotero 和 Notion 结合在一起(但是现在我没有单开一个数据库了就用的默认的数据库模板),此处不多赘述可查看上一篇博客.第二部分是将 Notion 中的数据导入 Dify 数据库,并实现 Dify 查询时对文献数据的自动更新.

**Dify**  是一款开源的大语言模型(LLM) 应用开发平台.它融合了后端即服务（Backend as Service）和  [**LLMOps**](https://docs.dify.ai/zh-hans/learn-more/extended-reading/what-is-llmops)  的理念,使开发者可以快速搭建生产级的生成式 AI 应用.

<div style="width: 100%; margin-top: 4px; margin-bottom: 4px;"><div style="display: flex; background:white;border-radius:5px"><a href="https://dify.ai/"target="_blank"rel="noopener noreferrer"style="display: flex; color: inherit; text-decoration: none; user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; flex-grow: 1; min-width: 0px; flex-wrap: wrap-reverse; align-items: stretch; text-align: left; overflow: hidden; border: 1px solid rgba(55, 53, 47, 0.16); border-radius: 5px; position: relative; fill: inherit;"><div style="flex: 4 1 180px; padding: 12px 14px 14px; overflow: hidden; text-align: left;"><div style="font-size: 14px; line-height: 20px; color: rgb(55, 53, 47); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 24px; margin-bottom: 2px;">Dify.AI · The Innovation Engine for Generative AI Applications</div><div style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.65); height: 32px; overflow: hidden;">The next-gen development platform - Easily build and operate generative AI applications. 
Create Assistants API and GPTs based on any LLMs.</div><div style="display: flex; margin-top: 6px; height: 16px;"><img src="https://framerusercontent.com/images/KWDRAMQLGjoMFBAjNjoCFMP7XI.png"style="width: 16px; height: 16px; min-width: 16px; margin-right: 6px;"><div style="font-size: 12px; line-height: 16px; color: rgb(55, 53, 47); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">https://dify.ai/</div></div></div><div style="flex: 1 1 180px; display: block; position: relative;"><div style="position: absolute; inset: 0px;"><div style="width: 100%; height: 100%;"><img src="https://framerusercontent.com/assets/wh4qGCAanwpqHs0Kot8VLBSty4.png" referrerpolicy="no-referrer" style="display: block; object-fit: cover; border-radius: 3px; width: 100%; height: 100%;"></div></div></div></a></div></div>

很关键的是 Dify 支持本地部署,因此不仅可以节约成本,还能适用于对数据安全性有要求的场景.本项目使用 Docker 在本地部署了 Dify,并使用了一个简易的文献助手工作流模板(这样的模板很多可以在 Dify 的官方社区找到).

之后是这个项目的关键: Notero 插件实现了 Zotero 对 Notion 的自动同步, 但 Notion 对 Dify 知识库的自动同步该如何实现呢? 由于免费版的 Notion 不支持 webhook(即”当 Notion 数据库更新时发送请求更新 Dify 知识库”这一需求是无法实现的),因此我的解决方案是惰性更新,即只在用户询问(新建会话)的时候才会检查 Dify 的知识库与 Notion 的数据库是否同步,这一功能是通过 Notion 的 Python API 和 Dify 的知识库 API 实现的.

## 将 Notion 同步到 Dify 知识库

首先,虽然 Dify 支持直接从 Notion 导入数据,但对于本项目其有两个致命的缺陷:

1. Dify 对 Notion 的导入只支持导入页面(Page)的内容,不支持导入数据库(dataset)的内容,不能直接融入到 Notero 的工作流中
2. Dify 对 Notion 数据库是无法自动同步的,必须手动对 Notion 内容进行刷新.

因此这个功能需要自己实现, 实现代码我托管在[https://github.com/HereIsZephyrus/NoDifyhook](https://github.com/HereIsZephyrus/NoDifyhook)上,工作流文件(DSL file)也在仓库中,以下简要说明实现原理.

1. 使用 Dify 的知识库 API 扫描当前文献库,获取所有文献最新的时间戳.
2. 使用 Python 库 notion_client 使用步骤一得到的时间戳做筛选,获取数据库在该时间戳后更新的文献信息(notion_client 配置方法见上一个博客)
3. 制作文献内容的字符串,使用 Dify 的知识库 API 上传.
4. 统计信息,检查错误,完成同步.

其中 Notion 数据库中的”最后更新时间(last_edited_time)”是一个内置的元数据,notoin_client 的 filter 功能无法直接访问,因此需要创建一个新字段(last_modified)记录这个更新时间.

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/notion_last_modified.png)

具体内容可见代码.

# 效果展示

Notion 数据库中的信息大体可分为两部分: 文献基本信息(标题,作者,摘要等)和文献笔记两部分,以下分别展示两次查询.第一次内容为有文献笔记的主题,第二次内容为我还没看的主题(无笔记)

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/dify_reading1.png)

![](https://cdn.jsdelivr.net/gh/HereIsZephyrus/zephyrus.img/images/blog/dify_reading2.png)

经过检查 Zotero 链接和 URL 链接都是正确的,文献总结也是真实的,对有笔记的条目还会反映文献内容.

# 总结

虽然不知道有多少用但总之还是玩了一下,最重要的是要写好文献笔记!不然过了两年真记不得自己看的内容了.文献总结效果我还是很满意的.
