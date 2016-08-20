---
layout: post
title:  tomcat的websocket推送问题和mybatis的启动问题
date:   2015-07-09 16:15:00 +0800
categories: 杂乱
tag: 问题记录
---

tomcat的websocket推送问题和mybatis的启动问题
===============================

tomcat的websocket推送问题
-------------------------------

websocket的推送不支持并发的推送，所以要在自己的代码中确保推送逻辑串行的。

具体参考官网的BUG[https://bz.apache.org/bugzilla/show_bug.cgi?id=56026](https://bz.apache.org/bugzilla/show_bug.cgi?id=56026)


mybatis+spring+tomcat启动报错问题
-------------------------------

报错如下
-------------------------------

{% highlight text %}
 java.lang.IllegalArgumentException: Mapped Statements collection already contains value for ***
{% endhighlight %}

框架版本
-------------------------------

* mybatis 3.0.4
* mybatis-spring 1.0.0
* spring 3.1.0.RELEASE
* tomcat 7.0.57

解决方案
-------------------------------

无，Mybatis的作者也遇到这个问题然后说是给Spring提了一个Issue，不知道现在怎么样了。
[https://github.com/mybatis/mybatis-3/issues/40](https://github.com/mybatis/mybatis-3/issues/40)
