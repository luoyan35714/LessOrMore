---
layout: post
title:  Java中Timer和ThreadPoolExecutor的区别和比较
date:   2016-06-02 16:44:00 +0800
categories: 杂乱
tag: 深入理解java
---

Java中Timer和ThreadPoolExecutor的区别和比较
===============================

今天闲来无事读Java中Timer的源码，发现Timer的注释中有这么一段

>  * <p>Java 5.0 introduced the {@code java.util.concurrent} package and
> * one of the concurrency utilities therein is the {@link
> * java.util.concurrent.ScheduledThreadPoolExecutor
> * ScheduledThreadPoolExecutor} which is a thread pool for repeatedly
> * executing tasks at a given rate or delay.  It is effectively a more
> * versatile replacement for the {@code Timer}/{@code TimerTask}
> * combination, as it allows multiple service threads, accepts various
> * time units, and doesn't require subclassing {@code TimerTask} (just
> * implement {@code Runnable}).  Configuring {@code
> * ScheduledThreadPoolExecutor} with one thread makes it equivalent to
> * {@code Timer}.

其大意是说Timer的API有单线程的问题，一个定时器不允许同时执行任务。官方说在JDK1.5之后引入了ScheduledThreadPoolExecutor类来实现多线程的定时器。那就来看看到底是怎么回事把。

Timer
==========================

+ 测试代码

{% highlight java%}
package com.freud.test;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class TimerTest {

	private static long start = System.currentTimeMillis();

	public static void main(String[] args) {

		Timer timer = new Timer();
		timer.scheduleAtFixedRate(new TimerTask() {

			@Override
			public void run() {
				try {
					System.out.println("Timer 1 start at:"
							+ (System.currentTimeMillis() - start));
					Thread.sleep(1000);
					System.out.println("Timer 1 finish at:"
							+ (System.currentTimeMillis() - start));
					// throw new RuntimeException("Exception occured here!");
				} catch (InterruptedException e) {
					System.out.println("Thread was interrupted.");
				}
			}
		}, new Date(), 1000);

		timer.scheduleAtFixedRate(new TimerTask() {

			@Override
			public void run() {
				try {
					System.out.println("Timer 2 start at:"
							+ (System.currentTimeMillis() - start));
					Thread.sleep(1000);
					System.out.println("Timer 2 finish at:"
							+ (System.currentTimeMillis() - start));
				} catch (InterruptedException e) {
					System.out.println("Thread was interrupted.");
				}
			}
		}, new Date(), 1000);

	}
}
{% endhighlight %}

+ 执行上述代码后会发现打印输出如下

{% highlight text %}
Timer 1 start at:1
Timer 1 finish at:1001
Timer 2 start at:1001
Timer 2 finish at:2001
Timer 2 start at:2001
Timer 2 finish at:3001
Timer 1 start at:3001
Timer 1 finish at:4001
Timer 1 start at:4001
Timer 1 finish at:5001
Timer 2 start at:5001
Timer 2 finish at:6002
Timer 2 start at:6002
Timer 2 finish at:7002
Timer 1 start at:7002
Timer 1 finish at:8002
Timer 1 start at:8002
Timer 1 finish at:9002
Timer 2 start at:9002
Timer 2 finish at:10002
Timer 2 start at:10002
Timer 2 finish at:11002
Timer 1 start at:11002
{% endhighlight %}

+ 通过日志不难看出，在一个Timer中的2个TimerTask是有执行顺序的，也就是上一个没有执行完，下一个是不会触发的。而究其原因，看源码发现Timer的实现中只有一个TimerThread线程通过`while (true)`的loop来执行存储在TaskQueue中的定时器任务

{% highlight java%}
public class Timer {
    /**
     * The timer task queue.  This data structure is shared with the timer
     * thread.  The timer produces tasks, via its various schedule calls,
     * and the timer thread consumes, executing timer tasks as appropriate,
     * and removing them from the queue when they're obsolete.
     */
    private final TaskQueue queue = new TaskQueue();

