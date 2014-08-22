package com.resize.util;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

public class ResizeServlet {

	/**
     * This function resize the image file and returns the BufferedImage.
     */
    public static BufferedImage resizeImage(final Image image, int width, int height) {
        final BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        final Graphics2D graphics2D = bufferedImage.createGraphics();
        graphics2D.setComposite(AlphaComposite.Src);
        //below three lines are for RenderingHints for better image quality at cost of higher processing time
        graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics2D.setRenderingHint(RenderingHints.KEY_RENDERING,RenderingHints.VALUE_RENDER_QUALITY);
        graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING,RenderingHints.VALUE_ANTIALIAS_ON);
        graphics2D.drawImage(image, 0, 0, width, height, null);
        graphics2D.dispose();
        return bufferedImage;
    }

	public static void setSize(InputStream in, String path, String fileName) {

        try {

        	int valueSize = 0;
        	String keySize = null;

        	Image img = ImageIO.read(in);

        	for(int i=0; i<5; i++) {

        		if(i == 0) {
        			keySize = "XL";
        			valueSize = 960;
        		} else if(i == 1) {
        			keySize = "L";
        			valueSize = 640;
        		} else if(i == 2) {
        			keySize = "M";
        			valueSize = 240;
        		} else if(i == 3) {
        			keySize = "S";
        			valueSize = 120;
        		} else if(i == 4) {
        			keySize = "XS";
        			valueSize = 30;
        		}

		        BufferedImage tempPNG = resizeImage(img, valueSize, (int)(((double)img.getHeight(null)/(double)img.getWidth(null))*(double)valueSize));
		        File newFilePNG = new File(path+""+fileName.substring(0, fileName.lastIndexOf('.'))+"_"+keySize+".png");
	            ImageIO.write(tempPNG, "jpg", newFilePNG);

        	}

        } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}


    }




}
