---
layout: post
title:  ZXing生成和读取二维码
date:   2015-04-29 18:07:00 +0800
categories: 杂乱
tag: 二维码
---

ZXing
-------------------
ZXing(Zebra Crossing)是一个Google开源的,支持多种格式的条形码图像处理库,使用java实现,同时为其他语言提供接口。

Maven的POM.xml文件
===============================
{% highlight xml %}
<dependency>
	<groupId>com.google.zxing</groupId>
	<artifactId>core</artifactId>
	<version>3.2.0</version>
</dependency>
<dependency>
	<groupId>com.google.zxing</groupId>
	<artifactId>javase</artifactId>
	<version>3.2.0</version>
</dependency>
{% endhighlight %}

Google提供的Util类
========================
{% highlight java%}
package com.freud.test.TestZxing;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;

import com.google.zxing.common.BitMatrix;

public final class MatrixToImageWriter {

	private static final int BLACK = 0xFF000000;
	private static final int WHITE = 0xFFFFFFFF;

	private MatrixToImageWriter() {
	}

	public static BufferedImage toBufferedImage(BitMatrix matrix) {
		int width = matrix.getWidth();
		int height = matrix.getHeight();
		BufferedImage image = new BufferedImage(width, height,
				BufferedImage.TYPE_INT_RGB);
		for (int x = 0; x < width; x++) {
			for (int y = 0; y < height; y++) {
				image.setRGB(x, y, matrix.get(x, y) ? BLACK : WHITE);
			}
		}
		return image;
	}

	public static void writeToFile(BitMatrix matrix, String format, File file)
			throws IOException {
		BufferedImage image = toBufferedImage(matrix);
		if (!ImageIO.write(image, format, file)) {
			throw new IOException("Could not write an image of format "
					+ format + " to " + file);
		}
	}

	public static void writeToStream(BitMatrix matrix, String format,
			OutputStream stream) throws IOException {
		BufferedImage image = toBufferedImage(matrix);
		if (!ImageIO.write(image, format, stream)) {
			throw new IOException("Could not write an image of format "
					+ format);
		}
	}

}
{% endhighlight%}

入口类
========================
{% highlight java%}
package com.freud.test.TestZxing;

import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

import javax.imageio.ImageIO;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.Binarizer;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.EncodeHintType;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.Reader;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;

public class Test {

	public static String generate() throws Exception {
		String text = "HelloWorld";

		int width = 300;
		int height = 300;

		// 二维码的图片格式
		String format = "png";
		Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType, String>();

		// 内容所使用编码
		hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
		BitMatrix bitMatrix = new MultiFormatWriter().encode(text,
				BarcodeFormat.QR_CODE, width, height, hints);

		// 生成二维码
		File outputFile = new File(
				"f:"
						+ File.separator
						+ "qrcode"
						+ File.separator
						+ new SimpleDateFormat("yyyy-MM-dd HH-mm-ss")
								.format(new Date()) + ".png");
		System.out.println("图片生成在:[" + outputFile.getAbsolutePath() + "]");
		MatrixToImageWriter.writeToFile(bitMatrix, format, outputFile);
		return outputFile.getAbsolutePath();
	}

	public static void read(String fileName) throws Exception {
		Reader reader = new MultiFormatReader();

		BufferedImage image = ImageIO.read(new File(fileName));

		LuminanceSource source = new BufferedImageLuminanceSource(image);
		Binarizer binarizer = new HybridBinarizer(source);

		BinaryBitmap bitmap = new BinaryBitmap(binarizer);

		Map<DecodeHintType, String> hints = new HashMap<DecodeHintType, String>();

		hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");

		Result result = reader.decode(bitmap);

		System.out.println(result.toString());

	}

	public static void main(String[] args) throws Exception {
		String filePath = generate();
		read(filePath);
	}
}
{% endhighlight %}

生成的二维码
=====================
![生成二维码图片](/images/blog/blobs/qrcode_generate/2015-04-29_18-02-03.png)
<br />

参考资料
===========================
[http://blog.csdn.net/feiyu84/article/details/9089497](http://blog.csdn.net/feiyu84/article/details/9089497)
<br />
ZXing官网[https://github.com/zxing/zxing](https://github.com/zxing/zxing)
<br />