    /**
     * The timer thread.
     */
    private final TimerThread thread = new TimerThread(queue);
{% endhighlight %}

+ 并且在loop的过程中只捕获了InterruptedException导致其中一个Task出现错误，会影响接下来的所有Task的执行。

{% highlight java%}
 /**
  * The main timer loop.  (See class comment.)
  */
private void mainLoop() {
    while (true) {
        try {
           	//*****
            if (taskFired)  // Task fired; run it, holding no locks
                task.run();
        } catch(InterruptedException e) {
        }
    }
}
{% endhighlight %}

+ 打开TimerTest中注释掉的`throw new RuntimeException("Exception occured here!");`代码，会发现Task2不会执行。


ScheduledThreadPoolExecutor
==============================

+ 测试代码

{% highlight java%}
package com.freud.test;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ScheduledThreadPoolExecutorTest {

	private static long start = System.currentTimeMillis();

	public static void main(String[] args) {
		ScheduledExecutorService schedule = Executors.newScheduledThreadPool(1);

		schedule.scheduleAtFixedRate(new Runnable() {
			@Override
			public void run() {
				try {
					System.out.println("Schedule 1 start at:"
							+ (System.currentTimeMillis() - start));
					Thread.sleep(1000);
					System.out.println("Schedule 1 finish at:"
							+ (System.currentTimeMillis() - start));
					// throw new RuntimeException("Exception occured here!");
				} catch (InterruptedException e) {
					System.out.println("Thread was interrupted.");
				}
			}
		}, 1, 1, TimeUnit.SECONDS);

		schedule.scheduleAtFixedRate(new Runnable() {
			@Override
			public void run() {
				try {
					System.out.println("Schedule 2 start at:"
							+ (System.currentTimeMillis() - start));
					Thread.sleep(1000);
					System.out.println("Schedule 2 finish at:"
							+ (System.currentTimeMillis() - start));
				} catch (InterruptedException e) {
					System.out.println("Thread was interrupted.");
				}
			}
		}, 1, 1, TimeUnit.SECONDS);
	}
}
{% endhighlight %}

+ 观察到的结果如下，可以发现是跟Timer的执行结果是一样的

{% highlight text %}
Schedule 1 start at:1003
Schedule 1 finish at:2004
Schedule 2 start at:2004
Schedule 2 finish at:3004
Schedule 1 start at:3004
Schedule 1 finish at:4004
Schedule 2 start at:4004
Schedule 2 finish at:5004
Schedule 1 start at:5004
Schedule 1 finish at:6004
Schedule 2 start at:6004
Schedule 2 finish at:7004
Schedule 1 start at:7004
{% endhighlight %}

+ 此时，修改`Executors.newScheduledThreadPool(1)`为`Executors.newScheduledThreadPool(2)`创建两个线程来执行定时器任务，观察到结果预期应该是每秒钟2个任务同时执行，结果如下，符合预期

{% highlight text %}
Schedule 1 start at:1004
Schedule 2 start at:1004
Schedule 2 finish at:2005
Schedule 1 finish at:2005
Schedule 2 start at:2005
Schedule 1 start at:2005
Schedule 1 finish at:3005
Schedule 1 start at:3005
Schedule 2 finish at:3009
Schedule 2 start at:3009
Schedule 1 finish at:4005
Schedule 1 start at:4005
Schedule 2 finish at:4009
Schedule 2 start at:4009
{% endhighlight %}

+ 当打开`throw new RuntimeException("Exception occured here!");`之后会发现Schedule2正常执行，Schedule1的异常不会影响Schedule2的执行

{% highlight text %}
Schedule 1 start at:1003
Schedule 2 start at:1004
Schedule 1 finish at:2004
Schedule 2 finish at:2004
Schedule 2 start at:2004
Schedule 2 finish at:3004
Schedule 2 start at:3004
Schedule 2 finish at:4004
Schedule 2 start at:4004
Schedule 2 finish at:5004
Schedule 2 start at:5004
Schedule 2 finish at:6004
Schedule 2 start at:6004
{% endhighlight %}

结论
==========================

Timer可以做的事情，通过ScheduledThreadPoolExecutor都可以做到，并且修复了其中Timer的部分设计上的缺陷。并且实现了多线程的执行，相对来说功能是比Timer强大了一个等级。

<br />
<br />

参考资料：
-------------------------------------

Java 并发专题:Timer的缺陷 用ScheduledExecutorService替代 : [http://blog.csdn.net/lmj623565791/article/details/27109467](http://blog.csdn.net/lmj623565791/article/details/27109467)

<br />
<br />