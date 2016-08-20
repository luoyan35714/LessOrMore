---
layout: post
title:  Java中八种基本类型所占用的字节数
date:   2015-10-23 10:35:00 +0800
categories: 杂乱
tag: 深入理解java
---

Java中八种基本类型的内存中占用字节数
===============================

> 取值范围是[-2的(字节数X8-1)次方]到[2的(字节数X8-1)次方-1]

+ 整型

|类型	|存储需求	|bit数	|取值范围      				|
|byte	|1字节		|1*8 	|-2的7次方到2的7次方-1		|
|short	|2字节		|2*8 	|-2的15次方到2的15次方-1	|
|int	|4字节		|4*8 	|-2的31次方到2的31次方-1	|
|long	|8字节		|8*8 	|-2的63次方到2的63次方-1	|

+ 浮点型

|类型	|存储需求	|bit数	|备注										|
|float 	|4字节		|4*8 	|float类型的数值有一个后缀F(例如：3.14F)	|
|double	|8字节		|8*8 	|没有后缀F的浮点数值(如3.14)默认为double类型|

+ char类型

|类型	|存储需求	|bit数	|
|char 	|2字节		|2*8 	|

+ boolean类型

|类型		|存储需求	|bit数	|取值范围 	|
|boolean 	|1字节     	|1*8    |false、true|

![Java Bits](/images/blog/blobs/java_bits/java_bits.png)

<br />
<br />

参考资料：
-------------------------------------

java中的int占用几个字节：[http://zhidao.baidu.com/question/1383026893650831620.html](http://zhidao.baidu.com/question/1383026893650831620.html)

《Thinking in java 4th Edition》

<br />
<br />