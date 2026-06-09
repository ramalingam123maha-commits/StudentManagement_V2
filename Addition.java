/**
 * Simple Addition Program in Java
 * This program performs basic addition operations
 */

public class Addition {
    
    /**
     * Adds two integers and returns the result
     * @param a first integer
     * @param b second integer
     * @return sum of a and b
     */
    public static int add(int a, int b) {
        return a + b;
    }
    
    /**
     * Adds two double numbers and returns the result
     * @param a first double
     * @param b second double
     * @return sum of a and b
     */
    public static double add(double a, double b) {
        return a + b;
    }
    
    /**
     * Adds three integers and returns the result
     * @param a first integer
     * @param b second integer
     * @param c third integer
     * @return sum of a, b, and c
     */
    public static int add(int a, int b, int c) {
        return a + b + c;
    }
    
    /**
     * Main method to demonstrate the addition operations
     * @param args command line arguments
     */
    public static void main(String[] args) {
        // Test with integers
        int num1 = 10;
        int num2 = 20;
        System.out.println("Addition of " + num1 + " and " + num2 + " is: " + add(num1, num2));
        
        // Test with three integers
        int num3 = 30;
        System.out.println("Addition of " + num1 + ", " + num2 + ", and " + num3 + " is: " + add(num1, num2, num3));
        
        // Test with double values
        double dnum1 = 15.5;
        double dnum2 = 25.3;
        System.out.println("Addition of " + dnum1 + " and " + dnum2 + " is: " + add(dnum1, dnum2));
    }
}
