public class MaxNumber {
    public static void main(String[] args) {
        int max = 1;
        for (int i = 2; i <= 100; i++) {
            if (i > max) {
                max = i;
            }
        }
        System.out.println("Maximum number from 1 to 100 is: " + max);
    }
}
