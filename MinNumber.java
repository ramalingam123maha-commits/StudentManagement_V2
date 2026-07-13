public class MinNumber {
    public static void main(String[] args) {
        int min = 1;
        for (int i = 1; i <= 100; i++) {
            if (i < min) {
                min = i;
            }
        }
        System.out.println("Minimum number from 1 to 100 is: " + min);
    }
}
