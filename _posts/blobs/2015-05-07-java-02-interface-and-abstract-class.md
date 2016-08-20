---
layout: post
title:  接口和抽象类深入思考
date:   2015-05-07 12:39:00 +0800
categories: 杂乱
tag: 深入理解java
---

接口(Interface)和抽象类(Abstract Class)
--------------------------------

在java面试基本上必问的一个问题就是，抽象类和接口的区别。基本总结如下:

* 抽象类只能单继承(extends)；接口可以多实现(implement)
* 接口内部的方法必须是抽象方法，默认且必须由`public abstract`修饰，成员变量默认且必须是`public static final`修饰;对抽象类而言，本质上普通类有的，在抽象类中都可以实现，抽象类中可以定义抽象方法，并且如果定义了抽象方法，该类必须被声明为抽象类。
* 相同点是两者都不可以创建实例。

为什么
-------------------------
那我们很容易就想到一个问题：java语法为什么这么设计。这么设计有什么好处。解决了什么问题。
<br />
在这个地方Sun是想解决以下这些情况引发的冲突：

* 如果抽象类可以多继承。那两个抽象类中有相同的方法定义。在子类中调用的究竟是哪个。单继承避免了这个问题
* 如果在接口中可以定义实现方法，而接口又是可以多实现的。如果两个接口中有相同的方法定义，也会引发上面的问题。接口中不可以定义实现方法，从另一个角度避免了这个问题。
* 如果在接口中可以定义private并且不是static final的变量。先说private，我们知道Java是一门面向对象(OOP)语言，在类中，field代表的是属性，method代表的是动作。按照OOP的核心思想，属性通常是私有的(private)，而私有方法只有本类内部方法可见，即要依靠方法来获取或者改变。那基于上述情况，接口中最基本的就必须有getter和setter方法。而第二点中证明过的，接口中不能有实现方法。所以两者又是矛盾的。接下来是static,如果一个变量不是static的，那就只有两种方式能对这个变量进行操作，一是通过方法（已经证明不可以），二是通过实例化，但是接口规定是不允许实例化，并且接口中连实现方法都没有，实例化是没有意义的。两种方法都行不通，那在这个基础上定义的变量就完全没有意义。所以变量必须是static的。最后是final,final定义的字段不可更改。前面我们提到了，字段的变动在OOP中通常是依据方法来实现。而接口中完全没有实现方法。所以，在接口中，
一个变量只能且必须是`public static final`的修饰的。

突破
---------------------------
这种设计模式一直在jdk中被奉为真理，甚至在我经历过的这些面试中，每次都有问到接口和抽象类有什么区别。
<br />
那有没有可能这个真理被打破呢。是的，有可能，并且Oracle最新发布的JDK 1.8中就已经实现了。

* 接口中可以写实现方法
* 但是这个实现方法是有限制的，访问修饰符是default，或者修饰符是`public static`
<br />
JDK的解决方案是通过(接口名.super.方法名)来调用父类中的实现。代码如下

InterfaceA.java
================
{% highlight java %}
package com.freud.test;

/**
 * 
 * @author Freud
 *
 */
public interface InterfaceA {

	/**
	 * 静态方法A
	 */
	public static void methodA() {
		System.out.println("static method from A");
	}

	/**
	 * 与InterfaceB中同名方法及实现
	 */
	default void method() {
		System.out.println("method from A");
	}
}
{% endhighlight %}

InterfaceB.java
================
{% highlight java %}
package com.freud.test;

/**
 * 
 * @author Freud
 *
 */
public interface InterfaceB {

	/**
	 * 静态方法B
	 */
	public static void methodB() {
		System.out.println("static method from B");
	}

	/**
	 * 与InterfaceA中同名方法及实现
	 */
	default void method() {
		System.out.println("method from B");
	}
}
{% endhighlight %}

Impl.java
================
{% highlight java %}
package com.freud.test;

/**
 * 
 * @author Freud
 *
 */
public class Impl implements InterfaceA, InterfaceB {

	/**
	 * 覆盖父类中的method方法，并且分别调用接口中的实现，获得输出结果
	 */
	@Override
	public void method() {
		InterfaceA.super.method();
		InterfaceB.super.method();
	}

}
{% endhighlight %}

TestClass.java
================
{% highlight java %}
package com.freud.test;

/**
 * 
 * @author Freud
 *
 */
public class Test {

	/**
	 * 测试入口
	 * 
	 * @param args
	 */
	public static void main(String[] args) {

		InterfaceA.methodA();
		InterfaceB.methodB();

		Impl impl = new Impl();
		impl.method();

	}
}
{% endhighlight %}

输出结果
================
{% highlight text %}
static method from A
static method from B
method from A
method from B
{% endhighlight %}


旁触侧通
---------------------------
在做测试的过程中遇到一个super.getClass().getName()打印出来的依旧是当前类的名字。查询之后才发现。super只是一个关键字，并不代表父类的对象。

<br />
<br />