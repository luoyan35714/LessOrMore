---
layout: post
title:  SWFFileupload组件整合Spring Security在火狐浏览器下无法上传文件问题解决方案
date:   2016-03-11 10:12:00 +0800
categories: 杂乱
tag: SWFFileupload
---


SWFFileupload组件整合Spring Security在火狐浏览器下无法上传文件问题解决方案
===============================

+ 问题描述

项目中上传组件选用的是SWFFileupload,此技术需要使用到Adobe的Flash技术，但是在上传的时候会丢失Session，权限验证框架使用的Spring Security，统一对除登录页面之外的所有页面做了权限拦截。所以如果想上传，必须在构建URL的时候重写URL手动将Session添加上，才能确保有足够的操作权限。

+ 解决方法

{% highlight javascript %}
// 未添加Session的SWFFileupload组件初始化代码
var settings={
    upload_url: "/test/uploadFile?method=swfuploadFile",
    //...
};
swfu = new SWFUpload(settings);
{% endhighlight %}

{% highlight javascript %}
// 手动添加Session后的SWFFileupload组件初始化代码
var settings={
    upload_url: "/test/uploadFile;jsessionid=<%=request.getSession().getId()%>?method=swfuploadFile",
    //...
};
swfu = new SWFUpload(settings);
{% endhighlight %}



<br />
<br />

参考资料：
-------------------------------------

解决ssh项目用swfupload上传文件时session丢失问题 ：[http://blog.csdn.net/zhanngle/article/details/7538252](http://blog.csdn.net/zhanngle/article/details/7538252)

<br />
<br />