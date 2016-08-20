---
layout: post
title:  String与StringBuilder, StringBuffer的不同
date:   2015-01-16 10:46:00 +0800
categories: 杂乱
tag: 深入理解java
---

String 
-------------------------

String 是不可变的对象, 因此在每次对 String 类型进行改变的时候其实都等同于生成了一个新的 String 对象，然后将指针指向新的 String 对象，所以经常改变内容的字符串最好不要用 String ，因为每次生成对象都会对系统性能产生影响，特别当内存中无引用对象多了以后， JVM 的 GC 就会开始工作，那速度是一定会相当慢的。
 
但是此处需要注意一个事情就是
{% highlight java %}
String S1 = “This is only a” + “ simple” + “ test”;
{% endhighlight %}
{% highlight java %}
StringBuffer Sb = new StringBuilder(“This is only a”).append(“ simple”).append(“ test”);
{% endhighlight %}
第一个其实是比第二个快的，原因是JVM会把一当成如下处理
{% highlight java %}
String S1 = “This is only a simple test”; 
{% endhighlight %}
  
而如果是
{% highlight java %}
String S2 = “This is only a”;
String S3 = “ simple”;
String S4 = “ test”;
String S1 = S2 +S3 + S4;
{% endhighlight %}
这时候 JVM 会规规矩矩的按照原来的方式去做了

StringBuilder
-------------------------
StringBuilder非线程安全的可变字符序列，在JDK中源码实现：
{% highlight java %}
//存储字符序列
char value[];

/**
 * 主要的构造函数之一
 */
public StringBuilder(String str) {
	super(str.length() + 16);
	append(str);
}

/**
 * Append方法的实现
 */
public AbstractStringBuilder append(String str) {
	if (str == null) str = "null";
        int len = str.length();
	if (len == 0) return this;
	int newCount = count + len;
	if (newCount > value.length)
	    expandCapacity(newCount);
	str.getChars(0, len, value, count);
	count = newCount;
	return this;
}

/**
 * 拓展原有的缓冲，即赋新值
 */
void expandCapacity(int minimumCapacity) {
	int newCapacity = (value.length + 1) * 2;
	if (newCapacity < 0) {
		newCapacity = Integer.MAX_VALUE;
	} else if (minimumCapacity > newCapacity) {
		newCapacity = minimumCapacity;
	}
	value = Arrays.copyOf(value, newCapacity);
}
{% endhighlight %}

在StringBuilder中value被存储为字符数组，当要改变值得时候，只需要改变数组的大小添加进新的value便可以实现。

StringBuffer
-----------------------------
StringBuffer线程安全的可变字符序列，StringBuffer和StringBuilder都继承自`AbstractStringBuilder`，并且内部的方法实现基本一致，最大的区别就在于StringBuffer的方法都是使用`synchronized`修饰的，即线程安全的

综上所述:
-----------------------------
| * | String | StringBuilder | StringBuffer |
| 可变 | 否 | 是 | 是 |
| 线程安全 | 否 | 否 | 是 |

> 字符拼接速度比较:`StringBuilder` > `StringBuffer` > `String`
