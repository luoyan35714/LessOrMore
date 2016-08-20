---
layout: post
title:  SVN与GIT的比较
date:   2015-01-19 13:13:00 +0800
categories: 杂乱
tag: Source Control
---

历史角度
-------------------------------------

SVN
==============================
* SVN的出现是在2000年，CollabNet公司联系CVS的作者Karl Fogel(RedHat Software)开发的一个产品。产品的目标是彻底取代CVS，对明显的瑕疵进行修复，集合很多开源社区中的意见添加一些新功能，但是还要保证CVS似的开发模式。保证熟悉CVS的开发人员可以快速上手SVN。
* 在2000年那个年代，硬件设施还是比较贵重的。硬盘的容量也比较小，个人在2008年的时候买过一块250G的硬盘，要500多块钱，更别说再往前推8年。所以SVN首要解决的就是在版本控制的基础上，最大限度地节省存储空间，减少项目成本。于是它的存储方式被设计为差异存储，即每次文件修改，只保存修改的部分。而想要得到最终版本，就需要经过从初版，通过一系列的计算加上每次的修改才能得到。所以一个文件修改过N此之后，再进行操作，会相对比较慢。
![SVN SAVE METHOD](/images/blog/blobs/difference_between_git_and_svn/1_svn_save_method.jpg)
* 后来在2009年的时候SVN开源给了Apache基金组织。2010年成为Apache基金组织的顶级项目。

GIT
==============================
* GIT的作者是Linux操作系统的作者-`Linus`，Linux内核在刚开始是用分布式版本控制系统BitKeeper来管理和维护代码。到2005年的时候，开发BitKeeper的商业公司同Linux内核开源社区的合作关系结束，他们收回了免费使用BitKeeper的权力。这就迫使Linux开源社区（特别是Linux的缔造者Linus Torvalds）不得不吸取教训，只有开发一套属于自己的版本控制系统才不至于重蹈覆辙。他们对新的系统订了若干目标：

> * 速度 : 直接快照，而非比较差异，以牺牲硬盘的存储空间为代价，提升操作速度
> * 简单的设计 ： 多数操作仅添加数据
> * 对非线性开发模式的强力支持（允许上千个并行开发的分支）：鼓励创建Branch，开发结束后Merge到主开发分支(master或develop)。
> * 完全分布式 ：近乎所有操作都可本地执行，在SVN中如果在断网的情况下，想提交代码，那是根本不可能实现的，但是在GIT中，这是一件很简单的事情。
> * 有能力高效管理类似 Linux 内核一样的超大规模项目（速度和数据量）：时刻保持数据完整性，在保存到Git之前，所有数据都要进行内容的校验和（checksum(SHA-1加密算法))）计算，并将此结果作为数据的唯一标识和索引

![GIT SAVE METHOD](/images/blog/blobs/difference_between_git_and_svn/2_git_save_method.png)

架构角度
-------------------------------------

SVN
==============================
* SVN作为一个版本控制工具，采用的是集中式管理，所有开发者在开始新一天的工作之前必须从服务器获取代码，然后开发，最后解决冲突，提交。所有的版本信息都放在服务器上。如果脱离了服务器，开发者基本上可以说是无法工作的。
![SVN WORK FLOW](/images/blog/blobs/difference_between_git_and_svn/3_svn_work_flow.jpg)

GIT
==============================
* GIT采用分布式存储，即每个开发者所拥有的都是一个完整的Repository，开发过程中只需要关注自己branch的修改，可以完全离线操作，当开发完一定的模块后Pull下服务器版本的代码，再Merge到develop的Branch上。使得开发可以在任何时间任意地点完成。无需关心网络问题，并且完美解决了数据完整性问题。
![GIT WORK FLOW](/images/blog/blobs/difference_between_git_and_svn/4_git_work_flow.jpg)

开发角度
-------------------------------------
* SVN在提交的时候必须先从服务器Update一次，然后解决所有冲突，提交，而Git只需要建立自己的Branch，提交在自己的Branch上面，Merge到主开发分支上，当确实需要提交到管理库中时，才有必要Pull一次代码，解决冲突，并push到主Repository中。
* SVN不建议创建Branch，因为那样会使的版本维护更麻烦，而Git鼓励创建Branch，只有这样，才会使得版本维护轻松又Easy

其他
-------------------------------------

当然除了Git和SVN之外，还有许多其他的版本控制工具，例如：

* CVS ：作为最早的开源而且免费的集中式版本控制系统，直到现在还有不少人在用。但由于CVS自身设计的问题，会造成提交文件不完整，版本库莫名其妙损坏的情况。同样是开源而且免费的SVN修正了CVS的一些稳定性问题，是目前用得最多的集中式版本库控制系统。

* ClearCase : 收费的集中式版本控制系统，以前是Rational公司的，被IBM收购之后属于Rational系列下的一款产品，特点是安装费劲，运行巨慢，使用晦涩，价格超贵。除了收费 > 安全（指产品没有后门） > 售后，想不出其他任何原因有公司会愿意用它了。

* VSS ：微软自己的一个集中式版本控制系统，集成在Visual Studio中。由于其反人类的设计，连微软自己都不好意思用了。

<br />
<br />


参考资料：
-------------------------------------
SVN百度百科 : [http://baike.baidu.com/svn](http://baike.baidu.com/link?url=YdOtdLIqvKRtfwV9ceq-DIpbaMaUx11gXtHcog7AF2wRbB6XmEKJcghG1Vn9f_eEAfstGvhpwyEZW43gU9trva)

GIT百度百科: [http://baike.baidu.com/git](http://baike.baidu.com/link?url=r2ILs2AUmTEIot2Wd6EDw53Mo8XtOGRwzdNR8M7tpp1hT11vSKbBgSHYJtVZnSMwi2-KF7_g6FtqX-H29eQqSqpYFCIMrU1CzYJkYpyKWhS)

CVS百度百科: [http://baike.baidu.com/cvs](http://baike.baidu.com/link?url=unWVvc4Ag5OVUfCDQx1WCQFbhyPUAB0Y1Y43QkWQE0kBC64n2FYKFWbeADgNOI7M4C9wowD_JDlG5gcvG6VfyK)

SVN官网 : [http://subversion.apache.org/](http://subversion.apache.org/)

GIT官网 : [http://www.git-scm.com/](http://www.git-scm.com/)

廖雪峰的官方网站 : [http://www.liaoxuefeng.com/](http://www.liaoxuefeng.com/)
